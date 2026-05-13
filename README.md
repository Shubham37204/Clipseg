# CLIPSeg Studio

> Zero-Shot Image Segmentation powered by CLIPSeg — isolate any object using text or visual prompts.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.2-EE4C2C?logo=pytorch)
![HuggingFace](https://img.shields.io/badge/HuggingFace-CLIPSeg-FFD21E?logo=huggingface)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## What It Does

CLIPSeg Studio lets you segment any object in an image without training a model. Two prompt modes:

- **Text prompt** — type `"person's face"` or `"car wheel"` → get a segmentation mask
- **Image prompt** — draw over the object directly on the canvas → AI finds similar regions

---

## Demo

| Mode | Input | Output |
|------|-------|--------|
| Text | `"person face"` | Red overlay on face region |
| Image | Draw circle on face | Mask of drawn region |
| Threshold 0.1 | Loose | Large mask area |
| Threshold 0.9 | Strict | Only high-confidence pixels |

---

## Architecture

```
┌─────────────────────────────┐
│   Next.js 16 (Frontend)     │  Text/Canvas input → Base64 image
│   TypeScript + shadcn/ui    │
└──────────────┬──────────────┘
               │ REST API (JSON + Base64)
               ▼
┌─────────────────────────────┐
│   FastAPI (Backend)         │  Model inference
│   Python + PyTorch          │  Mask generation
│                             │  Overlay blending
│   CLIPSeg (ViT-B/16)        │  GPU if available
│   HuggingFace Transformers  │
└─────────────────────────────┘
```

---

## Features

| Feature | Description |
|---------|-------------|
| Zero-shot segmentation | No model training required |
| Text prompt | Natural language object description |
| Image/visual prompt | Draw on canvas to define region |
| Confidence threshold | Slider to control mask strictness |
| Mask overlay | Red highlight blended on original |
| Inference timing | Per-request latency badge |
| Request logging | HTTP middleware logs every call |
| Input validation | File type, size, empty prompt checks |
| Download result | Save mask or overlay as PNG |
| Responsive UI | Works on desktop and mobile |

---

## Tech Stack

**Backend**
- Python 3.10+
- FastAPI 0.104 — REST API, middleware, CORS
- PyTorch 2.2 — model inference, GPU support
- HuggingFace Transformers — CLIPSeg `CIDAS/clipseg-rd64-refined`
- Pillow — image processing, mask overlay
- Pydantic v2 — settings management, request validation

**Frontend**
- Next.js 16 (App Router)
- TypeScript 5
- Tailwind CSS + shadcn/ui
- Framer Motion — page transitions
- Lucide Icons

---

## Project Structure

```
clipseg/
├── backend/
│   ├── config/
│   │   ├── settings.py       # ENV vars via pydantic-settings
│   │   └── constants.py      # Model name, image size, threshold
│   ├── models/
│   │   └── __init__.py       # CLIPSeg load at startup, GPU move
│   ├── routes/
│   │   └── __init__.py       # /segment + /segment-by-image
│   ├── utils/
│   │   └── __init__.py       # Decode, resize, mask, overlay
│   ├── main.py               # App, CORS, logging middleware
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx          # Landing + workspace, step flow
        │   └── layout.tsx
        ├── components/
        │   ├── ImageUpload.tsx   # Drag-drop, validation
        │   ├── TextPrompt.tsx    # Prompt input + threshold slider
        │   ├── CanvasDrawer.tsx  # Draw mask on image
        │   ├── SegmentationResult.tsx  # Tabbed result viewer
        │   ├── Navbar.tsx
        │   └── Footer.tsx
        └── services/
            └── api.ts            # segmentImage(), segmentByImage()
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 20+
- HuggingFace account (free) — get token at https://huggingface.co/settings/tokens

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your HF_TOKEN to .env

uvicorn main:app --reload --port 8000
```

Verify: `http://localhost:8000/health` → `{"status": "ok"}`

API docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open: `http://localhost:3000`

### Docker (Full Stack)

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |

---

## API Reference

### `POST /api/segment`
Text prompt segmentation.

```json
{
  "image_base64": "...",
  "prompt": "person face",
  "threshold": 0.3
}
```

Response:
```json
{
  "mask_base64": "...",
  "overlay_base64": "...",
  "prompt": "person face",
  "inference_ms": 1262.64
}
```

### `POST /api/segment-by-image`
Visual prompt segmentation.

```json
{
  "image_base64": "...",
  "mask_base64": "...",
  "threshold": 0.3
}
```

Response:
```json
{
  "mask_base64": "...",
  "overlay_base64": "...",
  "inference_ms": 1043.30
}
```

---

## Usage Tips

**Getting good results:**
- Start with threshold `0.3`. Raise only if mask is too large.
- If mask is all black → lower threshold to `0.1` first.
- Text prompts: be specific. `"red car door"` beats `"car"`.
- Canvas prompts: fill the object, don't just outline it.
- Check backend terminal for `probs max=X.XXXX` to see raw confidence.

**Supported image formats:** JPG, PNG, WebP — max 10MB

---

## How CLIPSeg Works

CLIPSeg (Lüddecke & Ecker, CVPR 2022) extends CLIP with a transformer decoder that produces dense predictions from text or image prompts.

```
Image → CLIP Visual Encoder ─┐
                              ├─→ Transformer Decoder → Segmentation Mask
Prompt → CLIP Text Encoder  ─┘
```

Model used: `CIDAS/clipseg-rd64-refined` — fine-grained weights with `complex_trans_conv=True`, ~4MB.

Paper: [Image Segmentation Using Text and Image Prompts](https://arxiv.org/abs/2112.10003)

---

## Environment Variables

**`backend/.env`**
```
HF_TOKEN=your_huggingface_token
MODEL_CACHE_DIR=./models_cache
LOG_LEVEL=INFO
BACKEND_URL=http://localhost:8000
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## License

MIT — source code only. Model weights governed by original CLIPSeg license.
