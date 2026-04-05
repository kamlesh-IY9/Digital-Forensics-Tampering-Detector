# Digital Forensics Tampering Detector

```
╔══════════════════════════════════════════╗
║   Digital Forensics Tampering Detector   ║
║   M.Sc Final Year Project                ║
║   Brainybeam Info-Tech PVT LTD           ║
╚══════════════════════════════════════════╝
```

## Overview

Digital Forensics Tampering Detector is an image-forensics web application that checks whether an image appears authentic, suspicious, or tampered. It combines a React + Vite frontend with a FastAPI backend that performs:

- Error Level Analysis (ELA)
- Noise pattern analysis
- EXIF metadata inspection
- Forensic heatmap generation

The project is now structured so the same codebase works both:

- locally with `npm start`
- on Vercel with a static Vite frontend and Python API routes

## Highlights

- Vercel-ready full-stack deployment from one repository
- Root-level `vercel.json` for frontend build + Python API routing
- Shared backend analysis service for local and Vercel runtime
- Built-in demo cards for first-time users using reference and edited sample images
- Same analysis flow for manual uploads and demo samples

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | FastAPI |
| Image Processing | Pillow |
| Numerical Processing | NumPy, SciPy |
| Upload Handling | python-multipart |
| Local Dev | concurrently |
| Deployment | Vercel |

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 8+

## Local Setup

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd "<your-project-folder>"
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install frontend + backend dependencies

```bash
npm run setup
```

This installs:

- root Node tooling
- frontend packages from `frontend/package.json`
- Python packages from the root `requirements.txt`

### 4. Start the full application

```bash
npm start
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:8000/health`
- Backend docs: `http://localhost:8000/docs`

## Manual Development

### Backend

```bash
cd backend
python3 -m pip install -r ../requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Built-In Demo

The landing page includes a guided demo section for new users.

- `Reference Sample` uses `frontend/public/demo/ori.jpeg`
- `Comparison Sample` uses `frontend/public/demo/fake.jpeg`

When a user clicks a demo button, the app fetches that image and runs the exact same upload + analysis flow used for normal user files. This helps first-time visitors quickly understand how the tool works.

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Local health endpoint |
| GET | `/api/health` | Vercel/local API health endpoint |
| POST | `/api/analyze` | Analyze an uploaded image |

## Example API Test

```bash
curl http://localhost:8000/health

curl -X POST http://localhost:8000/api/analyze \
  -F "file=@test_images/authentic_evidence.jpg"
```

## Project Structure

```text
digital-forensics-detector/
├── api/
│   ├── analyze.py
│   └── health.py
├── backend/
│   ├── __init__.py
│   ├── analyzer.py
│   ├── main.py
│   ├── requirements.txt
│   └── service.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── public/
│   │   ├── favicon.svg
│   │   └── demo/
│   │       ├── fake.jpeg
│   │       └── ori.jpeg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── AboutSection.jsx
│   │       ├── ComparisonView.jsx
│   │       ├── DemoSamples.jsx
│   │       ├── ForensicReport.jsx
│   │       └── UploadZone.jsx
│   └── vite.config.js
├── notebooks/
├── test_images/
├── package.json
├── requirements.txt
├── vercel.json
└── README.md
```

## GitHub Push

From the project root:

```bash
git add .
git commit -m "Prepare project for Vercel deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

If you already have a remote, skip the `git remote add origin ...` step.

## Deploy On Vercel

This project should be deployed from the repository root, not from the `frontend` folder.

### Option 1: Vercel Dashboard

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Keep the root directory as the repo root.
4. Deploy.

Vercel is already configured to use:

- `buildCommand`: `npm run build`
- `outputDirectory`: `frontend/dist`
- Python functions from `api/*.py`

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## Root Requirements File

The root `requirements.txt` is intentionally simple:

```txt
-r backend/requirements.txt
```

This is needed so Vercel and local installs can use one root Python dependency entrypoint.

## Production Build

```bash
npm run build
```

The frontend output is generated in `frontend/dist`.

## Validation

Run the bundled comparison script to check legacy vs improved forensic scoring on the provided samples:

```bash
python3 scripts/validate_samples.py
```

This prints a side-by-side table for the sample set and reports how many cases are acceptable under each scoring model.

## Troubleshooting

### Python install issue

```bash
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
```

### Frontend cannot reach backend locally

- Confirm the backend is running on port `8000`
- Confirm the frontend is running on port `5173`
- Check `frontend/vite.config.js` proxy settings

### Port already in use

```bash
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

## Notes

- The Vercel deployment uses the same forensic analysis logic as local development.
- The demo images are included only to explain the workflow to new users.
- The notebook remains available for experimentation and research.

## Credits

M.Sc Final Year Project  
Brainybeam Info-Tech PVT LTD
