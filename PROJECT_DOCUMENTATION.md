# 🔬 Digital Forensics Tampering Detector
### M.Sc Final Year Project — Brainybeam Info-Tech PVT LTD

---

## 🧠 Read This First — Complete Beginner's Guide to This Project

> This section explains the **entire project in simple language** — what it is, why it exists, how it works, real-life examples, and how it was built. Read this first before anything else.

---

### 📖 What Is This Project? (Plain English)

Imagine someone takes a photo of an accident scene, opens it in Photoshop, removes a car from the image, and then submits it as "evidence" in court. To your eyes, the photo looks completely real. But mathematically, that photo is **broken in a way your eyes cannot see**. This project is a software system that **finds those invisible mathematical cracks** and tells you: *"This image has been tampered with."*

In one sentence:
> **This is a web application where you upload any image, and within seconds it tells you whether the image is AUTHENTIC, SUSPICIOUS, or TAMPERED — with a full scientific explanation of exactly why.**

---

### 😰 The Real Problem — Why Does This Even Matter?

Here is the simple truth: **anyone with a laptop can fake a photo today.** Photoshop, GIMP, Lightroom — these tools are free or cheap, easy to use, and can make edits that look completely real to the human eye.

This is a massive problem in the real world because photos are used as **legal proof** all the time:

#### 🏛️ Real-Life Example 1 — Court Case
> A person is accused of a crime. The prosecution submits a photo as evidence showing the accused at a crime scene. But the accused claims the photo is fake — their face was pasted onto someone else's body. A judge needs to know: **is this photo real?** Without a forensic tool, this question might take weeks and cost lakhs of rupees to answer by a manual expert.
>
> ✅ **With this project:** Upload the photo → 2 seconds → "TAMPERED — Editing software detected in EXIF: Adobe Photoshop"

#### 🏦 Real-Life Example 2 — Insurance Fraud
> Someone's car was in a small scratch accident. They open the accident photo in GIMP, extend the damage to make it look much worse, and submit it to the insurance company claiming ₹2 lakh damage. The insurance company has no automatic way to verify the photo.
>
> ✅ **With this project:** Upload the damage photo → ELA analysis lights up the extended region with red → "TAMPERED — Elevated Error Level Analysis score (74%)"

#### 🗞️ Real-Life Example 3 — Fake News / Viral Photo
> A doctor's photo is taken and their name tag is edited to say something offensive. The fake photo goes viral on WhatsApp. The doctor's career is destroyed. How do you prove it's fake?
>
> ✅ **With this project:** Upload the viral photo → "TAMPERED — Pixel manipulation detected in region containing the name tag area."

#### 🏥 Real-Life Example 4 — Fake Medical Records
> A patient submits a forged COVID test report (negative changed to positive) to get medical leave from their company. HR has no way to verify it without calling the lab.
>
> ✅ **With this project:** Upload the scanned report → EXIF + ELA analysis → "SUSPICIOUS — No camera EXIF data, noise pattern inconsistency detected."

#### 🪪 Real-Life Example 5 — Fake ID Documents
> Someone edits their age or address on a scanned Aadhar card / PAN card photo and submits it for a loan or government scheme.
>
> ✅ **With this project:** Upload the scanned ID → "TAMPERED — High ELA score (82%) in text region, metadata stripped."

---

### 🔬 How Does It Actually Work? (Super Simple Version)

Think of it this way. When you edit a photo and save it:
- The edited part gets **re-compressed differently** from the rest (ELA detects this)
- The edited part comes from a **different camera with different sensor noise** (Noise Analysis detects this)
- The software you used to edit it **leaves its name in the file's hidden data** (EXIF Metadata detects this)
- We then **colour-code a map** of the image showing exactly where the problem is (Heatmap shows this)

The system runs all 4 checks automatically in about 1–2 seconds and gives you a final score:

```
Score 0–19%  → 🟢 AUTHENTIC   — This image looks genuine
Score 20–49% → 🟡 SUSPICIOUS  — Something looks off, investigate more
Score 50–100%→ 🔴 TAMPERED    — Strong mathematical proof of manipulation
```

---

### 🛠️ How This Project Was Built — The Development Story

This is important to understand because it shows the **scientific process** we followed:

#### Step 1 — Algorithm Experimentation in Jupyter Notebook
Before writing any web application, we first **proved that the algorithms work** using a Jupyter Notebook (`notebooks/forensics_experimentation.ipynb`).

A Jupyter Notebook is like an interactive Python scratchpad where you can write code, run it, and immediately see graphs and output. We used it to:
- Write `perform_ela()` and plot the output as an image to visually see if bright patches appeared where we expected them
- Write `analyze_noise()` and plot the per-channel noise maps to check if inconsistencies were detected
- Write `generate_heatmap()` and visually verify the Blue→Yellow→Red colour gradient worked correctly
- Write `extract_metadata()` and check that Photoshop was correctly detected from EXIF tags
- Combine all 4 and see the final verdict printed clearly

**Only after every algorithm was visually verified in the notebook did we move to Step 2.**

#### Step 2 — Replicating Algorithms into the Web App Backend
Once we proved the algorithms worked, we **copied and refined the exact same functions** into `backend/analyzer.py`. Not a different algorithm — the exact same mathematical logic, now wrapped inside a FastAPI server so it can accept image uploads over the internet.

```
Notebook (research/proof)       →    Web Application (production)
──────────────────────────────────────────────────────────────────
perform_ela()      in Cell 3    →    perform_ela()    in analyzer.py
analyze_noise()    in Cell 4    →    analyze_noise()  in analyzer.py
generate_heatmap() in Cell 5    →    generate_heatmap() in analyzer.py
extract_metadata() in Cell 6    →    extract_metadata() in analyzer.py
compute_verdict()  in Cell 7    →    scoring logic    in main.py
```

#### Step 3 — Building the Frontend
We built a React web interface so that any user (even a non-programmer) can upload a photo and see the results without needing to know how to run Python code.

#### Step 4 — Connecting Everything
The final step was connecting the React frontend to the FastAPI backend using an API (Application Programming Interface). The frontend sends the image, the backend processes it, and the result (verdict + heatmap + ELA image) is sent back and displayed.

**The result: a complete, working, one-command (`npm start`) application.**

---

### 🔍 The 4 Algorithms — Explained Like You're Explaining to a Friend

#### Algorithm 1: Error Level Analysis (ELA) 🔴
*"Does this image have parts saved at a different quality than the rest?"*

When you edit a photo and paste something new into it, that pasted piece was **compressed differently**. Think of it like printing a fresh stamp on old paper — the ink looks fresher in one spot. ELA re-compresses the whole image at a known quality level, then measures the difference pixel by pixel. Tampered spots show up as **bright white patches** because their compression history is different.

**In code:** Save image at quality=90, subtract from original, amplify the difference.

---

#### Algorithm 2: Noise Pattern Analysis 🔵
*"Does this image's graininess change from one area to another?"*

Every camera adds a tiny invisible grain (noise) to every photo it takes — like a fingerprint. All regions of an authentic photo share this same grain pattern. When a piece from a **different camera or a different photo** is pasted in, that piece has a **different grain pattern**. The algorithm extracts the noise from each part of the image and checks: is the grain consistent everywhere, or does it suddenly change in one region?

**In code:** Gaussian filter removes content, leaving pure noise. Local variance measured in 32×32 windows. Standard deviation of those variances = inconsistency score.

---

#### Algorithm 3: EXIF Metadata Forensics 📋
*"What is the image's 'ID card' telling us?"*

Every digital photo has invisible hidden data called EXIF — it stores the camera brand, model, date taken, GPS location, and even which software last edited it. When someone opens a photo in Photoshop and saves it, Photoshop writes its own name into this hidden data. When someone tries to hide their tracks by deleting the EXIF, that deletion itself is suspicious. The algorithm reads this hidden data and checks for these red flags.

**In code:** `image._getexif()` reads all tags. Software field checked against list of 8 known editors. Date fields cross-checked.

---

#### Algorithm 4: Forensic Heatmap 🌡️
*"Show me exactly WHERE in the image the problem is."*

The first three algorithms tell you IF an image is tampered. The heatmap tells you **WHERE**. It takes the ELA output (a grayscale map of error levels) and paints it with a colour scale: clean parts are blue, mildly anomalous parts are yellow, and strongly suspicious parts are red. This is overlaid semi-transparently on the original image so you can see with your eyes exactly which region is forged.

**In code:** NumPy array colour mapping — `normalized × 255` for red channel, peak at midpoint for green (yellow), inverse for blue.

---

### 🎓 How to Explain This to Someone in 30 Seconds

> *"I built a system that takes any photo and automatically detects if it's been edited using Photoshop or any other tool. It works by checking three things: whether any part of the photo was compressed differently (ELA), whether the camera noise is inconsistent (Noise Analysis), and whether the editing software left its name in the file's hidden data (EXIF). It then draws a colour-coded map over the photo showing exactly which part was tampered with. The whole thing runs in your browser — you upload a photo, click analyze, and within 2 seconds you get a verdict: AUTHENTIC, SUSPICIOUS, or TAMPERED."*

---

### ✅ What Makes This Project Special?

| Feature | Why It Matters |
|---------|---------------|
| No AI training required | Works on any image instantly — no dataset, no GPU, no model files |
| Deterministic | Same image always gives same result — 100% reproducible |
| Scientifically grounded | Based on signal processing and JPEG compression theory — not guesswork |
| Visual proof | Heatmap shows investigators exactly WHERE the forgery is |
| Full-stack | Not just Python scripts — a real web app that anyone can use |
| Notebook validated | Every algorithm was proven in Jupyter before it went into production |

---


## 📌 Table of Contents

1. [What is This Project?](#1-what-is-this-project)
2. [Purpose & Problem Statement](#2-purpose--problem-statement)
3. [Who Is This For?](#3-who-is-this-for)
4. [Abstract](#4-abstract)
5. [Simple Explanation — "The Digital Lie Detector"](#5-simple-explanation--the-digital-lie-detector)
6. [Architecture Overview — How It Is Built](#6-architecture-overview--how-it-is-built)
7. [Technology Stack](#7-technology-stack)
8. [Project Folder Structure](#8-project-folder-structure)
9. [How It Works — Full Step-by-Step Flow](#9-how-it-works--full-step-by-step-flow)
10. [The 4 Core Forensic Algorithms](#10-the-4-core-forensic-algorithms)
    - [Algorithm 1: Error Level Analysis (ELA)](#algorithm-1-error-level-analysis-ela)
    - [Algorithm 2: Noise Pattern Analysis](#algorithm-2-noise-pattern-analysis)
    - [Algorithm 3: EXIF Metadata Extraction & Analysis](#algorithm-3-exif-metadata-extraction--analysis)
    - [Algorithm 4: Forensic Heatmap Generation](#algorithm-4-forensic-heatmap-generation)
11. [Scoring & Verdict System](#11-scoring--verdict-system)
12. [API Endpoints — Backend Reference](#12-api-endpoints--backend-reference)
13. [Frontend UI — Screen by Screen](#13-frontend-ui--screen-by-screen)
14. [How to Run the Project](#14-how-to-run-the-project)
15. [Supported Image Formats](#15-supported-image-formats)
16. [Security & Validation](#16-security--validation)
17. [Key Design Decisions (For Evaluators)](#17-key-design-decisions-for-evaluators)
18. [⚠️ Important Viva Clarification — Algorithms vs ML Models](#18-️-important-viva-clarification--algorithms-vs-ml-models)
19. [Experimentation Notebook](#19-experimentation-notebook)
20. [Future Improvements](#20-future-improvements)

---

## 1. What is This Project?

The **Digital Forensics Tampering Detector** is a full-stack web application that can automatically detect whether a digital image has been tampered with, manipulated, or forged.

A user uploads any image (a photo, a document scan, a screenshot), and within seconds, the system produces:
- A scientific **verdict**: `AUTHENTIC`, `SUSPICIOUS`, or `TAMPERED`
- A **tampering probability score** from 0% to 100%
- A detailed breakdown of exactly **which forensic indicators** were triggered
- Visual analysis outputs: the **ELA image** (showing pixel error levels) and a **color-coded heatmap** (marking suspicious regions in red)

---

## 2. Purpose & Problem Statement

**The Real-World Problem:**

In today's digital world, images are frequently used as legal evidence — in court cases, insurance claims, journalism, medical reports, and police investigations. However, with modern editing tools like Photoshop, GIMP, and Lightroom, it has become extremely easy to manipulate images without leaving any visible trace.

This raises one critical question:

> **"Can we trust that a submitted image is genuine?"**

Forensic investigators currently perform these checks manually, which is:
- **Slow** — Can take hours or days
- **Expensive** — Requires specialized experts
- **Subjective** — Relies on human judgment

**The Solution:**

This project automates digital forensics using **computer vision algorithms** and **signal processing techniques**. It analyzes images at the mathematical level — examining pixel patterns, compression artifacts, and metadata — to detect manipulation with no human effort required.

---

## 3. Who Is This For?

| User | Use Case |
|------|----------|
| 🏛️ Legal Investigators | Verifying the authenticity of digital evidence submitted in court |
| 🗞️ Journalists / Fact-Checkers | Detecting manipulated or doctored photos in news media |
| 🏦 Insurance Companies | Verifying claim photos for accident or damage fraud |
| 🏥 Medical / Research | Detecting falsified scientific images in publications |
| 🔐 Cybersecurity Teams | Identifying forged identity documents or credentials |
| 🎓 Students / Researchers | Learning and experimenting with digital forensics |

---

## 4. Abstract

> This project develops a computer vision-based system capable of detecting digital tampering in images and documents used as evidence. ML models analyze noise patterns, compression artifacts, and pixel inconsistencies to identify manipulated regions. Metadata validation helps uncover editing history or suspicious file alterations. The system highlights forged or modified sections with detailed forensic markings. This solution strengthens digital evidence authentication and enhances reliability in legal investigations.

**Domain:** Data Science & Machine Learning With Data Analytics  
**Technology:** Python · FastAPI · React · Vite · NumPy · SciPy · Pillow  
**Company:** Brainybeam Info-Tech PVT LTD  

---

## 5. Simple Explanation — "The Digital Lie Detector"

Think of this project as a **"digital lie detector" for images and documents.**

When someone edits a photo — like changing a date on a receipt, adding a person to a crime scene photo, or faking an ID card — they leave behind **"microscopic" digital footprints** that the human eye cannot see. This system uses Python and computer vision algorithms to find those footprints and prove the image was changed.

### 🔍 Feature 1 — Noise Analysis (The Camera Fingerprint)
Every camera sensor has a unique noise pattern (like a grain or fingerprint). When someone **copy-pastes** something from another image into a photo, that pasted piece has a **different noise pattern** from the rest of the image. The system detects this mismatch using statistical signal analysis (Gaussian filtering + local variance).

> ✅ **Implemented in:** `analyze_noise()` → `backend/analyzer.py`

### 🗜️ Feature 2 — Compression Detection / ELA (The Error Spotlight)
When you save a JPEG, it loses a small amount of quality (compression). If you edit one part of a photo and save it again, that **specific edited region has a different "error level"** than the rest of the image. The system re-saves the image at a controlled quality level, computes the pixel difference, and highlights these mismatched "bright spots."

> ✅ **Implemented in:** `perform_ela()` → `backend/analyzer.py`

### 🪪 Feature 3 — Metadata Validation (The ID Card Check)
Every digital file has hidden information called **EXIF data** — including camera make/model, GPS location, date taken, and more. When someone edits an image with Photoshop, GIMP, Lightroom, etc., that software **leaves its name behind in the metadata**. Sometimes editors strip the metadata entirely — which is itself suspicious. The system reads all of this and flags it.

> ✅ **Implemented in:** `extract_metadata()` → `backend/analyzer.py`

### 🌡️ Feature 4 — Visual Heatmap (The Fraud Map)
Instead of just saying "this is fake," the system **draws a color-coded heatmap** directly over the exact area that was tampered with. 🔵 Blue = clean, 🟡 Yellow = mild anomaly, 🔴 Red = suspicious. This makes it immediately clear to a judge, investigator, or evaluator exactly WHERE the forgery happened.

> ✅ **Implemented in:** `generate_heatmap()` → `backend/analyzer.py`

### ⚙️ How It Works — Simple 3-Step Process

| Step | What Happens |
|------|-------------|
| **① INPUT** | User uploads a suspicious image (e.g., a modified ID card, fake invoice, doctored crime scene photo) |
| **② PROCESSING** | Python code converts the image into a NumPy pixel array and runs it through all 4 forensic algorithms — ELA, noise analysis, EXIF parsing, and heatmap generation |
| **③ OUTPUT** | The system generates a full report showing: Tampering Probability %, forensic verdict (AUTHENTIC / SUSPICIOUS / TAMPERED), and a heatmap marking the forged region |

### ⚖️ Why It Matters — The Real-World Impact
In legal cases, digital evidence is easily faked. A modified photo can be used to frame an innocent person or help someone escape justice. This system ensures that **only authentic, unaltered evidence** is trusted in court, preventing wrongful convictions and protecting companies from fake-document fraud.

---

## 5. Architecture Overview — How It Is Built

The application follows a classic **Full-Stack Client-Server Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                        │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │              REACT FRONTEND (Port 5173)               │  │
│   │   - Upload Zone (drag & drop)                        │  │
│   │   - Comparison View (Original / ELA / Heatmap)       │  │
│   │   - Forensic Report (verdict, indicators, metadata)  │  │
│   │   - About Section                                    │  │
│   └─────────────────────┬────────────────────────────────┘  │
│                          │  HTTP POST /api/analyze           │
│                          │  (multipart/form-data image)      │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               FASTAPI BACKEND (Port 8000)                    │
│                                                              │
│   main.py: Receives image, validates, calls pipeline         │
│                          │                                   │
│   ┌──────────────────────▼──────────────────────────────┐  │
│   │               analyzer.py (Core Engine)              │  │
│   │                                                      │  │
│   │  ① perform_ela()      → ELA image + ELA score       │  │
│   │  ② extract_metadata() → EXIF data + software flags  │  │
│   │  ③ analyze_noise()    → Sensor noise score          │  │
│   │  ④ generate_heatmap() → Color-coded RGBA overlay    │  │
│   │                                                      │  │
│   │  → Combine all scores → verdict + probability       │  │
│   └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│   Returns JSON response with images (base64) + report        │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.10+ | Primary programming language |
| **FastAPI** | Latest | High-performance REST API framework |
| **Uvicorn** | Latest | ASGI server to run FastAPI |
| **Pillow (PIL)** | Latest | Image processing — open, convert, compare images |
| **NumPy** | Latest | Numerical array operations on pixel data |
| **SciPy** | Latest | `gaussian_filter` and `uniform_filter` for noise analysis |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | UI component framework |
| **Vite** | Latest | Fast development build tool with hot-reloading |
| **Lucide React** | Latest | Modern SVG icon set (Shield, RefreshCw, Upload...) |
| **Vanilla CSS** | — | Custom design system with CSS variables |

### Project Tooling
| Tool | Purpose |
|------|---------|
| `concurrently` | Runs backend + frontend in parallel with one command |
| `npm start` (root) | The single command to launch the entire project |
| Jupyter Notebook | Algorithm experimentation & validation |

---

## 7. Project Folder Structure

```
CLG Project./
│
├── package.json              ← Root: npm start command (runs both servers)
├── start.sh                  ← Backup shell script to start project
├── README.md                 ← Setup guide and API documentation
├── PROJECT_DOCUMENTATION.md  ← This file
│
├── backend/                  ← Python FastAPI server
│   ├── main.py               ← API routes, validation, scoring, verdict
│   ├── analyzer.py           ← Core forensic algorithm engine (4 functions)
│   └── requirements.txt      ← Python dependencies
│
├── frontend/                 ← React + Vite application
│   ├── index.html            ← HTML entry point (Syne + Space Mono fonts)
│   ├── vite.config.js        ← Dev server + API proxy config
│   ├── package.json          ← Frontend dependencies
│   └── src/
│       ├── main.jsx              ← React root mount
│       ├── App.jsx               ← Main app, state management, routing
│       ├── index.css             ← Global design system & animations
│       └── components/
│           ├── UploadZone.jsx    ← Drag-and-drop file upload
│           ├── ComparisonView.jsx← Image switcher (Original/ELA/Heatmap)
│           ├── ForensicReport.jsx← Verdict display, indicator list
│           └── AboutSection.jsx  ← Project info and company branding
│
├── notebooks/
│   └── forensics_experimentation.ipynb ← Jupyter algorithm walkthrough
│
└── test_images/              ← Sample test images for demo
```

---

## 8. How It Works — Full Step-by-Step Flow

Here is the complete end-to-end journey of a single image analysis, from the user clicking "Upload" to the final verdict appearing on screen:

### STEP 1 — User Uploads an Image
- The user opens the app at `http://localhost:5173`
- They **drag-and-drop** an image onto the upload zone, or click to browse files
- **Frontend validation** runs immediately:
  - ✅ Checks file type (`JPEG`, `PNG`, `BMP`, `TIFF`, `WebP` only)
  - ✅ Checks file size (Max 20 MB)
  - ❌ If invalid → shows a red error message, stops here

### STEP 2 — HTTP Request Sent to Backend
- If validation passes, the file is packaged as a `multipart/form-data` form
- A `POST` request is sent to `http://localhost:5173/api/analyze`
- **Vite proxies** this to the FastAPI server at `http://localhost:8000/api/analyze`
- UI switches to **"ANALYZING IMAGE..."** loading state with a spinner

### STEP 3 — Backend Validates the File
- FastAPI receives the uploaded file (`UploadFile` object)
- **Content-type check**: Rejects non-image MIME types
- **Size check**: If file > 20 MB → HTTP 413 error returned
- **Image integrity check**: Uses `PIL.Image.verify()` to catch corrupt or fake images
  > Note: After `verify()`, the image must be re-opened as PIL marks the stream invalid

### STEP 4 — The Forensic Pipeline Runs (4 Algorithms in Sequence)
All 4 functions in `analyzer.py` are called on the same image:

```
image
  ├──→ perform_ela()      → (ela_image, ela_score)
  ├──→ extract_metadata() → metadata dict
  ├──→ analyze_noise()    → noise_data dict
  └──→ generate_heatmap() → heatmap image (uses ela_image)
```

(Full details of each algorithm in Section 9 below.)

### STEP 5 — Tampering Probability Scored
Using the results from all 4 algorithms, a **tampering probability** (0–100%) is calculated:

```
score = ELA_contribution   (max 60 points)
      + software_detected  (30 points, binary)
      + noise_score        (max 20 points)
      + suspicious_tags    (7.5 points each)
      + missing_exif       (5 points, JPEG only)

tampering_probability = min(100, sum(score))
```

### STEP 6 — Verdict Determined
Based on the probability score:
| Score Range | Verdict | Meaning |
|-------------|---------|---------|
| 0% – 19% | 🟢 **AUTHENTIC** | No significant signs of tampering |
| 20% – 49% | 🟡 **SUSPICIOUS** | Possible manipulation — review recommended |
| 50% – 100% | 🔴 **TAMPERED** | Strong indicators of manipulation detected |

### STEP 7 — JSON Response Sent to Frontend
The backend returns a single JSON object containing:
- `verdict`, `verdict_color`, `verdict_desc`
- `tampering_probability` (float)
- `ela_score` (float)
- `noise_analysis` (dict)
- `indicators` (list of triggered forensic warnings)
- `metadata` (EXIF data, format, dimensions)
- `images.original`, `images.ela`, `images.heatmap` (base64-encoded strings)
- `file_info` (filename, size_kb)
- `processing_time_s` (how long the analysis took)

### STEP 8 — Results Displayed on Frontend
The UI switches from loading to results mode:
- **Left Panel**: `ComparisonView` — shows Original / ELA / Heatmap views with zoom
- **Right Panel**: `ForensicReport` — shows verdict hero, probability bar, indicator list, EXIF data

---

## 9. The 4 Core Forensic Algorithms

### Algorithm 1: Error Level Analysis (ELA)

**File:** `backend/analyzer.py` → `perform_ela()`

**What is it?**

ELA (Error Level Analysis) is the most powerful forensic technique for detecting JPEG tampering. It works by exploiting how JPEG compression works.

**How JPEG compression works:**
Every time a JPEG image is saved, it loses a tiny bit of quality due to compression. This loss is called an "error level." When **a legitimate photo** is repeatedly saved at quality=90, the error level gradually decreases across the entire image — uniformly. When **a tampered image** has a region pasted in from a different source, that pasted region has a **different error history** than the rest of the image. It was either compressed fewer times (fresh paste) or more times (re-saved copy). This mismatch creates a visible, measurable difference.

**Step-by-Step:**
```python
# Step 1: Re-save the image at quality=90
img_rgb.save(buffer, format="JPEG", quality=90)
compressed = Image.open(buffer)

# Step 2: Compute the raw pixel difference
ela_image = ImageChops.difference(img_rgb, compressed)

# Step 3: Amplify the difference for visibility
scale = (255.0 / max_diff) if max_diff > 0 else 1.0
ela_image = ImageEnhance.Brightness(ela_image).enhance(min(scale, 10) * 5)
# NOTE: min(scale, 10) caps the amplification so clean images don't blow out

# Step 4: Score it using the 95th percentile (ignores hot pixels / outliers)
ela_score = np.percentile(np.array(ela_image), 95) / 255.0 * 100
```

**Interpreting the output:**
- **Uniform dark ELA image** → `AUTHENTIC` (consistent error levels across the whole image)
- **Bright white patches on dark background** → `TAMPERED` (regions with different error histories)
- **ELA Score < 25%** = Low (Authentic)
- **ELA Score 25–60%** = Medium (Suspicious)
- **ELA Score > 60%** = High (Likely tampered)

**Why quality=90?**
> At quality=100, JPEG barely compresses, errors are too small to be meaningful. Quality=90 is the forensic standard for introducing a consistent, detectable compression level.

**Why 95th percentile instead of max()?**
> A single bright dust particle or edge artifact could corrupt `max()`. The 95th percentile gives a representative, stable, and robust measurement.

---

### Algorithm 2: Noise Pattern Analysis

**File:** `backend/analyzer.py` → `analyze_noise()`

**What is it?**

Every camera sensor introduces a specific, consistent pattern of random noise when it captures a photo. This is analogous to a sensor's "fingerprint." When regions of an image come from different sources (splice, copy-paste from a different photo), those regions have **different noise fingerprints**. This algorithm detects those inconsistencies.

**Step-by-Step:**
```python
# Step 1: For each of 3 color channels (R, G, B):
channel = img_array[:, :, ch]

# Step 2: Smooth the image with Gaussian filter (sigma=1.5)
#   This separates signal (actual content) from noise (random variations)
smoothed = gaussian_filter(channel, sigma=1.5)
noise = channel - smoothed   # The pure noise residual

# Step 3: Compute local noise statistics in 32x32 pixel windows
local_std = sqrt(uniform_filter(noise**2) - uniform_filter(noise)**2)

# Step 4: Measure how much this local noise standard deviation VARIES across the image
score = np.std(local_std)

# Step 5: Normalize across all 3 channels (0-100)
normalized = min(100.0, avg_score * 8)
```

**Why sigma=1.5 for Gaussian filter?**
> Too low (e.g., 0.5) = Noise and signal are not properly separated. Too high (e.g., 5.0) = Real tampering artifacts get smeared away. 1.5 is the forensically validated sweet spot.

**Interpreting the output:**
- `noise_score < 25` → Consistent noise → Authentic
- `noise_score > 25` → Inconsistent noise pattern → May indicate splicing

---

### Algorithm 3: EXIF Metadata Extraction & Analysis

**File:** `backend/analyzer.py` → `extract_metadata()`

**What is it?**

EXIF (Exchangeable Image File Format) is hidden data that cameras automatically embed inside digital photos. It records: camera make/model, date taken, GPS location, shutter speed, ISO, and more. When someone edits and re-saves an image, photo editing software like Photoshop leaves traces in this metadata. Sometimes it strips the metadata entirely (a red flag for deliberate hiding).

**What the system checks:**

| Check | What It Detects |
|-------|----------------|
| `Software` EXIF field | Contains Photoshop, GIMP, Lightroom, Paint.NET, Affinity, Illustrator, Capture One, Darktable |
| `DateTime` ≠ `DateTimeOriginal` | File was modified AFTER original capture (editing detected) |
| Missing `Make`/`Model` | No camera recorded — unusual for genuine camera photos |
| `has_exif = False` on JPEG files | Metadata stripped — possible deliberate tampering |

**Supported editing software detection list:**
`Photoshop`, `GIMP`, `Lightroom`, `Paint.NET`, `Affinity`, `Illustrator`, `Capture One`, `Darktable`

> **Note:** PNG and BMP files by design never contain EXIF data. The system is aware of this and does NOT penalize PNG screenshots for missing EXIF (format-aware scoring).

---

### Algorithm 4: Forensic Heatmap Generation

**File:** `backend/analyzer.py` → `generate_heatmap()`

**What is it?**

This algorithm transforms the raw numerical ELA output into a beautiful, intuitive RGBA color overlay that can be placed directly on top of the original image. It makes the invisible visible — evaluators and investigators can immediately see **exactly which region** of the image is suspicious, without needing to understand the math.

**Color Scale (Blue → Yellow → Red):**

| Color | Meaning |
|-------|---------|
| 🔵 **Blue** | Low error level — very clean, authentic region |
| 🟡 **Yellow** | Mid-level anomaly — mild inconsistency |
| 🔴 **Red** | High error level — strongly suspicious/tampered region |

**How the color mapping works:**
```python
normalized = ela_gray / 255.0     # 0.0 (clean) to 1.0 (suspicious)

# Red channel increases as suspicion increases (0 → 255)
rgba[:,:,0] = clip(normalized * 2 * 255, 0, 255)

# Green channel peaks at medium values (creates yellow in the middle)
rgba[:,:,1] = clip((1 - abs(normalized*2 - 1)) * 255, 0, 255)

# Blue channel decreases as suspicion increases (255 → 0)
rgba[:,:,2] = clip((1 - normalized * 2) * 255, 0, 255)

# Alpha: semi-transparent so the original image shows through
rgba[:,:,3] = clip(normalized * 230, 40, 230)
```

---

## 10. Scoring & Verdict System

The scoring system combines all 4 forensic signals into a single, calibrated score:

```
┌─────────────────────────────────────────────────────────────┐
│                 TAMPERING PROBABILITY FORMULA                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ELA Contribution    =  ela_score × ela_weight              │
│                         (ela_weight = 0.6 for JPEG)         │
│                         (ela_weight = 0.3 for PNG/BMP)      │
│                         (max contribution: 60 points)        │
│                                                              │
│  Software Detected   =  +30 points (binary: yes/no)         │
│                                                              │
│  Noise Inconsistency =  noise_score × 0.2                   │
│                         (max contribution: 20 points)        │
│                                                              │
│  Suspicious Tags     =  +7.5 points × (count of tags)       │
│                                                              │
│  Missing EXIF        =  +5 points (JPEG/TIFF only)          │
│                                                              │
│  TOTAL = min(100, sum of all above)                          │
│                                                              │
│  < 20  →  AUTHENTIC (green)                                 │
│  20–49 →  SUSPICIOUS (yellow)                               │
│  ≥ 50  →  TAMPERED (red)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. API Endpoints — Backend Reference

### `GET /health`
Returns the API status. Used by the frontend to confirm the backend is running.

**Response:**
```json
{
  "status": "online",
  "service": "Digital Forensics API",
  "version": "1.0.0"
}
```

---

### `POST /api/analyze`
Main analysis endpoint. Accepts a multipart image upload.

**Request:** `Content-Type: multipart/form-data`
- `file`: image file (JPEG, PNG, BMP, TIFF, WebP — max 20 MB)

**Response (Success — HTTP 200):**
```json
{
  "verdict": "TAMPERED",
  "verdict_color": "red",
  "verdict_desc": "Strong indicators of image manipulation or forgery detected",
  "tampering_probability": 72.5,
  "ela_score": 84.3,
  "noise_analysis": {
    "inconsistency_score": 31.4,
    "suspicious": true,
    "available": true
  },
  "indicators": [
    {
      "type": "error_level",
      "severity": "high",
      "message": "Elevated Error Level Analysis score (84.3%) — indicates possible pixel manipulation"
    },
    {
      "type": "metadata_software",
      "severity": "high",
      "message": "Editing software detected in EXIF: Photoshop"
    }
  ],
  "metadata": {
    "format": "JPEG",
    "mode": "RGB",
    "width": 1920,
    "height": 1080,
    "size_display": "1920 x 1080 px",
    "has_exif": true,
    "editing_software": ["Photoshop"],
    "suspicious_tags": ["Modification date differs from original capture date"],
    "exif_count": 28,
    "exif": { "Software": "Adobe Photoshop", "DateTime": "2023:05:01 12:30:00", ... }
  },
  "images": {
    "original": "<base64 JPEG string>",
    "ela": "<base64 PNG string>",
    "heatmap": "<base64 PNG string>"
  },
  "file_info": {
    "filename": "evidence.jpg",
    "size_kb": 823.4,
    "content_type": "image/jpeg"
  },
  "processing_time_s": 1.23
}
```

**Error Responses:**
| HTTP Code | When |
|-----------|------|
| `400 Bad Request` | Invalid file type or corrupt image |
| `413 Request Entity Too Large` | File larger than 20 MB |

---

## 12. Frontend UI — Screen by Screen

The React frontend has **4 distinct states** controlled by `App.jsx`:

### State 1: Idle (Home Screen)
- **Shown when:** App first loads, or after "New Analysis"
- **Contains:**
  - `UploadZone` component: Large drag-and-drop area with animated corner brackets
  - "System Online" status badge
  - "Digital Forensics Tampering Detector" hero headline with gradient text
  - 4 technique pills: ELA · Noise Pattern Analysis · EXIF Metadata · Compression Artifacts
  - `AboutSection` below: Project abstract, tech stack, company info

### State 2: Loading
- **Shown when:** File is uploaded and backend is processing
- **Contains:**
  - `UploadZone` with spinner icon replacing the upload icon
  - Animated "ANALYZING IMAGE..." text with blinking cursor

### State 3: Results
- **Shown when:** Backend returns a successful analysis
- **Layout:** Split 2-column grid:
  - **Left (flex):** `ComparisonView` — full-height image viewer with:
    - Toggle buttons: **Original | ELA | Heatmap**
    - Zoom controls (0.5× to 3.0×)
    - Opacity slider (for heatmap overlay transparency)
    - Colored verdict badge at the top (🟢🟡🔴)
  - **Right (400px):** `ForensicReport` — scrollable panel with:
    - **Verdict Hero Card**: Large verdict text, probability %, time taken
    - **Radar-style Indicator Cards**: Each triggered indicator with severity badge
    - **ELA Analysis section**: Score, interpretation
    - **Noise Analysis section**: Inconsistency score, channel-by-channel
    - **Metadata section**: Full EXIF table, editing software, suspicious flags
    - **Raw File Info**: Filename, size, type

### State 4: Error
- **Shown when:** Backend returns an error (invalid image, network failure)
- **Contains:** Red error card with `AlertTriangle` icon, error message, "Try Again" button

### Header (Always Visible)
- **Left:** Shield icon + "DFT Detector" logo → **clicking this reloads the entire page**
- **Center-right:** Green "API LIVE" status dot + version info
- **Far right:** "New Analysis" button (only visible in results state)

---

## 13. How to Run the Project

### Prerequisites
- Node.js 16+
- Python 3.10+
- pip

### Setup & Start (One-Time)
```bash
# 1. Install Python backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# 2. Install Node frontend dependencies
cd frontend
npm install
cd ..

# 3. Install root concurrently tool
npm install
```

### Run Everything (Every Time After Setup)
```bash
# From the project root:
npm start
```

This single command starts:
- ✅ FastAPI backend on `http://localhost:8000`
- ✅ React frontend on `http://localhost:5173`

### Access the App
Open your browser and go to: **`http://localhost:5173`**

---

## 14. Supported Image Formats

| Format | Extension | ELA Works? | EXIF Expected? |
|--------|-----------|------------|----------------|
| JPEG | `.jpg`, `.jpeg` | ✅ Best | ✅ Yes |
| PNG | `.png` | ⚠️ Limited (lossless) | ❌ No (by design) |
| BMP | `.bmp` | ⚠️ Limited | ❌ No |
| TIFF | `.tiff`, `.tif` | ✅ Yes | ✅ Yes |
| WebP | `.webp` | ✅ Yes | ✅ Sometimes |

> **Important:** ELA is scientifically most reliable for JPEG images. When a PNG is uploaded, the system automatically reduces the ELA weighting from 0.6 to 0.3 to prevent false positives.

---

## 15. Security & Validation

The system has multiple layers of protection to prevent crashes or misuse, especially important during live demonstrations:

| Layer | Where | What It Does |
|-------|-------|--------------|
| File Type Validation | Frontend | Rejects non-image MIME types before upload |
| File Size Validation | Frontend | Rejects files > 20 MB before upload |
| Content-Type Check | Backend (`main.py`) | API-level MIME type enforcement |
| File Size Enforcement | Backend (`main.py`) | Hard 20 MB limit on raw bytes, returns HTTP 413 |
| Image Integrity Check | Backend (`main.py`) | `PIL.verify()` rejects corrupt, fake, or malicious files |
| Error Handling | Backend, Frontend | All exceptions caught, clean JSON errors returned |
| CORS | Backend (`main.py`) | `allow_origins=["*"]` for dev (can be restricted for production) |

---

## 16. Key Design Decisions (For Evaluators)

| Question | Answer |
|----------|--------|
| Why `image.verify()` and then `Image.open()` again? | `verify()` is a destructive PIL operation — it checks integrity but leaves the file pointer unusable. You must re-open to continue. |
| Why JPEG quality=90 in ELA and not 100? | At quality=100, JPEG barely compresses so the error differential is too small to be meaningful. 90 is the forensic standard. |
| Why `np.percentile(ela_array, 95)` instead of `np.max()`? | `max()` is corrupted by a single bright outlier pixel. The 95th percentile gives a robust, representative score. |
| Why `sigma=1.5` in Gaussian filter for noise? | 1.5 is the forensic standard. Too low = can't isolate noise. Too high = real artifacts get blurred away. |
| Why FastAPI and not Flask? | FastAPI uses async I/O and is significantly faster. It also auto-generates API documentation at `/docs`. |
| Why Vite and not Create React App? | Vite is ~30× faster for hot reload. It also makes proxying the backend API trivial with one config line. |
| Why base64 images in JSON? | Simplifies the entire transport layer (one single API call returns everything). For production, static file URLs would be better. |
| Why reduce ELA weight for PNG? | PNG is lossless. Converting PNG→JPEG for ELA always produces high errors. Reducing the weight prevents false "TAMPERED" verdicts on clean screenshots. |

---

## 18. ⚠️ Important Viva Clarification — Algorithms vs ML Models

This section is **extremely important** for your project defense. Read it carefully.

### What Someone Might Say About Your Project (Incorrect)
> *"Your Python code runs the image through ML models trained on thousands of real vs. fake images."*

### ❌ Why This is WRONG for This Project

This project does **NOT** use a pre-trained neural network or any model trained on a dataset. There is no training phase, no dataset, and no `.h5` / `.pkl` / `.pt` model file.

If you say this in a viva, evaluators will immediately ask:
- *"What dataset did you train on?"* — You cannot answer.
- *"What is your model accuracy?"* — You cannot answer.
- *"Show me the confusion matrix."* — You cannot show it.

This would be a critical mistake in your defense.

---

### ✅ What is ACTUALLY Happening — The Correct Answer

Your project uses **mathematically proven classical computer vision algorithms**. These do NOT need training data — they work by applying known mathematical properties of JPEG compression, sensor physics, and signal processing.

| Algorithm | Type | What It Uses |
|-----------|------|-------------|
| ELA (Error Level Analysis) | **Signal Processing** | Mathematical JPEG re-compression + pixel subtraction |
| Noise Pattern Analysis | **Statistical Analysis** | Gaussian filter + local variance measurement (SciPy) |
| EXIF Metadata Check | **Rule-Based Analysis** | Dictionary lookup on known editing software names |
| Heatmap Generation | **Visualization** | NumPy array color mapping (no model needed) |

---

### ✅ What to Say in Your Viva (The Correct Explanation)

> *"Our system uses classical computer vision techniques — Error Level Analysis (a form of signal processing), Gaussian-filter-based noise analysis (statistical signal theory), and rule-based EXIF metadata parsing. These are mathematically proven forensic techniques used by real-world digital investigators worldwide. They do not require a training dataset because they work directly on the mathematical properties of JPEG compression and camera sensor physics. This makes our system interpretable, deterministic, and reliable — unlike a black-box neural network."*

---

### ✅ Verified Feature-by-Feature Confirmation

Every claim in the project description is implemented and verified in the actual code:

| Feature Claimed | Is It Real? | Where in Code |
|----------------|-------------|---------------|
| Noise analysis detects copy-paste mismatch | ✅ YES | `analyze_noise()` in `analyzer.py` |
| ELA detects compression level differences | ✅ YES | `perform_ela()` in `analyzer.py` |
| EXIF checks for Photoshop, date mismatch | ✅ YES | `extract_metadata()` in `analyzer.py` |
| Heatmap highlights exact forged area | ✅ YES | `generate_heatmap()` in `analyzer.py` |
| Tampering probability 0–100% | ✅ YES | Scoring logic in `main.py` |
| Verdict: AUTHENTIC / SUSPICIOUS / TAMPERED | ✅ YES | Verdict logic in `main.py` |
| Full-stack web app with single `npm start` | ✅ YES | Root `package.json` + `concurrently` |

---

### 💡 Bonus Point for Evaluators

You can say:
> *"A future enhancement would be to train a CNN (Convolutional Neural Network) on the CASIA v2 tampering dataset to complement our classical algorithms. This would improve recall on subtle manipulations that don't leave strong ELA traces."*

This shows you know what a trained ML model would look like, while accurately defending what you built.

---

## 19. Experimentation Notebook

**File:** `notebooks/forensics_experimentation.ipynb`

---

### What Is This Notebook?

This Jupyter Notebook is the **scientific validation and experimentation layer** of the entire project. It proves that every forensic algorithm used in the web application is mathematically correct and produces meaningful results — independently of any web server or browser.

It is structured as a **complete, runnable scientific report** that an evaluator can open, run top-to-bottom, and see all 4 algorithms working with visual matplotlib outputs and printed verdicts.

> **Key Point:** The notebook does NOT import from `analyzer.py`. Every function is redefined inline inside the notebook cells. This makes it fully self-contained — it works as a standalone academic demonstration even if the web app is not running.

---

### How It Connects to the Web Application

The notebook and the web app are two separate interfaces to the **same algorithms**:

```
Jupyter Notebook                    Web Application
  (Academic Demo)                     (Production Tool)
       │                                    │
       │  perform_ela()         ←→          │  analyzer.py → perform_ela()
       │  analyze_noise()       ←→          │  analyzer.py → analyze_noise()
       │  extract_metadata()    ←→          │  analyzer.py → extract_metadata()
       │  generate_heatmap()    ←→          │  analyzer.py → generate_heatmap()
       │  compute_verdict()     ←→          │  main.py → scoring logic
       │                                    │
  Visual matplotlib output            JSON API response
  Saved PNG report                    React UI with heatmap
```

Both implement the **identical algorithms** using the same mathematical logic. The notebook was used to **design and validate** the algorithms before integrating them into the FastAPI backend.

---

### Notebook Structure — All 11 Sections

| Section | Cell Type | Content |
|---------|-----------|---------|
| **Header** | Markdown | Project title, company, abstract, notebook table of contents |
| **0. Setup & Install** | Code | Auto-installs all 4 required Python libraries using `subprocess + pip` |
| **1. Imports** | Code | Imports numpy, matplotlib, PIL, scipy, io, base64 — prints version of each |
| **2. Load Test Image** | Code | Loads a real image from `../test_images/` OR auto-generates a synthetic tampered image |
| **3. ELA** | Code | `perform_ela()` — re-saves at quality=90, computes pixel difference, amplifies, scores via 95th percentile |
| **4. Noise Analysis** | Code | `analyze_noise()` — Gaussian filter per channel, local variance, normalized inconsistency score |
| **5. Heatmap** | Code | `generate_heatmap()` — Blue→Yellow→Red RGBA overlay on top of original + legend |
| **6. Metadata** | Code | `extract_metadata()` — Reads EXIF, detects software, flags date mismatches |
| **7. Scoring & Verdict** | Code | `compute_verdict()` — combines all 4 scores → probability % → AUTHENTIC/SUSPICIOUS/TAMPERED |
| **8. Full Visual Report** | Code | 4-panel matplotlib figure saved as `forensic_report_output.png` |
| **9. DEMO: Auth vs Tampered** | Code | Creates two images from scratch, runs full forensics on both, shows 3-row comparison |
| **10. Summary** | Markdown | Algorithm table, what is NOT used (ML models), how to use test images |

---

### Cell-by-Cell Detail

#### Cell 0 — Setup & Install
```python
# Installs: Pillow, numpy, scipy, matplotlib
import subprocess, sys
for pkg in ["Pillow", "numpy", "scipy", "matplotlib"]:
    subprocess.run([sys.executable, "-m", "pip", "install", pkg, "-q"])
```
> Run this cell **once** when setting up. It auto-installs all dependencies so evaluators don't need to manually configure anything.

---

#### Cell 1 — Imports
Imports all libraries and **prints the version** of each one:
```
✅ All libraries imported successfully!
   NumPy     : 2.1.3
   Pillow    : 11.0.0
   SciPy     : 1.14.1
   Matplotlib: 3.x.x
```

---

#### Cell 2 — Load Test Image
Controlled by one variable at the top:
```python
IMAGE_PATH = None   # ← Change to "../test_images/02_photoshop_spliced.jpg" for real test
```
- If `IMAGE_PATH` is `None`: auto-generates a **synthetic tampered image** (400×300px with a paste region from a different JPEG quality level) — always works without any file dependency
- If a path is provided: loads the real image from disk

---

#### Cell 3 — Error Level Analysis (ELA)
Implements `perform_ela()` identically to `backend/analyzer.py`:
```python
ela_image = ImageChops.difference(img_rgb, compressed)
ela_image = ImageEnhance.Brightness(ela_image).enhance(min(scale, 10) * 5)
#                                                        ↑ Capped–prevents blowout on clean images
ela_score = np.percentile(np.array(ela_image), 95) / 255.0 * 100
```
**Output:** Side-by-side plot — Original Image + ELA Output with score label (`LOW / MEDIUM / HIGH`)

---

#### Cell 4 — Noise Pattern Analysis
Implements `analyze_noise()` identically to `backend/analyzer.py`:
```python
smoothed   = gaussian_filter(channel, sigma=1.5)
noise      = channel - smoothed
local_std  = sqrt(uniform_filter(noise²) - uniform_filter(noise)²)
score      = std(local_std)   # std of the local std = how INCONSISTENT is the noise?
normalized = min(100, avg_score × 8)
```
**Output:** 3 heatmaps (Red, Green, Blue channel noise maps) with `hot` colormap and colorbar

---

#### Cell 5 — Heatmap Generation
Implements `generate_heatmap()` identically to `backend/analyzer.py`:
```python
rgba[:,:,0] = clip(normalized × 2 × 255, 0, 255)          # Red increases → suspicious
rgba[:,:,1] = clip((1 - |normalized×2 - 1|) × 255, 0, 255) # Green peaks at mid → yellow
rgba[:,:,2] = clip((1 - normalized×2) × 255, 0, 255)       # Blue decreases → suspicious
rgba[:,:,3] = clip(normalized × 230, 40, 230)              # Semi-transparent alpha
```
**Output:** 3-panel figure — Original | ELA output | Heatmap overlay with Blue/Yellow/Red legend

---

#### Cell 6 — EXIF Metadata Extraction
Implements `extract_metadata()` identically to `backend/analyzer.py`:
- Reads all EXIF tag IDs via `image._getexif()` and maps them to names via `PIL.ExifTags.TAGS`
- Detects 8 editing software tools: Photoshop, GIMP, Lightroom, Paint.NET, Affinity, Illustrator, Capture One, Darktable
- Flags date mismatch between `DateTime` and `DateTimeOriginal`
- Flags missing `Make`/`Model` fields

**Output:** Formatted table print of all EXIF fields, editing software detected, and suspicious flags

---

#### Cell 7 — Combined Scoring & Verdict
Implements the same scoring formula as `backend/main.py`:

| Signal | Points |
|--------|--------|
| ELA score × 0.6 (JPEG) or × 0.3 (PNG/BMP) | Max 60 |
| Editing software detected | +30 |
| Noise inconsistency × 0.2 | Max 20 |
| Each suspicious metadata tag | +7.5 each |
| Missing EXIF on JPEG | +5 |

**Output:** Printed verdict box with all triggered indicators and their severity

---

#### Cell 8 — Full Visual Report
Generates a publication-quality 4-panel forensic report:
- Panel 1 (top-left): Original image
- Panel 2 (top-right): ELA output with score
- Panel 3 (bottom-left): Heatmap overlay
- Panel 4 (bottom-right): Monospace summary card with all metrics, color-coded by verdict

**Saved as:** `notebooks/forensic_report_output.png` (150 DPI)

---

#### Cell 9 — DEMO: Authentic vs Tampered Side-by-Side *(Best Cell for Presentation)*

This is the most impressive cell for showing evaluators. It:
1. **Builds a clean authentic image** — saved at quality=85 consistently (one compression history)
2. **Builds a tampered image** — same base, but with a patch pasted from a JPEG saved at quality=20 (very different compression history)
3. Runs `perform_ela()`, `generate_heatmap()` on both
4. Produces a **3-row × 2-column comparison**:

| Row | Left (Authentic) | Right (Tampered) |
|-----|-----------------|-----------------|
| 1 | Original — no visible difference | Original — foreign patch not obviously visible |
| 2 | ELA output — uniformly dark | ELA output — **bright patch** exactly where tampering is |
| 3 | Heatmap — all blue (clean) | Heatmap — **red patch** marking the tampered region |

**Saved as:** `notebooks/demo_authentic_vs_tampered.png`

> 💡 This cell visually proves that ELA can detect tampering that is **invisible to the naked eye** — exactly what makes this system forensically valuable.

---

### How to Run the Notebook

```bash
# Option 1: Classic Jupyter
jupyter notebook notebooks/forensics_experimentation.ipynb

# Option 2: JupyterLab
jupyter lab notebooks/forensics_experimentation.ipynb

# Then: Kernel → Restart & Run All
```

**To test on a real image from `test_images/`:** Change `IMAGE_PATH` in Cell 2:
```python
IMAGE_PATH = "../test_images/02_photoshop_spliced.jpg"   # Should give TAMPERED verdict
IMAGE_PATH = "../test_images/01_authentic_raw_photo.jpg" # Should give AUTHENTIC verdict
IMAGE_PATH = "../test_images/04_heavy_clone_stamp.jpg"   # Should show red in heatmap
```

---

### Output Files Generated by the Notebook

| File | Generated By | Contents |
|------|-------------|----------|
| `forensic_report_output.png` | Cell 8 | Full 4-panel forensic report |
| `demo_authentic_vs_tampered.png` | Cell 9 | Side-by-side authentic vs tampered comparison |

---

> **For Evaluators:** This notebook can be opened and run completely independently of the web application. It serves as standalone proof that all 4 forensic algorithms are mathematically correct and produce meaningful, interpretable results on real and synthetic images.

---

## 18. Future Improvements

| # | Improvement | Why |
|---|-------------|-----|
| 1 | **Async task queues (Celery)** | Forensic analysis is CPU-bound. Using async background workers would prevent blocking the FastAPI event loop and improve scalability |
| 2 | **Static file URLs instead of Base64** | Base64 inflates image size by ~33%. Serving files via static URL is faster and uses less browser memory |
| 3 | **Image downsampling for huge files** | Very high-resolution images (50MP+) could cause out-of-memory errors. Auto-downscaling before analysis would prevent this |
| 4 | **Copy-Move Detection** | Detecting clone-stamp ops (regions copied from within the same image) using block-matching algorithms |
| 5 | **Deep Learning model** | Train a CNN on a labeled tampering dataset (e.g., CASIA dataset) for higher accuracy |
| 6 | **Restrict CORS** | Change `allow_origins=["*"]` to only the specific front-end domain for production deployment |
| 7 | **Request timeout** | Add a 30-second abort controller on the frontend to handle backend hangs gracefully |
| 8 | **PDF/Document support** | Extend forensics to PDF documents (a common vector for evidence forgery) |

---

*Document prepared for M.Sc Final Year Project Defense — Brainybeam Info-Tech PVT LTD*  
*Digital Forensics Tampering Detector v1.0 — March 2026*
