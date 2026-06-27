from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.analytics import router as analytics_router
from app.routers.companies import router as companies_router
from app.routers.matching import router as matching_router


app = FastAPI(title="JobFit Analytics API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3003",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(companies_router)
app.include_router(analytics_router)
app.include_router(matching_router)


@app.get("/")
def root() -> dict[str, object]:
    return {
        "message": "JobFit Analytics API is running.",
        "available_endpoints": [
            "/health",
            "/companies",
            "/companies/{company_id}",
            "/analytics/dashboard",
            "/analytics/lab",
            "/matching/companies",
            "POST /matching/companies",
            "/matching/companies/{company_id}",
        ],
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}