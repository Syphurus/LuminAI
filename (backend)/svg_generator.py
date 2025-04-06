from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
from prisma import Prisma
import openai
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
db = Prisma()

@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SVGRequest(BaseModel):
    prompt: str
    user_id: str

class SVGUpdateRequest(BaseModel):
    prompt: str

@app.post("/generate-svg")
async def generate_svg(request: SVGRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert SVG generator. Only return raw SVG code without explanation."},
                {"role": "user", "content": f"Generate an SVG for this prompt: {request.prompt}"},
            ],
        )

        svg_code = response.choices[0].message["content"]

        svg_entry = await db.generatedsvg.create(
            data={
                "userId": request.user_id,
                "prompt": request.prompt,
                "svg": svg_code,
            }
        )

        return {
            "svg": svg_code,
            "id": svg_entry.id,
            "timestamp": svg_entry.createdAt.isoformat(),
        }

    except Exception as e:
        return {"error": str(e)}

@app.get("/svgs/{user_id}")
async def get_svgs(user_id: str):
    try:
        svgs = await db.generatedsvg.find_many(
            where={"userId": user_id},
            order={"createdAt": "desc"},
        )
        return svgs
    except Exception as e:
        return {"error": str(e)}

@app.delete("/svg/{id}")
async def delete_svg(id: str):
    try:
        deleted = await db.generatedsvg.delete(where={"id": id})
        return {"message": "SVG deleted", "id": deleted.id}
    except Exception as e:
        return {"error": str(e)}

@app.put("/svg/{id}")
async def update_svg(id: str, update: SVGUpdateRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert SVG generator. Only return raw SVG code without explanation."},
                {"role": "user", "content": f"Generate an SVG for this prompt: {update.prompt}"},
            ],
        )

        new_svg = response.choices[0].message["content"]

        updated = await db.generatedsvg.update(
            where={"id": id},
            data={
                "prompt": update.prompt,
                "svg": new_svg,
            }
        )

        return {
            "message": "SVG updated",
            "id": updated.id,
            "prompt": updated.prompt,
            "svg": updated.svg,
            "timestamp": updated.createdAt.isoformat()
        }

    except Exception as e:
        return {"error": str(e)}
