from PIL import Image
import numpy as np
import base64
import io
from config.constants import MAX_IMAGE_SIZE


def decode_base64_image(base64_str: str) -> Image.Image:
    try:
        image_bytes = base64.b64decode(base64_str)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        return image
    except Exception:
        raise ValueError("Invalid base64 image string")


def resize_image(image: Image.Image) -> Image.Image:
    w, h = image.size
    longest = max(w, h)
    if longest <= MAX_IMAGE_SIZE:
        return image
    scale = MAX_IMAGE_SIZE / longest
    new_w = int(w * scale)
    new_h = int(h * scale)
    return image.resize((new_w, new_h), Image.LANCZOS)


def mask_to_base64(mask_array: np.ndarray) -> str:
    normalized = (mask_array - mask_array.min())
    max_val = mask_array.max() - mask_array.min()
    if max_val > 0:
        normalized = normalized / max_val
    uint8_mask = (normalized * 255).astype(np.uint8)
    mask_image = Image.fromarray(uint8_mask)
    buffer = io.BytesIO()
    mask_image.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")