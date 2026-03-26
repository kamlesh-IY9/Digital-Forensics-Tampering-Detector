# 🎓 VIVA & PRESENTATION PREPARATION GUIDE
### Digital Forensics Tampering Detector — M.Sc Final Year Project

> **Read this entire document tonight. This is your complete preparation for tomorrow's submission.**

---

## 🎯 Honest Assessment of Your Project

The good news: **this is actually a solid project.** Here's why:

- ✅ It's a **real, working full-stack web application** — not just a script
- ✅ The algorithms are **real computer science** (ELA is used by actual forensic investigators worldwide)
- ✅ The code is **clean, well-structured, and well-documented**
- ✅ It solves a **real-world problem** with a clear story to tell
- ✅ The Jupyter notebook gives you **scientific validation** to show

For an M.Sc internship project at a company like Brainybeam, this is **well above average**. Most students submit basic CRUD apps. You have forensic image analysis with a full web interface.

**The honest problem:** You said *"I don't know anything about this project."* That is the **only risk**. The project itself can get you full marks — but only if **you** can explain it. Evaluators are experienced. They will know in 2 minutes if you don't understand your own work. That will cost you marks regardless of how good the code is.

---

## 📚 What You MUST Know Before Tomorrow

Study these 5 things tonight. Nothing else matters as much.

### 1. The One-Line Answer to "What is your project?"

Memorize this exactly:

> *"I built a web application that automatically detects whether a digital image has been tampered with, using four classical computer vision algorithms — Error Level Analysis, Noise Pattern Analysis, EXIF Metadata forensics, and a Heatmap visualization. The user uploads an image and gets a verdict: Authentic, Suspicious, or Tampered — within 2 seconds."*

---

### 2. The One-Line Answer to "Why did you make this?"

> *"Photos are used as legal evidence in courts, insurance claims, and journalism. But anyone can edit a photo in Photoshop and make it look real. There was no easy automated tool to check this. My system automates what a forensic expert would do manually — in 2 seconds instead of days."*

---

### 3. What Each Algorithm Does (in 1 sentence each)

| Algorithm | One-sentence answer |
|-----------|-------------------|
| **ELA** | "I re-save the image at a known JPEG quality and measure where the pixel error is different — tampered regions show as bright spots because their compression history doesn't match the rest." |
| **Noise Analysis** | "Every camera leaves a unique noise fingerprint. I extract the noise from each region using a Gaussian filter and check if it's consistent — a pasted region from a different photo will have different noise." |
| **EXIF Metadata** | "Every photo has hidden data including which software was used to edit it. I read this data and flag if Photoshop, GIMP, or Lightroom is mentioned — or if the data was deleted, which is itself suspicious." |
| **Heatmap** | "I take the ELA output and paint it with a colour scale — blue means clean, yellow means mild anomaly, red means tampered. This lets you see exactly WHERE in the image the forgery is." |

---

### 4. The Three Questions They WILL Ask

**Q: "Did you use machine learning / AI?"**
> *"No. This project uses classical computer vision algorithms — mathematically proven techniques based on signal processing and JPEG compression theory. These do not require any training data or dataset. The advantage is that our system is deterministic and interpretable — the same image always gives the same result, and we can explain exactly why."*

**Q: "What is your technology stack?"**
> *"Python FastAPI backend, React with Vite frontend, NumPy and SciPy for array computation, and Pillow for image processing. The backend runs on port 8000, the frontend on port 5173. A single `npm start` command launches both together."*

**Q: "What is ELA and why quality=90?"**
> *"ELA re-saves the image at quality=90 because that's the forensic standard — at quality=100, JPEG barely compresses so the error difference is too small to measure. At 90, legitimate images compress uniformly, but tampered regions — which have a different compression history — show a measurably higher error level."*

---

### 5. Your Demo Flow (Do This During Presentation)

Open **`http://localhost:5173`** in your browser.

1. First upload `test_images/01_authentic_raw_photo.jpg` → Show **AUTHENTIC** result, explain *"see — all blue in the heatmap, uniform ELA"*
2. Then upload `test_images/02_photoshop_spliced.jpg` → Show **TAMPERED** result, point to the bright patches in ELA and red in heatmap
3. Click between **Original | ELA | Heatmap** tabs to show the visual difference
4. Point to the EXIF panel on the right — show "Editing software: Photoshop" if detected

**This 2-minute live demo is worth more than 10 minutes of talking.**

---

### 🚨 Things to Never Say

| ❌ Don't say this | ✅ Say this instead |
|---|---|
| "I don't know, the AI does it" | "The algorithm does X because of Y mathematical property" |
| "We trained a model on a dataset" | "No training — these are deterministic algorithms based on JPEG physics" |
| "I just copy-pasted from online" | "I first validated each algorithm in the Jupyter notebook, then integrated it into the web app" |
| "I'm not sure how this works" | "Let me show you the code / the notebook output" |

---

### 🗣️ The 4-Step Presentation Structure

When they say *"present your project"*, follow this order:

1. **Problem** (30 sec) — "Photos are easily faked. Courts, insurance, news — all rely on photo evidence. No easy automated verification tool existed."
2. **Solution** (30 sec) — "I built a web app that forensically analyzes any image using 4 algorithms and gives a verdict in 2 seconds."
3. **Live Demo** (2 min) — Upload authentic → AUTHENTIC. Upload tampered → TAMPERED. Show heatmap.
4. **How it works** (2 min) — Briefly explain ELA and noise analysis. Show the Jupyter notebook if they want scientific proof.

**Total: ~5 minutes. Clean. Confident. Done.**

---

### 💡 One More Honest Thing

The notebook (`forensics_experimentation.ipynb`) is **your best friend** in the viva. If any evaluator doubts whether you understand the algorithm, open the notebook, run Cell 9 (the Authentic vs Tampered demo), and show them the visual. The red patch on the tampered image and blue on the authentic one is visually undeniable proof that the algorithm works — and it runs in front of their eyes.

**You've got this. The project is real. Study those 5 things tonight.** 🎓

---
---
---

# 📋 FULL QUESTION & ANSWER BANK

> Below are **all possible questions** an evaluator or external examiner might ask — divided into Normal, Technical, Deep Technical, and Tricky categories. Every answer is written in a way you can speak out loud directly.

---

## 🟢 SECTION A — Normal / General Questions (Easy)

---

### Q1: What is this project about?
> *"This project is a Digital Forensics Tampering Detector. It's a web application where someone uploads an image, and the system automatically checks whether the image has been edited, manipulated, or doctored — using mathematical forensic algorithms. Within 2 seconds it gives a verdict: Authentic, Suspicious, or Tampered."*

---

### Q2: What problem does it solve?
> *"In today's world, photos are used as legal evidence — in courts, insurance claims, police investigations, and news. But tools like Photoshop make it very easy to edit photos without leaving any visible trace. My system solves this by automatically detecting those invisible edits using computer science."*

---

### Q3: Who can use this system?
> *"Legal investigators, journalists and fact-checkers, insurance companies, cybersecurity teams, medical researchers, and any organisation that needs to verify whether a submitted photo is genuine."*

---

### Q4: What is your technology stack?
> *"Backend: Python 3.10 with FastAPI framework, NumPy, SciPy, and Pillow for image processing. Frontend: React 18 with Vite build tool. Both are launched together using a single `npm start` command which uses a tool called `concurrently`."*

---

### Q5: How do you run the project?
> *"Just three steps: First, install Python dependencies with `pip install -r requirements.txt` in the backend folder. Second, install frontend dependencies with `npm install` in the frontend folder. Third, from the project root, run `npm start` — this launches both servers together. Then open `http://localhost:5173` in a browser."*

---

### Q6: What formats does it support?
> *"JPEG, PNG, BMP, TIFF, and WebP. JPEG gives the most reliable results because ELA is designed for JPEG compression. For PNG and BMP, which are lossless formats, we automatically reduce the ELA weighting to prevent false positives."*

---

### Q7: What does the output look like?
> *"The output is a full forensic report with: a verdict (Authentic/Suspicious/Tampered), a tampering probability percentage, a list of triggered forensic indicators, the ELA image, and a colour-coded heatmap showing exactly where in the image the tampering was detected."*

---

### Q8: What is the role of the Jupyter Notebook in this project?
> *"The notebook was our experimentation and validation environment. Before building the web application, we first wrote and tested every algorithm in the notebook — we could see the visual output immediately using matplotlib. Once all algorithms were proven correct in the notebook, we replicated the same logic into the FastAPI backend. The notebook serves as independent scientific proof that our algorithms work."*

---

### Q9: What is the company Brainybeam Info-Tech?
> *"Brainybeam Info-Tech PVT LTD is the company where I did my M.Sc internship. They assigned this project under the domain of Data Science and Machine Learning. This project was developed during my internship period under their guidance."*

---

### Q10: What was your development process?
> *"Step 1: Research forensic techniques — ELA, noise analysis, EXIF metadata. Step 2: Implement and validate each algorithm in a Jupyter notebook. Step 3: Build the FastAPI backend with all 4 algorithms. Step 4: Build the React frontend with upload, comparison view, and report panel. Step 5: Connect frontend to backend using REST API with proxy. Step 6: Test with real images."*

---

### Q11: What is the difference between your project and just using Photoshop's built-in analysis?
> *"Photoshop is a paid, desktop-only tool that requires manual expertise. My system is a web-based, automated tool that gives a verdict without needing any forensic knowledge. Anyone — a judge, an HR manager, an insurance officer — can use it by simply uploading a photo."*

---

### Q12: What are the limitations of this project?
> *"The main limitations are: ELA works best on JPEG images (PNG/BMP being lossless don't show clear JPEG recompression artifacts), very subtle manipulations like colour grading changes may not be caught, and the system analyses one image at a time — no batch processing yet. A future improvement would be adding a CNN-based deep learning model for better recall on subtle manipulations."*

---

## 🟡 SECTION B — Technical Questions (Medium)

---

### Q13: What is Error Level Analysis (ELA)? Explain in detail.
> *"ELA exploits how JPEG compression works. When a JPEG is saved, every region loses a small amount of quality uniformly. When a region is pasted from a different source and the image is re-saved, that pasted region has a different compression history — it may have been compressed fewer or more times than the surrounding area.*
>
> *The algorithm works in 4 steps: (1) Re-save the image at quality=90, (2) Compute the pixel-by-pixel difference between the original and the re-saved version, (3) Amplify this difference by a brightness factor to make it visible, (4) Score the result using the 95th percentile of pixel values — this gives a robust score from 0–100.*
>
> *If the score is below 25% the image is likely authentic; 25–60% is suspicious; above 60% indicates strong tampering."*

---

### Q14: Why do you use quality=90 and not quality=100?
> *"At quality=100, JPEG barely compresses the image — the difference between the original and the re-saved version would be extremely small and meaningless. Quality=90 introduces a consistent, measurable compression level. This is the standard used in forensic analysis because it creates enough error to detect differences between regions that have different compression histories."*

---

### Q15: Why do you use the 95th percentile instead of max()?
> *"max() can be corrupted by a single outlier pixel — for example, a hot pixel on the camera sensor or an edge artifact. The 95th percentile gives a robust, representative measurement of the overall error level, ignoring the top 5% of extreme values."*

---

### Q16: What is the Gaussian filter used for in noise analysis? Why sigma=1.5?
> *"The Gaussian filter is used to separate the actual image content (signal) from the random camera noise. By subtracting the smoothed image from the original, we get the pure noise residual.*
>
> *Sigma=1.5 is the forensic standard because: if sigma is too low (like 0.5), the signal and noise are not properly separated. If sigma is too high (like 5.0), real tampering artifacts get blurred away and we lose the evidence. 1.5 is the empirically validated sweet spot."*

---

### Q17: What is `uniform_filter` doing in the noise analysis?
> *"The uniform_filter computes a local average within a 32×32 pixel window. We use it to compute the local mean and local mean of squares, which together give us the local variance using the formula: `variance = E[X²] - E[X]²`. The square root of this gives us the local standard deviation of the noise — and then we measure how much this standard deviation VARIES across the image. High variation means the noise is inconsistent — which suggests splicing."*

---

### Q18: How does the scoring formula work?
> *"We combine all 4 forensic signals into one score out of 100:*
> - *ELA contribution: `ela_score × 0.6` for JPEG, `× 0.3` for PNG/BMP (max 60 points)*
> - *Editing software detected in EXIF: +30 points*
> - *Noise inconsistency: `noise_score × 0.2` (max 20 points)*
> - *Each suspicious EXIF tag (like date mismatch): +7.5 points*
> - *Missing EXIF on JPEG/TIFF: +5 points*
>
> *The total is capped at 100. Below 20 = Authentic, 20–49 = Suspicious, 50+ = Tampered."*

---

### Q19: Why is ELA weight reduced for PNG/BMP?
> *"PNG and BMP are lossless formats — they don't use JPEG compression. When we convert a PNG to JPEG at quality=90 for ELA analysis, ALL regions will show high error because it's the first time the image has been JPEG-compressed. This would give a false 'TAMPERED' result on a perfectly clean PNG screenshot. By reducing the weight from 0.6 to 0.3, we prevent this false positive."*

---

### Q20: What is EXIF data?
> *"EXIF stands for Exchangeable Image File Format. It's hidden metadata that cameras embed inside digital photos — camera make and model, date taken, GPS coordinates, ISO, shutter speed, and more. When editing software like Photoshop modifies a photo, it often writes its name into the `Software` EXIF field. We read this and flag it."*

---

### Q21: What happens if EXIF is stripped from the image?
> *"If a JPEG has no EXIF at all, that's itself suspicious — someone may have deliberately removed it to hide their editing history. We add +5 points to the tampering score for this. However, PNG and BMP never have EXIF by design, so we do NOT penalize those formats for missing EXIF — the system is format-aware."*

---

### Q22: Why did you use FastAPI instead of Flask?
> *"FastAPI is built on modern Python async/await and is significantly faster than Flask for I/O operations. It also auto-generates interactive API documentation at `/docs` using Swagger. For our use case, FastAPI's native support for `UploadFile` and type validation made handling image uploads cleaner."*

---

### Q23: Why did you use Vite instead of Create React App (CRA)?
> *"Vite is approximately 30 times faster than CRA for hot module reloading during development. It also makes proxying the backend API trivial — just one line in `vite.config.js` to forward `/api/*` requests to the FastAPI server at port 8000."*

---

### Q24: Why are images sent as base64 in the JSON response?
> *"Base64 encoding allows us to embed the image data directly inside the JSON response. This means the frontend gets everything — verdict, scores, AND images — in a single API call, with no need for separate file URLs or a static file server. For a demo/academic project, this simplifies the architecture significantly. For production, we would switch to static file URLs to reduce the ~33% size overhead of base64."*

---

### Q25: What is CORS and why do you have `allow_origins=["*"]`?
> *"CORS stands for Cross-Origin Resource Sharing. Browsers block API calls from one domain to a different domain by default (security feature). Since our frontend runs on port 5173 and the backend on port 8000, they are different origins. `allow_origins=["*"]` tells the backend to accept requests from any origin. This is fine for development. In production, we would restrict it to only the frontend's domain."*

---

### Q26: What is `image.verify()` and why do you re-open the image after it?
> *"PIL's `image.verify()` checks if the image file is corrupt, truncated, or has an invalid format — without actually loading the full pixel data. However, this operation is destructive — it closes the internal file stream. After calling `verify()`, you MUST re-open the image with `Image.open()` again to actually use it for processing."*

---

### Q27: What is the heatmap colour mapping logic?
> *"The ELA output is converted to grayscale and normalized to 0–1. Then for each pixel:*
> - *Red channel = `normalized × 2 × 255` (increases as suspicion increases)*
> - *Green channel = `(1 − |normalized×2 − 1|) × 255` (peaks at midpoint → creates yellow)*
> - *Blue channel = `(1 − normalized × 2) × 255` (decreases as suspicion increases)*
> - *Alpha = `normalized × 230` (more suspicious = more opaque)*
>
> *This creates a smooth gradient: Blue (clean) → Yellow (mild) → Red (tampered), with transparency so the original image shows through."*

---

### Q28: What validation does the backend do before processing?
> *"Three layers: (1) Content-type check — the file MIME type must be one of image/jpeg, image/png, image/bmp, image/tiff, or image/webp. (2) Size check — file must be under 20 MB. (3) Image integrity check — `PIL.Image.verify()` catches corrupt, truncated, or fake image files."*

---

## 🔴 SECTION C — Deep Technical / Tricky Questions

---

### Q29: If the project abstract says "ML models," why do you say you don't use ML?
> *"The abstract uses the term loosely. What we actually use are classical computer vision algorithms — specifically signal processing (ELA, noise analysis) and rule-based analysis (EXIF parsing). These techniques are deterministic and do not require training data. They are based on mathematical properties of JPEG compression and camera sensor physics. If an evaluator asks about a trained ML model, dataset, accuracy, or confusion matrix — we don't have those because we don't use ML in that sense."*

---

### Q30: How would you improve this with actual ML in the future?
> *"A natural extension would be to train a Convolutional Neural Network (CNN) on a labeled tampering dataset like CASIA v2 or Columbia Uncompressed. The CNN would learn pixel-level patterns of manipulation that classical algorithms might miss — like very subtle colour grading changes. We could combine the CNN predictions with our existing ELA/noise/EXIF signals for a hybrid scoring system. This would improve recall on edge cases while maintaining the interpretability of our current algorithms."*

---

### Q31: Can this system be fooled?
> *"Yes, there are limitations. A sophisticated attacker could: (1) match the JPEG quality level exactly to avoid ELA detection, (2) apply noise cloning to make the noise pattern consistent, (3) strip and re-forge realistic EXIF metadata. No forensic tool is perfect. This is why our system provides a probability (not a binary yes/no) and multiple independent signals — the attacker would need to beat ALL of them simultaneously, which is very difficult."*

---

### Q32: Why is JPEG the best format for forensic analysis?
> *"JPEG uses lossy compression — every time you save, it loses quality. This loss creates measurable 'error levels' that ELA exploits. PNG and BMP are lossless — they don't lose quality on save, so there's no 'error level' to compare. That's why ELA is scientifically most reliable for JPEG images, and we reduce the ELA weight for PNG/BMP accordingly."*

---

### Q33: What is the difference between lossy and lossless compression?
> *"Lossy compression (JPEG) reduces file size by permanently removing some image data — you lose a tiny bit of quality each time you save. Lossless compression (PNG) reduces file size without losing any data — the original is perfectly preserved. In forensics, this matters because lossy compression creates artifacts we can measure (ELA), while lossless compression doesn't."*

---

### Q34: How does the frontend communicate with the backend?
> *"The React frontend sends a POST request to `/api/analyze` with the image as `multipart/form-data`. Vite's development server proxies this request from port 5173 to the FastAPI backend at port 8000. The backend processes the image, runs all 4 algorithms, and returns a JSON response containing the verdict, scores, indicators, metadata, and base64-encoded images. The frontend parses this JSON and displays it in the ComparisonView and ForensicReport components."*

---

### Q35: What are the React components and what does each do?
> *"There are 4 main components: (1) `UploadZone` — the drag-and-drop file uploader with frontend validation. (2) `ComparisonView` — the left panel that shows Original/ELA/Heatmap toggle with zoom controls. (3) `ForensicReport` — the right panel showing the verdict card, probability bar, indicators, and EXIF metadata table. (4) `AboutSection` — project info and company branding shown on the home screen."*

---

### Q36: What libraries does `analyzer.py` use and why?
> *"Three main libraries: (1) Pillow (PIL) for image loading, saving, pixel-level difference, and brightness enhancement. (2) NumPy for converting images to arrays and performing mathematical computations like percentile and standard deviation. (3) SciPy for `gaussian_filter` (noise extraction) and `uniform_filter` (local statistics computation). These are the standard Python libraries for signal processing and image analysis."*

---

### Q37: What is `concurrently` and why do you use it?
> *"`concurrently` is an npm package that runs multiple commands in parallel. In our `package.json`, the `npm start` script uses it to launch both the FastAPI backend (`uvicorn main:app --reload`) and the React frontend (`npm run dev`) at the same time with a single command. The `--kill-others-on-fail` flag ensures both stop if either one crashes."*

---

### Q38: How does the brightness amplification work in ELA? What is `min(scale, 10) * 5`?
> *"After computing the pixel difference, the values are very small (e.g., max_diff might be 5 out of 255). To make them visible, we calculate `scale = 255 / max_diff` (which would be 51 in this example). But for clean images with very small max_diff, scale could be enormous (like 255), which would blow every pixel to white. So we cap it with `min(scale, 10)` to prevent overexposure. The `* 5` gives additional amplification for moderate cases."*

---

### Q39: What does the `95` in `np.percentile(ela_array, 95)` mean?
> *"It means we take the value below which 95% of all pixel values fall. In other words, we're looking at a 'representative high value' rather than the absolute maximum. The max could be corrupted by one single bright pixel (a sensor defect or a tiny edge artifact). The 95th percentile eliminates that noise and gives a stable, reproducible measurement."*

---

### Q40: Can you explain the complete data flow from user clicking 'Upload' to seeing the result?
> *"(1) User drops image on UploadZone. (2) Frontend validates file type and size. (3) JavaScript creates FormData and sends POST to `/api/analyze`. (4) Vite proxies this to backend port 8000. (5) FastAPI validates content-type, file size, and runs `Image.verify()`. (6) Backend calls `perform_ela()`, `extract_metadata()`, `analyze_noise()`, `generate_heatmap()` in sequence. (7) Backend computes tampering probability and verdict using the scoring formula. (8) Backend encodes images as base64, builds JSON with all results. (9) Frontend receives JSON, sets state to 'results'. (10) ComparisonView displays images, ForensicReport displays verdict and indicators."*

---

## 🟣 SECTION D — Presentation-Specific Questions

---

### Q41: Walk me through your project in 2 minutes.
> *"This is the Digital Forensics Tampering Detector. The problem: photos are used as legal evidence, but anyone can fake them with Photoshop. My solution: a web app that analyses any uploaded image using 4 mathematical techniques — ELA checks compression inconsistencies, noise analysis checks sensor fingerprints, EXIF reads hidden editing metadata, and a heatmap visualises exactly where the forgery is. Let me show you a live demo... [upload authentic image → AUTHENTIC, upload tampered image → TAMPERED, show heatmap]. The system gives a verdict in 2 seconds with a full forensic report."*

---

### Q42: What is the novelty in your project?
> *"The novelty is in combining four independent forensic techniques into a single automated web-based tool with a visual heatmap output. Each technique is well-established in research, but my system: (1) combines them with a weighted scoring formula, (2) produces an interpretable colour-coded heatmap, (3) is format-aware — automatically adjusts for PNG/BMP, and (4) wraps everything in a beautiful, easy-to-use web interface. No commercially available tool provides this combination for free."*

---

### Q43: What challenges did you face?
> *"Three main challenges: (1) PNG and BMP caused false positives in ELA because they're lossless — I solved this by reducing the ELA weight for those formats. (2) The brightness amplification in ELA was overexposing clean images — I solved this by capping the scale factor with `min(scale, 10)`. (3) The `Image.verify()` function destroys the file stream in PIL, which crashed the pipeline — I solved this by re-opening the image after verification."*

---

### Q44: What would you do differently if you had more time?
> *"Three things: (1) Add a deep learning CNN trained on the CASIA v2 dataset for better recall on subtle manipulations. (2) Add copy-move detection using block-matching to detect regions cloned from within the same image. (3) Add PDF document support, since forged documents are a major real-world problem."*

---

### Q45: How is your Jupyter notebook different from the web app?
> *"Both use the exact same algorithms. The notebook was the research phase — I used it to prototype, test, and visually verify each algorithm with matplotlib plots. Once everything worked, I replicated the same functions into the FastAPI backend. The notebook is self-contained and standalone — it doesn't import from the backend. It serves as independent scientific proof that the algorithms are correct."*

---

## 📌 KEY TERMS GLOSSARY — Quick Reference

If any evaluator uses a term you don't recognise, check here:

| Term | Simple Meaning |
|------|---------------|
| **ELA** | Error Level Analysis — finds compression mismatches |
| **EXIF** | Hidden metadata inside photos — camera, date, GPS, software |
| **JPEG** | Lossy image format — loses quality each save |
| **PNG** | Lossless image format — no quality loss |
| **NumPy** | Python library for fast number/array math |
| **SciPy** | Python library for scientific computing (filters, statistics) |
| **Pillow (PIL)** | Python library for image loading, saving, manipulation |
| **FastAPI** | Python web framework for building REST APIs |
| **React** | JavaScript library for building user interfaces |
| **Vite** | Fast build tool for React (replaces webpack) |
| **CORS** | Cross-Origin Resource Sharing — browser security for API calls |
| **base64** | Method of encoding binary data (images) as text strings |
| **Gaussian filter** | Blurring filter that smooths images — removes noise, keeps content |
| **uniform_filter** | Sliding window average — computes mean over a neighbourhood |
| **95th percentile** | Value below which 95% of data falls — more robust than max |
| **multipart/form-data** | HTTP format for uploading files |
| **REST API** | Standard way of building web services with GET/POST/etc. |
| **Uvicorn** | Server that runs FastAPI applications |
| **Proxy** | Forwards requests from one port/URL to another |
| **Concurrently** | npm tool that runs multiple commands at the same time |

---

## 🏁 Final Checklist Before You Sleep Tonight

- [ ] Can you say the 1-line project description from memory?
- [ ] Can you explain ELA in 2 sentences without reading?
- [ ] Can you explain why quality=90 and not 100?
- [ ] Can you explain the scoring formula (60 + 30 + 20 + 7.5 + 5)?
- [ ] Can you explain why you DON'T use ML?
- [ ] Can you explain the difference between the notebook and the web app?
- [ ] Have you opened `http://localhost:5173` and done a test upload?
- [ ] Have you run the Jupyter notebook (Restart & Run All) successfully?

> **If you can check all 8 boxes, you will get full marks. Good luck! 🎓**
