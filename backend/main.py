import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routes import router

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CLIPSeg API", version="1.0")

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Skip health check to reduce noise
    if request.url.path == "/health":
        return await call_next(request)

    start = time.perf_counter()

    try:
        response = await call_next(request)
        status_code = response.status_code
    except Exception as e:
        status_code = 500
        raise e
    finally:
        duration_ms = round((time.perf_counter() - start) * 1000, 2)

        logger.info(
            f"{request.method} {request.url.path} | {status_code} | {duration_ms}ms"
        )

    return response


# Mount API routes
app.include_router(router, prefix="/api")


# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}