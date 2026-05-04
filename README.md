# CLIPSeg Studio

A modern, high-performance web application for **Zero-Shot Image Segmentation** using the CLIPSeg model. Isolate any object in an image using either text prompts or visual scribbles.

![Aesthetic Preview](https://img.shields.io/badge/UI-Modern-orange)
![Tech Stack](https://img.shields.io/badge/Next.js-FastAPI-blue)

## 🚀 Features

- **Text-Based Segmentation**: Type "the red apple" or "mountain peak" to isolate objects instantly.
- **Image-Based Selection**: Draw directly on the image to show the AI what you want to extract.
- **Real-time Refinement**: Adjust the **Confidence Threshold** slider to fine-tune your masks in real-time.
- **Smart Feedback**: Proactive error handling that suggests lower thresholds when detections are weak.
- **Multi-Step Workflow**: A guided, distraction-free experience from upload to result.
- **Visual Audit**: View original, mask, and overlay comparisons side-by-side.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion, Lucide Icons, Shadcn UI.
- **Backend**: FastAPI (Python), PyTorch, Hugging Face Transformers (CLIPSeg).
- **Orchestration**: Docker & Docker Compose.

## 📦 Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 20+
- Docker (Optional)

### 2. Local Setup

#### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

### 3. Docker Setup (Recommended)
The easiest way to run the full stack is via Docker Compose:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## 💡 Usage Tips

- **Thresholding**: If the mask is black, try lowering the **Confidence Threshold** slider (e.g., to 0.2).
- **Visual Prompts**: When drawing, fill the object area completely rather than just outlining it for better AI detection.
- **Prompts**: Be descriptive in text mode (e.g., "a silver laptop" works better than just "laptop").

