from __future__ import annotations

from dataclasses import dataclass

from sklearn.metrics.pairwise import cosine_similarity

from app.services.company_service import get_company_by_id, get_companies


@dataclass(frozen=True)
class UserPreferenceProfile:
    salary_weight: int = 4
    work_life_weight: int = 5
    holiday_weight: int = 5
    remote_weight: int = 4
    stability_weight: int = 4
    growth_weight: int = 4
    ai_data_weight: int = 5
    self_development_weight: int = 5
    prime_contractor_weight: int = 4
    risk_tolerance: int = 2


DEFAULT_USER_PREFERENCE = UserPreferenceProfile()


def build_user_preference_profile(preference_data: dict[str, int]) -> UserPreferenceProfile:
    return UserPreferenceProfile(**preference_data)


def _to_percent_from_10_score(value: float) -> float:
    return max(0.0, min(100.0, value * 10.0))


def _normalize_value(value: float, min_value: float, max_value: float) -> float:
    if max_value <= min_value:
        return 50.0
    return (value - min_value) / (max_value - min_value) * 100.0


def _normalize_dataset_metrics(companies: list[dict[str, object]]) -> dict[str, tuple[float, float]]:
    salary_values = [float(company["average_salary"]) for company in companies]
    overtime_values = [float(company["overtime_hours"]) for company in companies]
    holiday_values = [float(company["annual_holidays"]) for company in companies]
    return {
        "salary": (min(salary_values), max(salary_values)),
        "overtime": (min(overtime_values), max(overtime_values)),
        "holiday": (min(holiday_values), max(holiday_values)),
    }


def _build_company_feature_scores(
    company: dict[str, object],
    dataset_ranges: dict[str, tuple[float, float]],
) -> dict[str, float]:
    salary_min, salary_max = dataset_ranges["salary"]
    overtime_min, overtime_max = dataset_ranges["overtime"]
    holiday_min, holiday_max = dataset_ranges["holiday"]

    salary_score = _normalize_value(float(company["average_salary"]), salary_min, salary_max)
    overtime_score = 100.0 - _normalize_value(float(company["overtime_hours"]), overtime_min, overtime_max)
    holiday_score = _normalize_value(float(company["annual_holidays"]), holiday_min, holiday_max)

    return {
        "salary": max(0.0, min(100.0, salary_score)),
        "work_life": max(0.0, min(100.0, overtime_score)),
        "holiday": max(0.0, min(100.0, holiday_score)),
        "remote": _to_percent_from_10_score(float(company["remote_score"])),
        "stability": _to_percent_from_10_score(float(company["stability_score"])),
        "growth": _to_percent_from_10_score(float(company["growth_score"])),
        "ai_data": _to_percent_from_10_score(float(company["ai_data_score"])),
        "self_development": _to_percent_from_10_score(float(company["self_development_score"])),
        "prime_contractor": _to_percent_from_10_score(float(company["prime_contractor_score"])),
    }


def _calculate_weighted_satisfaction_score(
    feature_scores: dict[str, float],
    preference: UserPreferenceProfile,
) -> float:
    weighted_total = (
        feature_scores["salary"] * preference.salary_weight
        + feature_scores["work_life"] * preference.work_life_weight
        + feature_scores["holiday"] * preference.holiday_weight
        + feature_scores["remote"] * preference.remote_weight
        + feature_scores["stability"] * preference.stability_weight
        + feature_scores["growth"] * preference.growth_weight
        + feature_scores["ai_data"] * preference.ai_data_weight
        + feature_scores["self_development"] * preference.self_development_weight
        + feature_scores["prime_contractor"] * preference.prime_contractor_weight
    )
    weight_sum = (
        preference.salary_weight
        + preference.work_life_weight
        + preference.holiday_weight
        + preference.remote_weight
        + preference.stability_weight
        + preference.growth_weight
        + preference.ai_data_weight
        + preference.self_development_weight
        + preference.prime_contractor_weight
    )
    return round(weighted_total / weight_sum, 1)


def _calculate_cosine_similarity_score(
    feature_scores: dict[str, float],
    preference: UserPreferenceProfile,
) -> float:
    company_vector = [[
        feature_scores["salary"],
        feature_scores["work_life"],
        feature_scores["holiday"],
        feature_scores["remote"],
        feature_scores["stability"],
        feature_scores["growth"],
        feature_scores["ai_data"],
        feature_scores["self_development"],
        feature_scores["prime_contractor"],
    ]]
    preference_vector = [[
        preference.salary_weight * 20.0,
        preference.work_life_weight * 20.0,
        preference.holiday_weight * 20.0,
        preference.remote_weight * 20.0,
        preference.stability_weight * 20.0,
        preference.growth_weight * 20.0,
        preference.ai_data_weight * 20.0,
        preference.self_development_weight * 20.0,
        preference.prime_contractor_weight * 20.0,
    ]]
    similarity = float(cosine_similarity(company_vector, preference_vector)[0][0])
    return round(max(0.0, min(100.0, similarity * 100.0)), 1)


def _calculate_career_priority_score(
    feature_scores: dict[str, float],
    preference: UserPreferenceProfile,
) -> float:
    numerator = (
        feature_scores["ai_data"] * preference.ai_data_weight
        + feature_scores["self_development"] * preference.self_development_weight
        + feature_scores["growth"] * preference.growth_weight
        + feature_scores["prime_contractor"] * preference.prime_contractor_weight
    )
    denominator = (
        preference.ai_data_weight
        + preference.self_development_weight
        + preference.growth_weight
        + preference.prime_contractor_weight
    )
    return round(numerator / denominator, 1)


def _calculate_risk_penalty(feature_scores: dict[str, float], company: dict[str, object], preference: UserPreferenceProfile) -> float:
    assignment_uncertainty = _to_percent_from_10_score(float(company["assignment_uncertainty_score"]))
    information_risk = _to_percent_from_10_score(float(company["information_risk_score"]))
    overtime_risk = 100.0 - feature_scores["work_life"]

    raw_risk = assignment_uncertainty * 0.45 + information_risk * 0.35 + overtime_risk * 0.20
    # Lower tolerance means larger penalty. 1 -> 1.0, 5 -> 0.2
    risk_sensitivity = (6.0 - float(preference.risk_tolerance)) / 5.0
    penalty = raw_risk * risk_sensitivity * 0.18
    return round(max(0.0, min(30.0, penalty)), 1)


def _build_recommendation_reasons(company: dict[str, object]) -> list[str]:
    reasons: list[str] = []
    if float(company["ai_data_score"]) >= 8:
        reasons.append("AI・データ活用度が高い")
    if float(company["self_development_score"]) >= 8:
        reasons.append("自己成長環境が強い")
    if float(company["annual_holidays"]) >= 125:
        reasons.append("年間休日が多い")
    if float(company["remote_score"]) >= 8:
        reasons.append("リモート適性が高い")
    if float(company["stability_score"]) >= 8:
        reasons.append("事業の安定性が高い")
    if not reasons:
        reasons.append("複数の指標がバランス良くまとまっている")
    return reasons


def _build_concerns(company: dict[str, object]) -> list[str]:
    concerns: list[str] = []
    if float(company["overtime_hours"]) >= 24:
        concerns.append("月平均残業時間がやや多い")
    if float(company["assignment_uncertainty_score"]) >= 4:
        concerns.append("配属・案件不確実性がやや高い")
    if float(company["information_risk_score"]) >= 3:
        concerns.append("情報不足リスクがある")
    return concerns


def calculate_match_for_company(
    company: dict[str, object],
    dataset_ranges: dict[str, tuple[float, float]],
    preference: UserPreferenceProfile = DEFAULT_USER_PREFERENCE,
) -> dict[str, object]:
    feature_scores = _build_company_feature_scores(company, dataset_ranges)
    weighted_satisfaction_score = _calculate_weighted_satisfaction_score(feature_scores, preference)
    cosine_similarity_score = _calculate_cosine_similarity_score(feature_scores, preference)
    career_priority_score = _calculate_career_priority_score(feature_scores, preference)
    risk_penalty = _calculate_risk_penalty(feature_scores, company, preference)

    match_score = (
        0.5 * weighted_satisfaction_score
        + 0.3 * cosine_similarity_score
        + 0.2 * career_priority_score
        - risk_penalty
    )

    return {
        **company,
        "weighted_satisfaction_score": round(weighted_satisfaction_score, 1),
        "cosine_similarity_score": round(cosine_similarity_score, 1),
        "career_priority_score": round(career_priority_score, 1),
        "risk_penalty": round(risk_penalty, 1),
        "match_score": round(max(0.0, min(100.0, match_score)), 1),
        "recommendation_reasons": _build_recommendation_reasons(company),
        "concerns": _build_concerns(company),
    }


def get_matching_companies(preference: UserPreferenceProfile = DEFAULT_USER_PREFERENCE) -> list[dict[str, object]]:
    companies = get_companies()
    dataset_ranges = _normalize_dataset_metrics(companies)
    matched = [calculate_match_for_company(company, dataset_ranges, preference) for company in companies]
    return sorted(matched, key=lambda company: float(company["match_score"]), reverse=True)


def get_matching_company_by_id(company_id: int) -> dict[str, object] | None:
    company = get_company_by_id(company_id)
    if company is None:
        return None
    dataset_ranges = _normalize_dataset_metrics(get_companies())
    return calculate_match_for_company(company, dataset_ranges)
