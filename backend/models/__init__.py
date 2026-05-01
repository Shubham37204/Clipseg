import torch
from transformers import CLIPSegProcessor, CLIPSegForImageSegmentation
from config.settings import settings
from config.constants import MODEL_NAME
import os
from config.settings import settings

# tell HuggingFace library to use your token
os.environ["HF_TOKEN"] = settings.hf_token
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

processor = CLIPSegProcessor.from_pretrained(
    MODEL_NAME,
    cache_dir=settings.model_cache_dir
)

model = CLIPSegForImageSegmentation.from_pretrained(
    MODEL_NAME,
    cache_dir=settings.model_cache_dir
).to(device)
