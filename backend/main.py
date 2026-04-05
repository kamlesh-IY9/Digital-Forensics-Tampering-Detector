"""
Digital Forensics Tampering Detector - FastAPI Backend
M.Sc Final Year Project - Brainybeam Info-Tech PVT LTD
"""

from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

try:
    from .service import analyze_upload, health_payload
except ImportError:
    from service import analyze_upload, health_payload

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

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

    if FRONTEND_DIST.exists():
        assets_dir = FRONTEND_DIST / "assets"
        if assets_dir.exists():
            app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

        @app.get("/", include_in_schema=False)
        async def serve_frontend_root():
            return FileResponse(FRONTEND_DIST / "index.html")

        @app.get("/{full_path:path}", include_in_schema=False)
        async def serve_frontend_app(full_path: str):
            if full_path.startswith("api/") or full_path == "health":
                raise HTTPException(status_code=404, detail="Not Found")

            requested = FRONTEND_DIST / full_path
            if requested.is_file():
                return FileResponse(requested)

            return FileResponse(FRONTEND_DIST / "index.html")

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
