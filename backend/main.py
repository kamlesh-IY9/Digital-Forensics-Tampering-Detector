"""
Digital Forensics Tampering Detector - FastAPI Backend
M.Sc Final Year Project - Brainybeam Info-Tech PVT LTD
"""

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

try:
    from .service import analyze_upload, health_payload
except ImportError:
    from service import analyze_upload, health_payload

def create_app():
    app = FastAPI(
        title="Digital Forensics Tampering Detector API",
        description="M.Sc Final Year Project - Brainybeam Info-Tech PVT LTD",
        version="1.0.0",
    )

    # Keep permissive CORS for local development. On Vercel the frontend
    # and API share the same domain, so this does not change behavior.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    @app.get("/api/health")
    async def health_check():
        """Health check endpoint."""
        return health_payload()

    @app.post("/analyze")
    @app.post("/api/analyze")
    async def analyze_image(file: UploadFile = File(...)):
        """Analyze an uploaded image for digital tampering."""
        return JSONResponse(content=await analyze_upload(file))

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
