from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from backend.service import analyze_upload

app = FastAPI()


@app.post("/")
async def analyze_image(file: UploadFile = File(...)):
    return JSONResponse(content=await analyze_upload(file))
