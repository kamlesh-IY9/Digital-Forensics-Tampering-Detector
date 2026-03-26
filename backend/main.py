"""
Digital Forensics Tampering Detector - FastAPI Backend
M.Sc Final Year Project - Brainybeam Info-Tech PVT LTD
"""

import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io

from analyzer import (
    perform_ela,
    extract_metadata,
    analyze_noise,
    generate_heatmap,
    image_to_base64
)

app = FastAPI(
    title="Digital Forensics Tampering Detector API",
    description="M.Sc Final Year Project - Brainybeam Info-Tech PVT LTD",
    version="1.0.0"
)

# Enable CORS for all origins (development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Digital Forensics API",
        "version": "1.0.0"
    }


@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze uploaded image for digital tampering.

    Performs comprehensive forensic analysis including:
    - Error Level Analysis (ELA)
    - Noise pattern analysis
    - EXIF metadata inspection
    - Heatmap generation

    Returns verdict: AUTHENTIC | SUSPICIOUS | TAMPERED
    """
    # Validate content type
    allowed_types = ["image/jpeg", "image/png", "image/bmp", "image/tiff", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Supported types: JPEG, PNG, BMP, TIFF, WebP"
        )

    # Read file bytes
    try:
        file_bytes = await file.read()
        
        MAX_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB
        if len(file_bytes) > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail="File too large. Maximum allowed size is 20 MB."
            )
            
        file_size_kb = round(len(file_bytes) / 1024, 1)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")

    # Open and verify image
    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.verify()
        # Reopen after verify (verify closes the image)
        image = Image.open(io.BytesIO(file_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Corrupt or invalid image file: {str(e)}")

    # Start timing
    start_time = time.time()

    # Run all 4 forensic analyses
    ela_image, ela_score = perform_ela(image, quality=90)
    metadata = extract_metadata(image, filename=file.filename)
    noise_data = analyze_noise(image)
    heatmap = generate_heatmap(ela_image)

    # Compute tampering probability (0-100)
    score_components = []

    # ELA contribution (max 60 points) - reduced weight for PNG/BMP which inherently misreport ELA
    ela_weight = 0.3 if metadata.get("format", "").upper() in ["PNG", "BMP"] else 0.6
    score_components.append(min(60, ela_score * ela_weight))

    # Editing software detected (30 points)
    if metadata["editing_software"]:
        score_components.append(30)

    # Noise inconsistency (max 20 points)
    if noise_data["available"] and noise_data["inconsistency_score"] > 0:
        score_components.append(min(20, noise_data["inconsistency_score"] * 0.2))

    # Each suspicious metadata tag (7.5 points each)
    for tag in metadata["suspicious_tags"]:
        score_components.append(7.5)

    # Missing EXIF (5 points) -> Only penalize formats that usually contain EXIF
    if not metadata["has_exif"] and metadata.get("format", "").upper() in ["JPEG", "JPG", "TIFF"]:
        score_components.append(5)

    tampering_probability = min(100.0, sum(score_components))

    # Build indicators list
    indicators = []

    # ELA indicator
    if ela_score > 30:
        indicators.append({
            "type": "error_level",
            "severity": "high" if ela_score > 60 else "medium",
            "message": f"Elevated Error Level Analysis score ({ela_score:.1f}%) — indicates possible pixel manipulation"
        })

    # Editing software indicator
    if metadata["editing_software"]:
        indicators.append({
            "type": "metadata_software",
            "severity": "high",
            "message": f"Editing software detected in EXIF: {', '.join(metadata['editing_software'])}"
        })

    # Noise pattern indicator
    if noise_data["available"] and noise_data["suspicious"]:
        indicators.append({
            "type": "noise_pattern",
            "severity": "medium",
            "message": f"Noise pattern inconsistency detected (score: {noise_data['inconsistency_score']:.1f}) — may indicate splicing"
        })

    # Metadata anomaly indicators
    for tag_warning in metadata["suspicious_tags"]:
        indicators.append({
            "type": "metadata_anomaly",
            "severity": "medium",
            "message": tag_warning
        })

    # Missing EXIF indicator
    if not metadata["has_exif"]:
        indicators.append({
            "type": "metadata_missing",
            "severity": "low",
            "message": "No EXIF metadata found — may have been stripped to hide editing history"
        })

    # Determine verdict
    if tampering_probability < 20:
        verdict = "AUTHENTIC"
        verdict_color = "green"
        verdict_desc = "No significant signs of tampering detected"
    elif tampering_probability < 50:
        verdict = "SUSPICIOUS"
        verdict_color = "yellow"
        verdict_desc = "Possible manipulation detected — further review recommended"
    else:
        verdict = "TAMPERED"
        verdict_color = "red"
        verdict_desc = "Strong indicators of image manipulation or forgery detected"

    # Calculate processing time
    processing_time_s = round(time.time() - start_time, 2)

    # Build response
    response = {
        "verdict": verdict,
        "verdict_color": verdict_color,
        "verdict_desc": verdict_desc,
        "tampering_probability": round(tampering_probability, 1),
        "ela_score": ela_score,
        "noise_analysis": noise_data,
        "indicators": indicators,
        "metadata": metadata,
        "images": {
            "original": image_to_base64(image.convert("RGB"), "JPEG"),
            "ela": image_to_base64(ela_image, "PNG"),
            "heatmap": image_to_base64(heatmap, "PNG")
        },
        "file_info": {
            "filename": file.filename,
            "size_kb": file_size_kb,
            "content_type": file.content_type
        },
        "processing_time_s": processing_time_s
    }

    return JSONResponse(content=response)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
