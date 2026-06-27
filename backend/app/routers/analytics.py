from fastapi import APIRouter

from app.services.analytics_service import get_lab_analytics
from app.services.company_service import get_dashboard_summary


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
def dashboard() -> dict[str, object]:
    return get_dashboard_summary()


@router.get("/lab")
def lab() -> dict[str, object]:
    return get_lab_analytics()