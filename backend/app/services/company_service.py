from __future__ import annotations

import json
from collections import Counter
from functools import lru_cache
from pathlib import Path


DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "companies_seed.json"


@lru_cache(maxsize=1)
def load_companies() -> list[dict[str, object]]:
    with DATA_FILE.open(encoding="utf-8") as file_handle:
        return json.load(file_handle)


def get_companies() -> list[dict[str, object]]:
    return load_companies()


def get_company_by_id(company_id: int) -> dict[str, object] | None:
    return next((company for company in load_companies() if company["id"] == company_id), None)


def calculate_fit_score(company: dict[str, object]) -> float:
    positive_features = (
        float(company["remote_score"])
        + float(company["stability_score"])
        + float(company["growth_score"])
        + float(company["ai_data_score"])
        + float(company["self_development_score"])
        + float(company["prime_contractor_score"])
        + float(company["annual_holidays"]) / 10.0
        + float(company["average_salary"]) / 100.0
    )
    risk_features = (
        float(company["overtime_hours"])
        + float(company["assignment_uncertainty_score"])
        + float(company["information_risk_score"])
    )
    score = positive_features * 2.2 - risk_features * 1.3
    return round(max(0.0, min(100.0, score)), 1)


def get_dashboard_summary() -> dict[str, object]:
    companies = load_companies()
    scored_companies = [
        {**company, "fit_score": calculate_fit_score(company)}
        for company in companies
    ]
    top_companies = sorted(
        scored_companies,
        key=lambda company: company["fit_score"],
        reverse=True,
    )[:5]

    industry_counts = Counter(str(company["industry"]) for company in companies)
    location_counts = Counter(str(company["location"]) for company in companies)

    total_companies = len(companies)

    return {
        "total_companies": total_companies,
        "average_salary": round(
            sum(float(company["average_salary"]) for company in companies) / total_companies,
            1,
        ),
        "average_overtime_hours": round(
            sum(float(company["overtime_hours"]) for company in companies) / total_companies,
            1,
        ),
        "average_remote_score": round(
            sum(float(company["remote_score"]) for company in companies) / total_companies,
            1,
        ),
        "average_fit_score": round(
            sum(company["fit_score"] for company in scored_companies) / total_companies,
            1,
        ),
        "top_companies": top_companies,
        "industry_breakdown": [
            {"industry": industry, "count": count}
            for industry, count in industry_counts.most_common()
        ],
        "location_breakdown": [
            {"location": location, "count": count}
            for location, count in location_counts.most_common()
        ],
    }