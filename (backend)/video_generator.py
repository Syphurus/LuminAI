import os
import uuid
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import openai
import requests
from prisma import Prisma

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
VIDEO_API_KEY = os.getenv("VIDEO_API_KEY")

app = FastAPI()
db = Prisma()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

class VideoRequest(BaseModel):
    prompt: str
    user_id: str

@app.post("/api/generate_video")
async def generate_video(req: VideoRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        # Step 1: Generate an image using OpenAI
        image_response = openai.Image.create(
            prompt=req.prompt,
            n=1,
            size="1024x1024"
        )
        image_url = image_response["data"][0]["url"]

        # Step 2: Send to DeepMotion for video generation
        video_response = requests.post(
            "https://api.deepmotion.com/v1/animate",
            headers={
                "Authorization": f"Bearer {VIDEO_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "imageUrl": image_url,
                "duration": 8,
                "animationType": "face",  # or "body", based on DeepMotion features
            },
        )

        if video_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to generate video")

        video_url = video_response.json().get("videoUrl")
        if not video_url:
            raise HTTPException(status_code=500, detail="No video URL returned")

        video_id = str(uuid.uuid4())
        await db.generatedvideo.create(
            data={
                "id": video_id,
                "userId": req.user_id,
                "prompt": req.prompt,
                "videoUrl": video_url,
                "createdAt": datetime.utcnow(),
            }
        )
        return {"video_url": video_url, "id": video_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/video_history")
async def get_video_history(user_id: str = Query(...)):
    try:
        videos = await db.generatedvideo.find_many(
            where={"userId": user_id},
            order={"createdAt": "desc"}
        )
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/video_history/{video_id}")
async def delete_video(video_id: str):
    try:
        await db.generatedvideo.delete(where={"id": video_id})
        return {"message": "Video deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("video_generator:app", host="0.0.0.0", port=8002, reload=True)
