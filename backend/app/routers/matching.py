from fastapi import APIRouter, HTTPException

from app.services.matching_service import get_matching_companies, get_matching_company_by_id


router = APIRouter(prefix="/matching", tags=["matching"])


@router.get("/companies")
def list_matching_companies() -> list[dict[str, object]]:
    return get_matching_companies()


@router.get("/companies/{company_id}")
def read_matching_company(company_id: int) -> dict[str, object]:
    company = get_matching_company_by_id(company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
