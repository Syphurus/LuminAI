import os
import uuid
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import openai
from prisma import Prisma

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
db = Prisma()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use your frontend domain in production
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

class ImageRequest(BaseModel):
    prompt: str
    user_id: str

@app.post("/api/generate_image")
async def generate_image(req: ImageRequest):
    try:
        # Generate image using OpenAI's DALL·E (v0.28.1 syntax)
        response = openai.Image.create(
            prompt=req.prompt,
            n=1,
            size="1024x1024"
        )
        image_url = response["data"][0]["url"]
        image_id = str(uuid.uuid4())

        await db.generatedimage.create(
            data={
                "id": image_id,
                "userId": req.user_id,
                "prompt": req.prompt,
                "imageUrl": image_url,
                "createdAt": datetime.utcnow(),
            }
        )
        return {"image_url": image_url, "id": image_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/image_history")
async def get_image_history(user_id: str = Query(...)):
    try:
        images = await db.generatedimage.find_many(
            where={"userId": user_id},
            order={"createdAt": "desc"}
        )
        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/image_history/{image_id}")
async def delete_image(image_id: str):
    try:
        await db.generatedimage.delete(where={"id": image_id})
        return {"message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("image_generation:app", host="0.0.0.0", port=8001, reload=True)
