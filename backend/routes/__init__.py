from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models import processor, model
from utils import decode_base64_image, resize_image, mask_to_base64
import torch

router = APIRouter()


class SegmentRequest(BaseModel):
    image_base64: str
    prompt: str


class SegmentResponse(BaseModel):
    mask_base64: str
    prompt: str


@router.post("/segment", response_model=SegmentResponse)
async def segment_image(request: SegmentRequest):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        image = decode_base64_image(request.image_base64)
        image = resize_image(image)

        inputs = processor(
            text=[request.prompt],
            images=[image],
            return_tensors="pt"
        )

        device = next(model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits        # shape: (1, H, W)
        probs = torch.sigmoid(logits).squeeze().cpu().numpy()
        mask_base64 = mask_to_base64(probs)

        return SegmentResponse(mask_base64=mask_base64, prompt=request.prompt)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))