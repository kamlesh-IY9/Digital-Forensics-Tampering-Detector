# Digital Forensics Tampering Detector

```
╔══════════════════════════════════════════╗
║   Digital Forensics Tampering Detector   ║
║   M.Sc Final Year Project                ║
║   Brainybeam Info-Tech PVT LTD           ║
╚══════════════════════════════════════════╝
```

## Project Details

- **Title:** Digital Forensics Tampering Detector
- **Abstract:** This project develops a computer vision-based system capable of detecting digital tampering in images and documents used as evidence. ML models analyze noise patterns, compression artifacts, and pixel inconsistencies to identify manipulated regions. Metadata validation helps uncover editing history or suspicious file alterations. The system highlights forged or modified sections with detailed forensic markings. This solution strengthens digital evidence authentication and enhances reliability in legal investigations.
- **Keywords:** Technology, Data Science & Machine Learning With Data Analytics
- **Technology:** Data Science & Machine Learning With Data Analytics
- **Development Tools:** Jupyter Notebook / JupyterLab – Experimentation
- **Programming Language:** Python – Primary language for data science & ML
- **Company:** Brainybeam Info-Tech PVT LTD

## Prerequisites

- **Python** 3.10 or higher
- **Node.js** 18 or higher
- **npm** 8 or higher

## Quick Start (Single Command)

Follow these steps to get the entire application running:

### Step 1: Clone or download the project
```bash
cd "CLG Project."
```

### Step 2: Install concurrently
```bash
npm install
```

### Step 3: Install all dependencies (Python + React)
```bash
npm run setup
```

### Step 4: Launch EVERYTHING with one command
```bash
npm start
```

Then open your browser to: **http://localhost:5173**

## What `npm start` Does

The `npm start` command uses **concurrently** to run both servers simultaneously:

- **FastAPI Backend** on port 8000 (uvicorn with auto-reload)
- **React + Vite Frontend** on port 5173

Both logs appear color-coded in the same terminal window:
- **API** logs in cyan
- **UI** logs in magenta

This provides a seamless development experience where the entire stack launches with a single command.

## Manual Setup (Alternative - Two Terminals)

If you prefer to run the servers separately:

### Terminal 1: Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:5173**

## Jupyter Notebook (Experimentation)

To explore the forensic algorithms interactively:

```bash
cd notebooks
jupyter notebook forensics_experimentation.ipynb
```

The notebook contains:
- Step-by-step walkthrough of all forensic algorithms
- Error Level Analysis (ELA) demonstration
- Noise pattern analysis with visualizations
- Metadata extraction and EXIF inspection
- Heatmap generation
- Combined scoring and verdict computation
- Full visual report generation

## Complete Project Structure

```
digital-forensics-detector/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── analyzer.py                # 5 core forensic functions
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite configuration
│   ├── package.json               # Frontend dependencies
│   └── src/
│       ├── main.jsx               # React entry point
│       ├── App.jsx                # Main app component
│       ├── index.css              # Global styles
│       └── components/
│           ├── UploadZone.jsx     # File upload interface
│           ├── ComparisonView.jsx # Image comparison viewer
│           ├── ForensicReport.jsx # Analysis report panel
│           └── AboutSection.jsx   # Project information
├── notebooks/
│   └── forensics_experimentation.ipynb  # Jupyter notebook
├── package.json                   # Root package (concurrently setup)
├── start.sh                       # Backup shell script
└── README.md                      # This file
```

## API Documentation

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| GET | `/health` | Health check endpoint | None | `{"status": "online", "service": "Digital Forensics API", "version": "1.0.0"}` |
| POST | `/api/analyze` | Analyze image for tampering | `multipart/form-data` with `file` field (image) | JSON with verdict, probability, scores, indicators, metadata, base64 images |

### `/api/analyze` Response Schema

```json
{
  "verdict": "AUTHENTIC|SUSPICIOUS|TAMPERED",
  "verdict_color": "green|yellow|red",
  "verdict_desc": "Description of verdict",
  "tampering_probability": 0.0,
  "ela_score": 0.0,
  "noise_analysis": {
    "inconsistency_score": 0.0,
    "suspicious": false,
    "available": true
  },
  "indicators": [
    {
      "type": "error_level|metadata_software|noise_pattern|metadata_anomaly|metadata_missing",
      "severity": "high|medium|low",
      "message": "Description of indicator"
    }
  ],
  "metadata": {
    "format": "JPEG",
    "mode": "RGB",
    "width": 1920,
    "height": 1080,
    "size_display": "1920 x 1080 px",
    "exif": {},
    "has_exif": false,
    "editing_software": [],
    "suspicious_tags": [],
    "exif_count": 0
  },
  "images": {
    "original": "base64_string",
    "ela": "base64_string",
    "heatmap": "base64_string"
  },
  "file_info": {
    "filename": "image.jpg",
    "size_kb": 1234.5,
    "content_type": "image/jpeg"
  },
  "processing_time_s": 1.23
}
```

## Verdict Thresholds

| Score Range | Verdict | Color | Description |
|-------------|---------|-------|-------------|
| 0 - 19 | **AUTHENTIC** | 🟢 Green | No significant signs of tampering detected. Image appears genuine with consistent error levels and metadata. |
| 20 - 50 | **SUSPICIOUS** | 🟡 Yellow | Possible manipulation detected. Image shows some inconsistencies that warrant further review and investigation. |
| 51 - 100 | **TAMPERED** | 🔴 Red | Strong indicators of image manipulation or forgery detected. Multiple forensic red flags present. |

## Forensic Techniques Explained

| Technique | How It Works | What It Detects |
|-----------|--------------|-----------------|
| **Error Level Analysis (ELA)** | Re-saves image at known JPEG quality and measures pixel-level differences. Tampered regions show different error levels because they were saved at different qualities. | Copy-paste forgery, clone stamping, region splicing, inconsistent compression artifacts |
| **Noise Pattern Analysis** | Analyzes local noise variance across the image using Gaussian and uniform filters. Authentic images have consistent sensor noise; tampered images show noise inconsistencies. | Splicing from different sources, copy-paste from different cameras, digital manipulation that alters noise patterns |
| **EXIF Metadata Inspection** | Extracts and validates EXIF metadata including camera make/model, date/time information, and software signatures. | Editing software usage (Photoshop, GIMP, etc.), date/time mismatches, stripped metadata, missing camera information |
| **Compression Artifact Detection** | Examines JPEG compression artifacts and their distribution across the image. Inconsistent artifacts indicate manipulation. | Multiple save operations, region-specific editing, format conversions |

## Tampering Probability Calculation

The system computes a weighted tampering probability (0-100%) based on multiple forensic indicators:

- **ELA Score** (max 60 points): Contribution = `min(60, ela_score × 0.6)`
- **Editing Software Detected** (30 points): Presence of editing software in EXIF
- **Noise Inconsistency** (max 20 points): Contribution = `min(20, noise_score × 0.2)`
- **Suspicious Metadata Tags** (7.5 points each): Date mismatches, missing camera info
- **Missing EXIF** (5 points): No EXIF metadata present

**Final Score** = `min(100, sum of all components)`

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend Framework** | FastAPI 0.115.5 | High-performance async API server |
| **Web Server** | Uvicorn 0.32.1 | ASGI server with auto-reload |
| **Image Processing** | Pillow 11.0.0 | PIL fork for image manipulation |
| **Scientific Computing** | NumPy 2.1.3 | Numerical array operations |
| **Advanced Analysis** | SciPy 1.14.1 | Gaussian/uniform filters for noise analysis |
| **File Uploads** | python-multipart 0.0.18 | Multipart form data parsing |
| **Frontend Framework** | React 18.3.1 | UI component library |
| **Build Tool** | Vite 6.0.1 | Fast frontend build tool |
| **Icons** | lucide-react 0.460.0 | Modern icon library |
| **Process Manager** | concurrently 9.1.0 | Run multiple commands concurrently |
| **Experimentation** | Jupyter Notebook | Interactive algorithm development |
| **Visualization** | Matplotlib | Forensic report visualizations |

## Troubleshooting

### Port 8000 already in use
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9

# Or change the port in backend/main.py and root package.json
```

### Port 5173 already in use
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or edit frontend/vite.config.js to use a different port
```

### Python not found
```bash
# Check Python installation
python3 --version

# Ensure Python 3.10+ is installed
# On Ubuntu/Debian:
sudo apt install python3.10

# On macOS:
brew install python@3.10
```

### pip install fails
```bash
# Try using pip3 explicitly
pip3 install -r backend/requirements.txt

# Or use python -m pip
python3 -m pip install -r backend/requirements.txt

# Upgrade pip first
python3 -m pip install --upgrade pip
```

### concurrently not found
```bash
# Install concurrently first from the root directory
npm install

# Then run setup
npm run setup
```

### Frontend can't reach API
- Ensure backend is running on port 8000: `curl http://localhost:8000/health`
- Check Vite proxy configuration in `frontend/vite.config.js`
- Verify CORS is enabled in `backend/main.py`
- Check browser console for network errors

### Image upload fails
- Check file size is under 20 MB
- Ensure file type is supported (JPEG, PNG, BMP, TIFF, WebP)
- Verify the image file is not corrupted
- Check backend logs for detailed error messages

### Dependencies installation hanging
```bash
# For Python: Use --no-cache-dir flag
pip install --no-cache-dir -r backend/requirements.txt

# For Node: Clear npm cache
npm cache clean --force
npm install
```

## Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload --port 8000
```
- FastAPI auto-reloads on code changes
- Access interactive API docs at: http://localhost:8000/docs

### Frontend Development
```bash
cd frontend
npm run dev
```
- Vite hot module replacement (HMR) for instant updates
- React Fast Refresh preserves component state

### Testing Backend Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Analyze image
curl -X POST http://localhost:8000/api/analyze \
  -F "file=@path/to/image.jpg" \
  | jq
```

## Production Build

### Build Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Deploy Backend
The FastAPI application can be deployed using:
- **Uvicorn** (production mode): `uvicorn main:app --host 0.0.0.0 --port 8000`
- **Gunicorn** with Uvicorn workers: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
- **Docker** container
- **Cloud platforms**: AWS Lambda, Google Cloud Run, Azure Functions

## License

M.Sc Final Year Project
**Brainybeam Info-Tech PVT LTD**

---

## Contributors

This project was developed as part of M.Sc Final Year research in:
- **Technology:** Data Science & Machine Learning With Data Analytics
- **Domain:** Computer Vision & Digital Forensics
- **Tools:** Jupyter Notebook / JupyterLab – Experimentation
- **Language:** Python – Primary language for data science & ML

---

## Support

For questions or issues, please refer to:
- Backend API documentation: http://localhost:8000/docs
- Frontend development: Check browser console for errors
- Jupyter notebook: Run all cells sequentially for best results

---

**Digital Forensics Tampering Detector** | M.Sc Final Year Project | Brainybeam Info-Tech PVT LTD
