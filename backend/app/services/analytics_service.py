from __future__ import annotations

from collections import Counter
from math import floor

try:
    from sklearn.cluster import KMeans
except Exception:  # pragma: no cover - fallback for environments without sklearn.cluster
    KMeans = None

from app.services.company_service import get_companies
from app.services.matching_service import (
    DEFAULT_USER_PREFERENCE,
    UserPreferenceProfile,
    build_user_preference_profile,
    calculate_match_for_company,
)


CLUSTER_LABELS = [
    "高年収・高成長型",
    "ワークライフバランス型",
    "安定・低リスク型",
    "AI・成長重視型",
]

CLUSTER_DESCRIPTIONS = {
    "高年収・高成長型": "年収と成長機会を両方重視する企業群です。",
    "ワークライフバランス型": "残業が少なく、休日やリモートが取りやすい企業群です。",
    "安定・低リスク型": "案件や配属の不確実性が低く、安定感がある企業群です。",
    "AI・成長重視型": "AI・データ活用や自己成長機会が強い企業群です。",
}

SCENARIOS: list[tuple[str, str, UserPreferenceProfile]] = [
    (
        "ワークライフバランス重視",
        "残業と休日を優先し、働きやすさを重視するシナリオです。",
        build_user_preference_profile(
            {
                "salary_weight": 3,
                "work_life_weight": 5,
                "holiday_weight": 5,
                "remote_weight": 5,
                "stability_weight": 4,
                "growth_weight": 3,
                "ai_data_weight": 3,
                "self_development_weight": 3,
                "prime_contractor_weight": 2,
                "risk_tolerance": 4,
            }
        ),
    ),
    (
        "年収重視",
        "年収を最優先にしながら、基本条件も一定程度見るシナリオです。",
        build_user_preference_profile(
            {
                "salary_weight": 5,
                "work_life_weight": 3,
                "holiday_weight": 3,
                "remote_weight": 2,
                "stability_weight": 3,
                "growth_weight": 3,
                "ai_data_weight": 3,
                "self_development_weight": 2,
                "prime_contractor_weight": 2,
                "risk_tolerance": 2,
            }
        ),
    ),
    (
        "AI・データキャリア重視",
        "AI・データ活用と学習機会を優先するシナリオです。",
        build_user_preference_profile(
            {
                "salary_weight": 3,
                "work_life_weight": 3,
                "holiday_weight": 3,
                "remote_weight": 3,
                "stability_weight": 3,
                "growth_weight": 5,
                "ai_data_weight": 5,
                "self_development_weight": 5,
                "prime_contractor_weight": 4,
                "risk_tolerance": 3,
            }
        ),
    ),
    (
        "安定性重視",
        "安定性やリスクの低さを重視するシナリオです。",
        build_user_preference_profile(
            {
                "salary_weight": 3,
                "work_life_weight": 4,
                "holiday_weight": 4,
                "remote_weight": 3,
                "stability_weight": 5,
                "growth_weight": 2,
                "ai_data_weight": 2,
                "self_development_weight": 2,
                "prime_contractor_weight": 3,
                "risk_tolerance": 1,
            }
        ),
    ),
    (
        "成長性重視",
        "成長性、学習機会、AI・データ活用を強めに見るシナリオです。",
        build_user_preference_profile(
            {
                "salary_weight": 3,
                "work_life_weight": 3,
                "holiday_weight": 3,
                "remote_weight": 3,
                "stability_weight": 3,
                "growth_weight": 5,
                "ai_data_weight": 4,
                "self_development_weight": 5,
                "prime_contractor_weight": 4,
                "risk_tolerance": 3,
            }
        ),
    ),
]


def _normalize_value(value: float, min_value: float, max_value: float) -> float:
    if max_value <= min_value:
        return 50.0
    return (value - min_value) / (max_value - min_value) * 100.0


def _quantile(values: list[float], ratio: float) -> float:
    if not values:
        return 0.0

    sorted_values = sorted(values)
    index = min(len(sorted_values) - 1, max(0, floor((len(sorted_values) - 1) * ratio)))
    return sorted_values[index]


def _build_ranges(companies: list[dict[str, object]]) -> dict[str, tuple[float, float]]:
    return {
        "average_salary": (
            min(float(company["average_salary"]) for company in companies),
            max(float(company["average_salary"]) for company in companies),
        ),
        "overtime_hours": (
            min(float(company["overtime_hours"]) for company in companies),
            max(float(company["overtime_hours"]) for company in companies),
        ),
        "annual_holidays": (
            min(float(company["annual_holidays"]) for company in companies),
            max(float(company["annual_holidays"]) for company in companies),
        ),
        "remote_score": (
            min(float(company["remote_score"]) for company in companies),
            max(float(company["remote_score"]) for company in companies),
        ),
        "stability_score": (
            min(float(company["stability_score"]) for company in companies),
            max(float(company["stability_score"]) for company in companies),
        ),
        "growth_score": (
            min(float(company["growth_score"]) for company in companies),
            max(float(company["growth_score"]) for company in companies),
        ),
        "ai_data_score": (
            min(float(company["ai_data_score"]) for company in companies),
            max(float(company["ai_data_score"]) for company in companies),
        ),
        "self_development_score": (
            min(float(company["self_development_score"]) for company in companies),
            max(float(company["self_development_score"]) for company in companies),
        ),
        "prime_contractor_score": (
            min(float(company["prime_contractor_score"]) for company in companies),
            max(float(company["prime_contractor_score"]) for company in companies),
        ),
        "assignment_uncertainty_score": (
            min(float(company["assignment_uncertainty_score"]) for company in companies),
            max(float(company["assignment_uncertainty_score"]) for company in companies),
        ),
        "information_risk_score": (
            min(float(company["information_risk_score"]) for company in companies),
            max(float(company["information_risk_score"]) for company in companies),
        ),
    }


def _build_matching_ranges(companies: list[dict[str, object]]) -> dict[str, tuple[float, float]]:
    return {
        "salary": (
            min(float(company["average_salary"]) for company in companies),
            max(float(company["average_salary"]) for company in companies),
        ),
        "overtime": (
            min(float(company["overtime_hours"]) for company in companies),
            max(float(company["overtime_hours"]) for company in companies),
        ),
        "holiday": (
            min(float(company["annual_holidays"]) for company in companies),
            max(float(company["annual_holidays"]) for company in companies),
        ),
    }


def _build_cluster_features(
    company: dict[str, object],
    ranges: dict[str, tuple[float, float]],
) -> list[float]:
    return [
        _normalize_value(float(company["average_salary"]), *ranges["average_salary"]),
        100.0 - _normalize_value(float(company["overtime_hours"]), *ranges["overtime_hours"]),
        _normalize_value(float(company["annual_holidays"]), *ranges["annual_holidays"]),
        float(company["remote_score"]) * 10.0,
        float(company["stability_score"]) * 10.0,
        float(company["growth_score"]) * 10.0,
        float(company["ai_data_score"]) * 10.0,
        float(company["self_development_score"]) * 10.0,
        float(company["prime_contractor_score"]) * 10.0,
        100.0 - _normalize_value(float(company["assignment_uncertainty_score"]), *ranges["assignment_uncertainty_score"]),
        100.0 - _normalize_value(float(company["information_risk_score"]), *ranges["information_risk_score"]),
    ]


def _profile_cluster_center(center: list[float]) -> dict[str, float]:
    return {
        "salary_growth": center[0] * 0.45 + center[5] * 0.2 + center[6] * 0.2 + center[7] * 0.1 + center[8] * 0.05,
        "work_life": center[1] * 0.45 + center[2] * 0.35 + center[3] * 0.2,
        "stability": center[4] * 0.35 + center[9] * 0.35 + center[10] * 0.3,
        "ai_growth": center[6] * 0.35 + center[7] * 0.25 + center[5] * 0.2 + center[3] * 0.2,
    }


def _assign_cluster_labels(centers: list[list[float]]) -> dict[int, str]:
    cluster_profiles = {
        index: _profile_cluster_center(list(center))
        for index, center in enumerate(centers)
    }

    label_priority = [
        ("高年収・高成長型", "salary_growth"),
        ("ワークライフバランス型", "work_life"),
        ("安定・低リスク型", "stability"),
        ("AI・成長重視型", "ai_growth"),
    ]

    remaining_clusters = set(cluster_profiles)
    assignments: dict[int, str] = {}

    for label, metric_key in label_priority:
        if not remaining_clusters:
            break

        selected_cluster = max(remaining_clusters, key=lambda cluster_index: cluster_profiles[cluster_index][metric_key])
        assignments[selected_cluster] = label
        remaining_clusters.remove(selected_cluster)

    for cluster_index in remaining_clusters:
        assignments[cluster_index] = "AI・成長重視型"

    return assignments


def _cluster_companies(companies: list[dict[str, object]]) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    if not companies:
        return [], []

    ranges = _build_ranges(companies)
    feature_matrix = [_build_cluster_features(company, ranges) for company in companies]

    if KMeans is None or len(companies) < 4:
        labels = [0 for _ in companies]
        cluster_names = {0: "AI・成長重視型"}
        centers = []
    else:
        model = KMeans(n_clusters=min(4, len(companies)), random_state=42, n_init=10)
        labels = model.fit_predict(feature_matrix).tolist()
        cluster_names = _assign_cluster_labels(model.cluster_centers_.tolist())
        centers = model.cluster_centers_.tolist()

    if not centers:
        # Simple fallback that still yields explainable buckets.
        cluster_names = {0: "AI・成長重視型"}

    clustered_companies = []
    for company, cluster_id in zip(companies, labels):
        cluster_label = cluster_names.get(cluster_id, "AI・成長重視型")
        clustered_companies.append(
            {
                "id": company["id"],
                "name": company["name"],
                "industry": company["industry"],
                "location": company["location"],
                "cluster_id": int(cluster_id),
                "cluster_label": cluster_label,
                "cluster_description": CLUSTER_DESCRIPTIONS[cluster_label],
            }
        )

    cluster_counts = Counter(item["cluster_label"] for item in clustered_companies)
    cluster_summaries = [
        {
            "cluster_label": label,
            "count": cluster_counts.get(label, 0),
            "description": CLUSTER_DESCRIPTIONS[label],
        }
        for label in CLUSTER_LABELS
    ]

    return cluster_summaries, clustered_companies


def _tradeoff_entry(company: dict[str, object], explanation: str, score: float) -> dict[str, object]:
    return {
        "id": company["id"],
        "name": company["name"],
        "industry": company["industry"],
        "location": company["location"],
        "average_salary": company["average_salary"],
        "overtime_hours": company["overtime_hours"],
        "annual_holidays": company["annual_holidays"],
        "ai_data_score": company["ai_data_score"],
        "growth_score": company["growth_score"],
        "assignment_uncertainty_score": company["assignment_uncertainty_score"],
        "information_risk_score": company["information_risk_score"],
        "tradeoff_score": round(score, 1),
        "explanation": explanation,
    }


def _build_tradeoff_analysis(companies: list[dict[str, object]]) -> list[dict[str, object]]:
    if not companies:
        return []

    ranges = _build_ranges(companies)

    salary_values = [float(company["average_salary"]) for company in companies]
    overtime_values = [float(company["overtime_hours"]) for company in companies]
    holiday_values = [float(company["annual_holidays"]) for company in companies]
    growth_values = [float(company["growth_score"]) for company in companies]
    ai_values = [float(company["ai_data_score"]) for company in companies]
    uncertainty_values = [float(company["assignment_uncertainty_score"]) for company in companies]
    risk_values = [float(company["information_risk_score"]) for company in companies]

    salary_high = _quantile(salary_values, 0.75)
    salary_low = _quantile(salary_values, 0.25)
    overtime_high = _quantile(overtime_values, 0.75)
    overtime_low = _quantile(overtime_values, 0.25)
    holidays_high = _quantile(holiday_values, 0.75)
    growth_high = _quantile(growth_values, 0.75)
    ai_high = _quantile(ai_values, 0.75)
    uncertainty_high = _quantile(uncertainty_values, 0.75)
    risk_high = _quantile(risk_values, 0.75)

    def salary_overtime_score(company: dict[str, object]) -> float:
        return _normalize_value(float(company["average_salary"]), *ranges["average_salary"]) + _normalize_value(
            float(company["overtime_hours"]), *ranges["overtime_hours"]
        )

    def growth_uncertainty_score(company: dict[str, object]) -> float:
        return _normalize_value(float(company["growth_score"]), *ranges["growth_score"]) + _normalize_value(
            float(company["assignment_uncertainty_score"]), *ranges["assignment_uncertainty_score"]
        ) + _normalize_value(float(company["information_risk_score"]), *ranges["information_risk_score"])

    def worklife_salary_tradeoff_score(company: dict[str, object]) -> float:
        worklife = _normalize_value(float(company["annual_holidays"]), *ranges["annual_holidays"]) + (
            100.0 - _normalize_value(float(company["overtime_hours"]), *ranges["overtime_hours"])
        )
        salary_inverse = 100.0 - _normalize_value(float(company["average_salary"]), *ranges["average_salary"])
        return worklife + salary_inverse

    def ai_risk_score(company: dict[str, object]) -> float:
        return _normalize_value(float(company["ai_data_score"]), *ranges["ai_data_score"]) + _normalize_value(
            float(company["information_risk_score"]), *ranges["information_risk_score"]
        )

    entries = [
        {
            "title": "高年収だが残業も多め",
            "explanation": "年収の魅力が強い一方、働き方とのバランスを見極めたい企業群です。",
            "companies": [
                _tradeoff_entry(company, "年収の高さと残業時間の長さにトレードオフがあります。", salary_overtime_score(company))
                for company in sorted(companies, key=salary_overtime_score, reverse=True)
                if float(company["average_salary"]) >= salary_high and float(company["overtime_hours"]) >= overtime_high
            ][:3],
        },
        {
            "title": "成長性は高いが不確実性もある",
            "explanation": "成長機会は大きいものの、配属や情報開示の不確実性を見ておきたい企業群です。",
            "companies": [
                _tradeoff_entry(
                    company,
                    "成長性の高さと不確実性の高さが同時に見られます。",
                    growth_uncertainty_score(company),
                )
                for company in sorted(companies, key=growth_uncertainty_score, reverse=True)
                if float(company["growth_score"]) >= growth_high
                and (
                    float(company["assignment_uncertainty_score"]) >= uncertainty_high
                    or float(company["information_risk_score"]) >= risk_high
                )
            ][:3],
        },
        {
            "title": "ワークライフ重視だが年収は控えめ",
            "explanation": "働きやすさは高い一方、年収とのバランスを比較したい企業群です。",
            "companies": [
                _tradeoff_entry(company, "働きやすさの代わりに年収は控えめになりやすいです。", worklife_salary_tradeoff_score(company))
                for company in sorted(companies, key=worklife_salary_tradeoff_score, reverse=True)
                if float(company["annual_holidays"]) >= holidays_high and float(company["average_salary"]) <= salary_low
            ][:3],
        },
        {
            "title": "AI活用は強いが情報リスクもある",
            "explanation": "AI・データ活用が強い企業の中で、情報開示の少なさも併せて確認したい企業群です。",
            "companies": [
                _tradeoff_entry(company, "AI・データ活用の強さと情報リスクをあわせて見る必要があります。", ai_risk_score(company))
                for company in sorted(companies, key=ai_risk_score, reverse=True)
                if float(company["ai_data_score"]) >= ai_high and float(company["information_risk_score"]) >= risk_high
            ][:3],
        },
    ]

    return entries


def _build_sensitivity_analysis(companies: list[dict[str, object]]) -> list[dict[str, object]]:
    if not companies:
        return []

    ranges = _build_matching_ranges(companies)
    scenarios = []

    for scenario_name, description, preference in SCENARIOS:
        scored_companies = [calculate_match_for_company(company, ranges, preference) for company in companies]
        top_companies = sorted(scored_companies, key=lambda company: float(company["match_score"]), reverse=True)[:3]
        scenarios.append(
            {
                "name": scenario_name,
                "description": description,
                "preferences": preference.__dict__,
                "companies": [
                    {
                        "id": company["id"],
                        "name": company["name"],
                        "industry": company["industry"],
                        "location": company["location"],
                        "match_score": company["match_score"],
                        "recommendation_reasons": company["recommendation_reasons"],
                        "concerns": company["concerns"],
                    }
                    for company in top_companies
                ],
            }
        )

    return scenarios


def get_lab_analytics() -> dict[str, object]:
    companies = get_companies()
    cluster_summaries, clustered_companies = _cluster_companies(companies)

    return {
        "cluster_analysis": {
            "summaries": cluster_summaries,
            "companies": clustered_companies,
        },
        "tradeoff_analysis": _build_tradeoff_analysis(companies),
        "sensitivity_analysis": _build_sensitivity_analysis(companies),
        "score_explanation": {
            "summary": "スコアはダミー企業データを使った説明可能な重みづけです。学習済み予測モデルではありません。",
            "formula": "match_score = 0.5 * weighted_satisfaction_score + 0.3 * cosine_similarity_score + 0.2 * career_priority_score - risk_penalty",
            "metrics": [
                {"name": "weighted_satisfaction_score", "description": "条件重視度に基づく満足度の加重平均です。"},
                {"name": "cosine_similarity_score", "description": "企業特徴と希望の向きの近さを表します。"},
                {"name": "career_priority_score", "description": "成長やAI・データ活用の優先度を反映します。"},
                {"name": "risk_penalty", "description": "配属不確実性や情報リスクなどの減点です。"},
            ],
        },
    }