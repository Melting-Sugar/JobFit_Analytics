from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.matching_service import (
    DEFAULT_USER_PREFERENCE,
    build_user_preference_profile,
    get_matching_companies,
    get_matching_company_by_id,
)


class MatchingPreferenceRequest(BaseModel):
    salary_weight: int = Field(default=DEFAULT_USER_PREFERENCE.salary_weight, ge=1, le=5)
    work_life_weight: int = Field(default=DEFAULT_USER_PREFERENCE.work_life_weight, ge=1, le=5)
    holiday_weight: int = Field(default=DEFAULT_USER_PREFERENCE.holiday_weight, ge=1, le=5)
    remote_weight: int = Field(default=DEFAULT_USER_PREFERENCE.remote_weight, ge=1, le=5)
    stability_weight: int = Field(default=DEFAULT_USER_PREFERENCE.stability_weight, ge=1, le=5)
    growth_weight: int = Field(default=DEFAULT_USER_PREFERENCE.growth_weight, ge=1, le=5)
    ai_data_weight: int = Field(default=DEFAULT_USER_PREFERENCE.ai_data_weight, ge=1, le=5)
    self_development_weight: int = Field(default=DEFAULT_USER_PREFERENCE.self_development_weight, ge=1, le=5)
    prime_contractor_weight: int = Field(default=DEFAULT_USER_PREFERENCE.prime_contractor_weight, ge=1, le=5)
    risk_tolerance: int = Field(default=DEFAULT_USER_PREFERENCE.risk_tolerance, ge=1, le=5)


router = APIRouter(prefix="/matching", tags=["matching"])


@router.get("/companies")
def list_matching_companies() -> list[dict[str, object]]:
    return get_matching_companies()


@router.post("/companies")
def create_matching_companies(preference: MatchingPreferenceRequest) -> list[dict[str, object]]:
    preference_profile = build_user_preference_profile(preference.model_dump())
    return get_matching_companies(preference_profile)


@router.get("/companies/{company_id}")
def read_matching_company(company_id: int) -> dict[str, object]:
    company = get_matching_company_by_id(company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
