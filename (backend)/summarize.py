import os
import uuid
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import openai
from prisma import Prisma

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
db = Prisma()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

# Define request model - expects 'prompt' and 'user_id'
class SummarizeRequest(BaseModel):
    prompt: str
    user_id: str

@app.post("/api/summarize")
async def summarize_text(req: SummarizeRequest):
    input_text = req.prompt.strip()
    if not input_text:
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    try:
        # Generate summary using OpenAI ChatCompletion API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that gives 1-line concise summaries."},
                {"role": "user", "content": f"Summarize this in under 1 line: {input_text}"}
            ],
            temperature=0.3,
            max_tokens=50
        )
        summary = response["choices"][0]["message"]["content"].strip()
        print("Generated summary:", summary)  # Log for debugging

        summary_id = str(uuid.uuid4())
        saved_summary = await db.generatedsummary.create(
            data={
                "id": summary_id,
                "userId": req.user_id,
                "prompt": input_text,
                "summary": summary,
                "createdAt": datetime.utcnow(),
            }
        )
        return {"summary": saved_summary.summary, "id": saved_summary.id}
    except Exception as e:
        print("Error in summarization:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/summarize_history")
async def get_summary_history(user_id: str = Query(...)):
    try:
        summaries = await db.generatedsummary.find_many(
            where={"userId": user_id},
            order={"createdAt": "desc"}
        )
        return summaries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/summarize_history/{summary_id}")
async def delete_summary(summary_id: str):
    try:
        await db.generatedsummary.delete(where={"id": summary_id})
        return {"message": "Summary deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("summarize:app", host="0.0.0.0", port=8000, reload=True)
