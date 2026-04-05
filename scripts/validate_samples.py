#!/usr/bin/env python3
"""
Compare legacy and improved forensic scoring on the bundled sample set.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "validation" / "sample_expectations.json"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.service import analyze_image_payload


def _mime_type(path: Path) -> str:
    if path.suffix.lower() in {".png"}:
        return "image/png"
    if path.suffix.lower() in {".bmp"}:
        return "image/bmp"
    if path.suffix.lower() in {".tif", ".tiff"}:
        return "image/tiff"
    if path.suffix.lower() in {".webp"}:
        return "image/webp"
    return "image/jpeg"


def _run_model(path: Path, scorer: str) -> dict:
    with path.open("rb") as file_obj:
        payload = analyze_image_payload(
            file_bytes=file_obj.read(),
            filename=path.name,
            content_type=_mime_type(path),
            scorer=scorer,
        )
    return payload


def _acceptable_match(verdict: str, acceptable: list[str]) -> bool:
    return verdict in acceptable


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text())

    rows = []
    for entry in manifest:
        path = ROOT / entry["path"]
        legacy = _run_model(path, "legacy")
        improved = _run_model(path, "improved")
        rows.append(
            {
                "file": entry["path"],
                "expected": entry["expected"],
                "acceptable": entry["acceptable"],
                "legacy_verdict": legacy["verdict"],
                "legacy_prob": legacy["tampering_probability"],
                "improved_verdict": improved["verdict"],
                "improved_prob": improved["tampering_probability"],
                "legacy_ok": _acceptable_match(legacy["verdict"], entry["acceptable"]),
                "improved_ok": _acceptable_match(improved["verdict"], entry["acceptable"]),
                "notes": entry["notes"],
            }
        )

    file_width = max(len(row["file"]) for row in rows)
    print(
        f"{'Sample'.ljust(file_width)}  {'Expected':11}  {'Legacy':22}  {'Improved':22}  {'Result'}"
    )
    print("-" * (file_width + 74))
    for row in rows:
        legacy_text = f"{row['legacy_verdict']} ({row['legacy_prob']:.1f}%)"
        improved_text = f"{row['improved_verdict']} ({row['improved_prob']:.1f}%)"
        if row["improved_ok"] and not row["legacy_ok"]:
            status = "improved"
        elif row["legacy_ok"] and not row["improved_ok"]:
            status = "regressed"
        elif row["legacy_ok"] and row["improved_ok"]:
            status = "same"
        else:
            status = "miss"

        print(
            f"{row['file'].ljust(file_width)}  "
            f"{row['expected'].ljust(11)}  "
            f"{legacy_text.ljust(22)}  "
            f"{improved_text.ljust(22)}  "
            f"{status}"
        )

    legacy_ok = sum(row["legacy_ok"] for row in rows)
    improved_ok = sum(row["improved_ok"] for row in rows)
    print()
    print(f"Legacy acceptable matches:   {legacy_ok}/{len(rows)}")
    print(f"Improved acceptable matches: {improved_ok}/{len(rows)}")


if __name__ == "__main__":
    main()
