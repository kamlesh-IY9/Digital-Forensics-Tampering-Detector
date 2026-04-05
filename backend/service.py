"""
Shared backend service helpers used by local FastAPI and Vercel functions.
"""

import io
import time

from fastapi import HTTPException, UploadFile
from PIL import Image

try:
    from .analyzer import (
        analyze_noise,
        extract_metadata,
        measure_ela,
        generate_heatmap,
        image_to_base64,
    )
except ImportError:
    from analyzer import (
        analyze_noise,
        extract_metadata,
        measure_ela,
        generate_heatmap,
        image_to_base64,
    )


ALLOWED_TYPES = {"image/jpeg", "image/png", "image/bmp", "image/tiff", "image/webp"}
MAX_SIZE_BYTES = 20 * 1024 * 1024


def health_payload():
    return {
        "status": "online",
        "service": "Digital Forensics API",
        "version": "1.0.0",
    }


def _round_points(value):
    return round(float(value), 1)


def _build_legacy_assessment(metadata, noise_data, ela_score):
    score_components = []

    ela_weight = 0.3 if metadata.get("format", "").upper() in {"PNG", "BMP"} else 0.6
    score_components.append(("ELA score", min(60.0, ela_score * ela_weight)))

    if metadata["editing_software"]:
        score_components.append(("Editing software detected", 30.0))

    if noise_data["available"] and noise_data["inconsistency_score"] > 0:
        score_components.append(
            ("Noise inconsistency", min(20.0, noise_data["inconsistency_score"] * 0.2))
        )

    for tag in metadata["suspicious_tags"]:
        score_components.append((tag, 7.5))

    if not metadata["has_exif"] and metadata.get("format", "").upper() in {"JPEG", "JPG", "TIFF"}:
        score_components.append(("Missing EXIF metadata", 5.0))

    probability = min(100.0, sum(points for _, points in score_components))
    if probability < 20:
        verdict = "AUTHENTIC"
        verdict_color = "green"
        verdict_desc = "No significant signs of tampering detected"
    elif probability < 50:
        verdict = "SUSPICIOUS"
        verdict_color = "yellow"
        verdict_desc = "Possible manipulation detected — further review recommended"
    else:
        verdict = "TAMPERED"
        verdict_color = "red"
        verdict_desc = "Strong indicators of image manipulation or forgery detected"

    return {
        "verdict": verdict,
        "verdict_color": verdict_color,
        "verdict_desc": verdict_desc,
        "tampering_probability": round(probability, 1),
        "score_breakdown": [
            {"label": label, "points": _round_points(points)}
            for label, points in score_components
            if points > 0
        ],
    }


def _build_improved_assessment(metadata, noise_data, ela_score):
    image_format = metadata.get("format", "").upper()
    is_exif_native_format = image_format in {"JPEG", "JPG", "TIFF"}
    has_editing_software = bool(metadata["editing_software"])
    has_camera_gap = any("camera make/model" in tag.lower() for tag in metadata["suspicious_tags"])
    metadata_gap = is_exif_native_format and not metadata["has_exif"]
    moderate_noise = noise_data.get("available") and noise_data.get("inconsistency_score", 0) >= 24
    major_noise = noise_data.get("available") and noise_data.get("inconsistency_score", 0) >= 30
    medium_ela = ela_score >= 18
    strong_ela = ela_score >= 42

    components = []
    evidence_types = set()

    if medium_ela:
        ela_points = min(28.0, max(0.0, ela_score - 12.0) * 0.72)
        components.append(("ELA inconsistency", ela_points))
        evidence_types.add("ela")

    if has_editing_software:
        components.append(("Editing software signature", 34.0))
        evidence_types.add("metadata")

    if has_camera_gap:
        components.append(("Incomplete camera metadata", 6.0))
        evidence_types.add("metadata")

    if metadata_gap:
        components.append(("Missing EXIF metadata", 4.0))
        evidence_types.add("metadata")

    if moderate_noise:
        components.append(("Noise inconsistency", 10.0 if major_noise else 6.0))
        evidence_types.add("noise")

    if has_editing_software and (has_camera_gap or metadata_gap or moderate_noise):
        components.append(("Corroborated metadata anomaly", 12.0))

    if strong_ela and metadata_gap:
        components.append(("ELA + missing metadata correlation", 8.0))

    if strong_ela and major_noise:
        components.append(("ELA + noise correlation", 8.0))

    probability = sum(points for _, points in components)

    corroborated = len(evidence_types) >= 2
    if strong_ela and not corroborated and is_exif_native_format and metadata["has_exif"]:
        probability *= 0.65

    probability = min(100.0, probability)

    if has_editing_software and (has_camera_gap or metadata_gap or moderate_noise):
        verdict = "TAMPERED"
        verdict_color = "red"
        verdict_desc = "Multiple corroborating forensic signals suggest image manipulation"
    elif probability >= 50 and len(evidence_types) >= 2:
        verdict = "TAMPERED"
        verdict_color = "red"
        verdict_desc = "Multiple corroborating forensic signals suggest image manipulation"
    elif probability >= 22 or (len(evidence_types) >= 2 and probability >= 18):
        verdict = "SUSPICIOUS"
        verdict_color = "yellow"
        verdict_desc = "Mixed forensic signals detected — manual review is recommended"
    else:
        verdict = "AUTHENTIC"
        verdict_color = "green"
        verdict_desc = "Low-signal forensic profile with no strong corroborating tampering evidence"

    if verdict == "AUTHENTIC":
        threshold_distance = max(0.0, 22.0 - probability)
        base_confidence = 50.0 if not evidence_types else 34.0 + len(evidence_types) * 5.0
        confidence_score = base_confidence + min(18.0, threshold_distance * 0.8)
        if corroborated and probability > 10:
            confidence_score -= 8.0
    elif verdict == "TAMPERED":
        threshold_distance = max(0.0, probability - 50.0)
        confidence_score = 48.0 + len(evidence_types) * 10.0 + 8.0 + min(18.0, threshold_distance * 0.7)
    else:
        threshold_distance = min(abs(probability - 22.0), abs(50.0 - probability))
        confidence_score = 46.0 + len(evidence_types) * 9.0 + (8.0 if corroborated else 0.0) + min(10.0, threshold_distance * 0.4)

    confidence_score = min(100.0, confidence_score)
    if confidence_score >= 80:
        confidence_level = "HIGH"
    elif confidence_score >= 60:
        confidence_level = "MEDIUM"
    else:
        confidence_level = "LOW"

    if verdict == "TAMPERED":
        analysis_summary = "Independent signals agree strongly enough to justify a high-risk tampering verdict."
    elif verdict == "SUSPICIOUS":
        analysis_summary = "Some forensic signals are present, but the evidence is mixed and should be reviewed by a human analyst."
    elif corroborated:
        analysis_summary = "The file looks mostly clean overall, but a few low-strength anomalies are still worth noting."
    else:
        analysis_summary = "The file shows a mostly clean forensic profile with no strong corroborating anomalies."

    return {
        "verdict": verdict,
        "verdict_color": verdict_color,
        "verdict_desc": verdict_desc,
        "tampering_probability": round(probability, 1),
        "confidence_score": round(confidence_score, 1),
        "confidence_level": confidence_level,
        "analysis_summary": analysis_summary,
        "score_breakdown": [
            {"label": label, "points": _round_points(points)}
            for label, points in components
            if points > 0
        ],
        "signal_summary": {
            "evidence_types": sorted(evidence_types),
            "corroborated": corroborated,
            "signal_count": len([points for _, points in components if points > 0]),
        },
    }


def analyze_image_payload(file_bytes, filename, content_type, scorer="improved"):
    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid file type: {content_type}. "
                "Supported types: JPEG, PNG, BMP, TIFF, WebP"
            ),
        )

    if len(file_bytes) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File too large. Maximum allowed size is 20 MB.",
        )

    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.verify()
        image = Image.open(io.BytesIO(file_bytes))
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Corrupt or invalid image file: {exc}",
        ) from exc

    start_time = time.time()
    file_size_kb = round(len(file_bytes) / 1024, 1)

    ela_data = measure_ela(image, quality=90)
    ela_image = ela_data["display_image"]
    ela_score = ela_data["score"]
    metadata = extract_metadata(image, filename=filename)
    noise_data = analyze_noise(image)
    heatmap = generate_heatmap(ela_image)

    assessment = (
        _build_legacy_assessment(metadata, noise_data, ela_score)
        if scorer == "legacy"
        else _build_improved_assessment(metadata, noise_data, ela_score)
    )

    indicators = []
    if ela_score >= 18:
        indicators.append(
            {
                "type": "error_level",
                "severity": "high" if ela_score >= 55 else "medium",
                "message": (
                    f"ELA inconsistency score ({ela_score:.1f}%) suggests non-uniform compression or pixel edits"
                ),
            }
        )

    if metadata["editing_software"]:
        indicators.append(
            {
                "type": "metadata_software",
                "severity": "high",
                "message": (
                    "Editing software detected in EXIF: "
                    + ", ".join(metadata["editing_software"])
                ),
            }
        )

    if noise_data["available"] and noise_data["inconsistency_score"] >= 24:
        indicators.append(
            {
                "type": "noise_pattern",
                "severity": "high" if noise_data["inconsistency_score"] >= 30 else "medium",
                "message": (
                    "Noise pattern inconsistency detected "
                    f"(score: {noise_data['inconsistency_score']:.1f}) "
                    "— may indicate local editing or splicing"
                ),
            }
        )

    for tag_warning in metadata["suspicious_tags"]:
        indicators.append(
            {
                "type": "metadata_anomaly",
                "severity": "medium",
                "message": tag_warning,
            }
        )

    if not metadata["has_exif"] and metadata.get("format", "").upper() in {"JPEG", "JPG", "TIFF"}:
        indicators.append(
            {
                "type": "metadata_missing",
                "severity": "low",
                "message": (
                    "Expected EXIF metadata is missing, which can happen when editing history is stripped"
                ),
            }
        )

    return {
        "verdict": assessment["verdict"],
        "verdict_color": assessment["verdict_color"],
        "verdict_desc": assessment["verdict_desc"],
        "tampering_probability": assessment["tampering_probability"],
        "ela_score": ela_score,
        "ela_metrics": {
            "raw_p95": ela_data["raw_p95"],
            "raw_p99": ela_data["raw_p99"],
            "raw_mean": ela_data["raw_mean"],
        },
        "noise_analysis": noise_data,
        "indicators": indicators,
        "metadata": metadata,
        "images": {
            "original": image_to_base64(image.convert("RGB"), "JPEG"),
            "ela": image_to_base64(ela_image, "PNG"),
            "heatmap": image_to_base64(heatmap, "PNG"),
        },
        "file_info": {
            "filename": filename,
            "size_kb": file_size_kb,
            "content_type": content_type,
        },
        "processing_time_s": round(time.time() - start_time, 2),
        "confidence_score": assessment.get("confidence_score", 0.0),
        "confidence_level": assessment.get("confidence_level", "MEDIUM"),
        "analysis_summary": assessment.get("analysis_summary", assessment["verdict_desc"]),
        "score_breakdown": assessment.get("score_breakdown", []),
        "signal_summary": assessment.get(
            "signal_summary",
            {"evidence_types": [], "corroborated": False, "signal_count": len(indicators)},
        ),
        "scoring_model": scorer,
    }


async def analyze_upload(file: UploadFile):
    """Run the full forensic analysis pipeline for an uploaded image."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid file type: {file.content_type}. "
                "Supported types: JPEG, PNG, BMP, TIFF, WebP"
            ),
        )

    try:
        file_bytes = await file.read()
        if len(file_bytes) > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail="File too large. Maximum allowed size is 20 MB.",
            )
        file_size_kb = round(len(file_bytes) / 1024, 1)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Error reading file: {exc}") from exc

    return analyze_image_payload(
        file_bytes=file_bytes,
        filename=file.filename,
        content_type=file.content_type,
        scorer="improved",
    )
