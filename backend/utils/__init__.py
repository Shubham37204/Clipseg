from PIL import Image
import numpy as np
import base64
import io
from config.constants import MAX_IMAGE_SIZE


def decode_base64_image(base64_str: str) -> Image.Image:
    try:
        image_bytes = base64.b64decode(base64_str)
        image = Image.open(io.BytesIO(image_bytes))

        # validate format — only allow these
        if image.format not in ["JPEG", "PNG", "WEBP"]:
            raise ValueError(f"Unsupported format: {image.format}")

        # convert after validation
        return image.convert("RGB")
    except ValueError:
        raise
    except Exception:
        raise ValueError("Invalid or corrupted image")


def resize_image(image: Image.Image) -> Image.Image:
    w, h = image.size
    longest = max(w, h)
    if longest <= MAX_IMAGE_SIZE:
        return image
    scale = MAX_IMAGE_SIZE / longest
    new_w = int(w * scale)
    new_h = int(h * scale)
    return image.resize((new_w, new_h), Image.Resampling.LANCZOS)

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


def overlay_mask_on_image(
    image: Image.Image,
    mask_array: np.ndarray,
    alpha: float = 0.5,
    color: tuple = (255, 0, 0)
) -> str:
    # 1. Resize mask to match image size
    mask_uint8 = (mask_array * 255).astype(np.uint8)
    mask_img = Image.fromarray(mask_uint8)
    mask_img = mask_img.resize(image.size, resample=Image.Resampling.BILINEAR)
    mask_np = np.array(mask_img).astype(np.float32)

    # 2. Normalize mask to 0–1
    if mask_np.max() > 0:
        mask_np = mask_np / mask_np.max()

    # apply alpha
    mask_np = mask_np * alpha

    # convert to 0–255 grayscale
    mask_np = (mask_np * 255).astype(np.uint8)

    # convert to PIL "L" image (grayscale mask)
    mask_l = Image.fromarray(mask_np, mode="L")

    # 3. Create color layer
    color_layer = Image.new("RGB", image.size, color)

    # 4. Composite (blend)
    composite = Image.composite(color_layer, image, mask_l)

    # 5. Convert to base64
    buffer = io.BytesIO()
    composite.save(buffer, format="PNG")
    base64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return base64_str
