from fastapi import APIRouter, HTTPException

from app.services.company_service import get_company_by_id, get_companies


router = APIRouter(tags=["companies"])


@router.get("/companies")
def list_companies() -> list[dict[str, object]]:
    return get_companies()


@router.get("/companies/{company_id}")
def read_company(company_id: int) -> dict[str, object]:
    company = get_company_by_id(company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company