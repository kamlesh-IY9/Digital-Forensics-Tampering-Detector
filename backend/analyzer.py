"""
Digital Forensics Tampering Detector - Core Analysis Module
M.Sc Final Year Project - Brainybeam Info-Tech PVT LTD

This module contains 5 core forensic analysis functions for detecting image tampering.
"""

import io
import base64
from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps, ImageStat


def _percentile_from_histogram(histogram, percentile):
    total = sum(histogram)
    if total <= 0:
        return 0

    threshold = total * (percentile / 100.0)
    cumulative = 0
    for value, count in enumerate(histogram):
        cumulative += count
        if cumulative >= threshold:
            return value
    return len(histogram) - 1


def measure_ela(image, quality=90):
    """
    Measure raw ELA characteristics and generate an amplified display image.

    The display image is intentionally brightened for visualization, while the
    numeric score is derived from the raw JPEG-difference data so clean images
    are not over-penalized simply because the preview is amplified.
    """
    img_rgb = image.convert("RGB")

    buffer = io.BytesIO()
    img_rgb.save(buffer, format="JPEG", quality=quality)
    buffer.seek(0)
    compressed = Image.open(buffer).convert("RGB")

    diff_image = ImageChops.difference(img_rgb, compressed)
    diff_gray = diff_image.convert("L")
    histogram = diff_gray.histogram()
    stat = ImageStat.Stat(diff_gray)

    raw_p95 = float(_percentile_from_histogram(histogram, 95) / 255.0 * 100)
    raw_p99 = float(_percentile_from_histogram(histogram, 99) / 255.0 * 100)
    raw_mean = float(stat.mean[0] / 255.0 * 100)

    # Calibrated heuristic score used for risk scoring.
    calibrated_score = (
        max(0.0, raw_p99 - 0.7) * 20.0
        + max(0.0, raw_p95 - 0.3) * 12.0
        + raw_mean * 15.0
    )

    extrema = diff_image.getextrema()
    max_diff = max([e[1] for e in extrema])
    scale = (255.0 / max_diff) if max_diff > 0 else 1.0
    display_image = ImageEnhance.Brightness(diff_image).enhance(min(scale, 10) * 5)

    return {
        "display_image": display_image,
        "score": round(min(100.0, calibrated_score), 2),
        "raw_p95": round(raw_p95, 3),
        "raw_p99": round(raw_p99, 3),
        "raw_mean": round(raw_mean, 3),
    }


def perform_ela(image, quality=90):
    """
    Perform Error Level Analysis (ELA) on an image.

    ELA works by re-saving the image at a known JPEG quality level and comparing
    the result against the original. Authentic images have uniform error levels.
    Tampered regions show higher error levels because they were saved at a different
    quality than the rest of the image.

    Args:
        image: PIL Image object
        quality: JPEG quality level for re-compression (default 90)

    Returns:
        tuple: (ela_image: PIL.Image, ela_score: float)
            - ela_image: Amplified difference image showing error levels
            - ela_score: Normalized score 0-100 (higher = more likely tampered)
    """
    ela_data = measure_ela(image, quality=quality)
    return ela_data["display_image"], ela_data["score"]


def extract_metadata(image, filename=""):
    """
    Extract and analyze EXIF metadata for tampering indicators.

    Examines EXIF data for signs of manipulation including:
    - Editing software in metadata
    - Date/time inconsistencies
    - Missing camera information

    Args:
        image: PIL Image object
        filename: Optional filename for format detection

    Returns:
        dict: Comprehensive metadata analysis with keys:
            - format, mode, width, height, size_display
            - exif: dict of EXIF tags
            - has_exif: bool
            - editing_software: list of detected software names
            - suspicious_tags: list of warning messages
            - exif_count: number of EXIF fields
    """
    metadata = {
        "format": image.format or (filename.rsplit(".", 1)[-1].upper() if "." in filename else "UNKNOWN"),
        "mode": image.mode,
        "width": image.width,
        "height": image.height,
        "size_display": f"{image.width} x {image.height} px",
    }

    exif_data = {}
    editing_software = []
    suspicious_tags = []

    try:
        from PIL.ExifTags import TAGS
        exif = image._getexif()

        if exif:
            # Map tag IDs to names
            for tag_id, value in exif.items():
                tag = TAGS.get(tag_id, str(tag_id))

                # Decode bytes values
                if isinstance(value, bytes):
                    try:
                        value = value.decode("utf-8", errors="ignore").strip("\x00")
                    except Exception:
                        value = value.hex()

                exif_data[str(tag)] = str(value)

            # Detect editing software
            sw = exif_data.get("Software", "").lower()
            software_list = ["photoshop", "gimp", "lightroom", "paint.net",
                           "affinity", "illustrator", "capture one", "darktable"]
            for s in software_list:
                if s in sw:
                    editing_software.append(s.title())

            # Flag suspicious conditions
            if "DateTime" in exif_data and "DateTimeOriginal" in exif_data:
                if exif_data["DateTime"] != exif_data["DateTimeOriginal"]:
                    suspicious_tags.append("Modification date differs from original capture date")

            if not exif_data.get("Make") and not exif_data.get("Model"):
                suspicious_tags.append("No camera make/model recorded")

    except Exception as e:
        pass  # No EXIF data available

    metadata.update({
        "exif": exif_data,
        "has_exif": len(exif_data) > 0,
        "editing_software": editing_software,
        "suspicious_tags": suspicious_tags,
        "exif_count": len(exif_data),
    })

    return metadata


def analyze_noise(image):
    """
    Analyze noise pattern inconsistencies that indicate splicing/manipulation.

    Authentic images have consistent noise patterns from the camera sensor.
    Manipulated images (splicing, copy-paste) show inconsistent noise because
    different regions come from different sources or processing pipelines.

    Args:
        image: PIL Image object

    Returns:
        dict: {
            inconsistency_score: float (0-100),
            suspicious: bool (True if score > 25),
            available: bool (True if scipy available)
        }
    """
    scores = []
    block_size = 32

    for channel in image.convert("RGB").split():
        smoothed = channel.filter(ImageFilter.GaussianBlur(radius=1.5))
        noise = ImageChops.difference(channel, smoothed)

        local_scores = []
        for top in range(0, noise.height, block_size):
            for left in range(0, noise.width, block_size):
                region = noise.crop((left, top, min(left + block_size, noise.width), min(top + block_size, noise.height)))
                stat = ImageStat.Stat(region)
                if stat.stddev:
                    local_scores.append(stat.stddev[0])

        if len(local_scores) > 1:
            local_mean = sum(local_scores) / len(local_scores)
            local_variance = sum((score - local_mean) ** 2 for score in local_scores) / len(local_scores)
            scores.append(local_variance ** 0.5)

    if not scores:
        return {"available": False}

    avg_score = sum(scores) / len(scores)
    normalized = min(100.0, avg_score * 4.6)

    return {
        "inconsistency_score": round(normalized, 2),
        "suspicious": normalized > 25,
        "available": True
    }


def generate_heatmap(ela_image):
    """
    Generate color-coded RGBA heatmap from ELA output for visualization.

    Converts grayscale ELA output to intuitive color gradient:
    - Blue: Clean regions (low error level)
    - Yellow: Mid-level anomalies
    - Red: Suspicious/tampered regions (high error level)

    Args:
        ela_image: PIL Image object (ELA output)

    Returns:
        PIL.Image: RGBA image with color-coded heatmap
    """
    ela_gray = ela_image.convert("L")
    heatmap = ImageOps.colorize(
        ela_gray,
        black="#0a3bff",
        mid="#ffc428",
        white="#ff4030",
    ).convert("RGBA")

    alpha = ela_gray.point(lambda pixel: max(40, min(230, int(pixel / 255.0 * 230))))
    heatmap.putalpha(alpha)
    return heatmap


def image_to_base64(image, fmt="PNG"):
    """
    Encode PIL image as base64 string for JSON transmission.

    Args:
        image: PIL Image object
        fmt: Image format (default "PNG")

    Returns:
        str: Base64-encoded image string
    """
    buffer = io.BytesIO()
    image.save(buffer, format=fmt)
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")
