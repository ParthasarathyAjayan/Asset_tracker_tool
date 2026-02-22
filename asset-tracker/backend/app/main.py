from fastapi import FastAPI
from app.routes import categories, employees, assets
from app.routes import clearance
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

app = FastAPI()

# Add GZIP compression middleware for faster responses
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(employees.router)
app.include_router(assets.router)
app.include_router(clearance.router)


@app.get("/")
def root():
    return {"message": "Asset Tracker Backend Running"}
