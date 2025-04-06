from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import openai
import os
from prisma import Prisma

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prisma = Prisma()

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

class PromptInput(BaseModel):
    prompt: str
    user_id: str

class GhibliImageResponse(BaseModel):
    ghibli_image_url: str

@app.post("/api/ghibli-text", response_model=GhibliImageResponse)
async def generate_ghibli_image(data: PromptInput):
    try:
        full_prompt = (
            f"{data.prompt}, Studio Ghibli style, vibrant pastel colors, dreamy lighting, "
            "whimsical and delicate details, clean anime lines, and a magical fantasy background. "
            "Keep the subject's identity and facial features clear and attractive."
        )

        response = openai.Image.create(
            prompt=full_prompt,
            n=1,
            size="1024x1024"
        )
        image_url = response["data"][0]["url"]

        await prisma.generatedghibli.create(
            data={
                "userId": data.user_id,
                "prompt": data.prompt,
                "imageUrl": image_url
            }
        )

        return GhibliImageResponse(ghibli_image_url=image_url)

    except Exception as e:
        print("Error generating image:", e)
        raise HTTPException(status_code=500, detail="Image generation failed")

@app.get("/api/ghibli-image-history")
async def get_ghibli_image_history(user_id: str):
    try:
        images = await prisma.generatedghibli.find_many(
            where={"userId": user_id},
            order={"createdAt": "desc"}
        )
        return images
    except Exception as e:
        print("Error fetching images:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch image history")

@app.delete("/api/ghibli-image-history/{id}")
async def delete_ghibli_image(id: str):
    try:
        await prisma.generatedghibli.delete(where={"id": id})
        return {"message": f"Ghibli image with id {id} deleted successfully"}
    except Exception as e:
        print("Error deleting image:", e)
        raise HTTPException(status_code=500, detail="Failed to delete image")

@app.patch("/api/ghibli-image-history/{id}")
async def edit_ghibli_image_prompt(id: str, prompt_data: dict):
    try:
        updated = await prisma.generatedghibli.update(
            where={"id": id},
            data={"prompt": prompt_data["prompt"]}
        )
        return updated
    except Exception as e:
        print("Error editing image:", e)
        raise HTTPException(status_code=500, detail="Failed to update image prompt")
