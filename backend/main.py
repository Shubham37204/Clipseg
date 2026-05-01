from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI(title="CLIPSeg API", version="1.0")

# CORS — allow Next.js frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# mount router with prefix "/api"
app.include_router(router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
