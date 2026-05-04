import time
from PIL import Image
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models import processor, model
import torch
import numpy as np

from utils import (
    decode_base64_image,
    resize_image,
    mask_to_base64,
    overlay_mask_on_image
)

router = APIRouter()


class SegmentRequest(BaseModel):
    image_base64: str
    prompt: str
    threshold: float = 0.5


class SegmentResponse(BaseModel):
    mask_base64: str
    overlay_base64: str
    prompt: str
    inference_ms: float


class ImagePromptRequest(BaseModel):
    image_base64: str        # target image
    mask_base64: str
    threshold: float = 0.3

class ImagePromptResponse(BaseModel):
    mask_base64: str
    overlay_base64: str
    inference_ms: float


@router.post("/segment", response_model=SegmentResponse)
async def segment_image(request: SegmentRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        # Decode + preprocess image
        image = decode_base64_image(request.image_base64)
        image = resize_image(image)

        # Prepare inputs
        inputs = processor(
            text=[request.prompt],
            images=[image],
            return_tensors="pt"
        )

        device = next(model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}

        # ⏱️ Start timing (ONLY inference)
        start = time.time()

        # Model inference
        with torch.no_grad():
            outputs = model(**inputs)

        # ⏱️ End timing
        inference_ms = round((time.time() - start) * 1000, 2)
        logits = outputs.logits
        probs = torch.sigmoid(logits).squeeze().cpu().numpy()
        probs = np.where(probs >= request.threshold, probs, 0)

        # Generate outputs
        mask_base64 = mask_to_base64(probs)
        overlay_base64 = overlay_mask_on_image(image, probs)

        return SegmentResponse(
            mask_base64=mask_base64,
            overlay_base64=overlay_base64,
            prompt=request.prompt,
            inference_ms=inference_ms
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/segment-by-image", response_model=ImagePromptResponse)
async def segment_by_image(request: ImagePromptRequest):
    try:
        image = decode_base64_image(request.image_base64)
        mask = decode_base64_image(request.mask_base64)

        image = resize_image(image)
        mask = mask.resize(image.size).convert("L")  # grayscale

        # Apply mask to original image → extract object region
        mask_np = np.array(mask)
        image_np = np.array(image)

        # Where mask is white → keep pixels, else black
        masked_region = image_np.copy()
        masked_region[mask_np < 128] = 0  # black out non-drawn areas

        # Visual prompt = the extracted region as PIL image
        visual_prompt_img = Image.fromarray(masked_region)

        inputs = processor(
            images=[image],
            visual_prompt=[visual_prompt_img],
            return_tensors="pt"
        )

        device = next(model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}

        start = time.time()
        with torch.no_grad():
            outputs = model(**inputs)
        inference_ms = round((time.time() - start) * 1000, 2)

        logits = outputs.logits
        probs = torch.sigmoid(logits).squeeze().cpu().numpy()

        print(f"probs min={probs.min():.4f} max={probs.max():.4f}")

        probs = np.where(probs >= request.threshold, probs, 0)

        mask_base64 = mask_to_base64(probs)
        overlay_base64 = overlay_mask_on_image(image, probs)

        return ImagePromptResponse(
            mask_base64=mask_base64,
            overlay_base64=overlay_base64,
            inference_ms=inference_ms
        )

    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=traceback.format_exc())