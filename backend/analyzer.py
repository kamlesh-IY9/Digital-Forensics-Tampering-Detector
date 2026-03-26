"""
Digital Forensics Tampering Detector - Core Analysis Module
M.Sc Final Year Project - Brainybeam Info-Tech PVT LTD

This module contains 5 core forensic analysis functions for detecting image tampering.
"""

import io
import base64
import numpy as np
from PIL import Image, ImageChops, ImageEnhance


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
    # Convert to RGB
    img_rgb = image.convert("RGB")

    # Re-save at controlled JPEG quality
    buffer = io.BytesIO()
    img_rgb.save(buffer, format="JPEG", quality=quality)
    buffer.seek(0)
    compressed = Image.open(buffer).convert("RGB")

    # Compute pixel-level difference
    ela_image = ImageChops.difference(img_rgb, compressed)

    # Calculate maximum difference for normalization
    extrema = ela_image.getextrema()
    max_diff = max([e[1] for e in extrema])

    # Amplify brightness for visibility, capped to prevent overexposure of clean images
    scale = (255.0 / max_diff) if max_diff > 0 else 1.0
    ela_image = ImageEnhance.Brightness(ela_image).enhance(min(scale, 10) * 5)

    # Compute ELA score (95th percentile normalized to 0-100)
    ela_array = np.array(ela_image)
    ela_score = float(np.percentile(ela_array, 95) / 255.0 * 100)

    return ela_image, round(ela_score, 2)


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
    try:
        from scipy.ndimage import gaussian_filter, uniform_filter
    except ImportError:
        return {"available": False}

    # Convert to RGB numpy array
    img_array = np.array(image.convert("RGB")).astype(float)

    scores = []

    # Analyze each color channel
    for ch in range(3):
        channel = img_array[:, :, ch]

        # Extract noise by subtracting smoothed version
        smoothed = gaussian_filter(channel, sigma=1.5)
        noise = channel - smoothed

        # Compute local noise statistics in 32x32 windows
        local_mean = uniform_filter(noise, size=32)
        local_sq_mean = uniform_filter(noise ** 2, size=32)
        local_var = np.clip(local_sq_mean - local_mean ** 2, 0, None)

        # Calculate consistency score
        local_std = np.sqrt(local_var + 1e-6)
        score = float(np.std(local_std))
        scores.append(score)

    # Average across channels and normalize
    avg_score = float(np.mean(scores))
    normalized = min(100.0, avg_score * 8)

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
    # Convert to grayscale and normalize
    ela_gray = np.array(ela_image.convert("L")).astype(float)
    normalized = ela_gray / 255.0

    h, w = ela_gray.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)

    # Color mapping: blue → yellow → red
    rgba[:, :, 0] = np.clip(normalized * 2 * 255, 0, 255).astype(np.uint8)  # Red
    rgba[:, :, 1] = np.clip((1 - abs(normalized * 2 - 1)) * 255, 0, 255).astype(np.uint8)  # Green
    rgba[:, :, 2] = np.clip((1 - normalized * 2) * 255, 0, 255).astype(np.uint8)  # Blue
    rgba[:, :, 3] = np.clip(normalized * 230, 40, 230).astype(np.uint8)  # Alpha

    return Image.fromarray(rgba, "RGBA")


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
