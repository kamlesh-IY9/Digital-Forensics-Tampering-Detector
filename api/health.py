from fastapi import FastAPI

from backend.service import health_payload

app = FastAPI()


@app.get("/")
async def health_check():
    return health_payload()
