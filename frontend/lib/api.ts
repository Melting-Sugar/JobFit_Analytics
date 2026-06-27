export type Company = {
  id: number;
  name: string;
  industry: string;
  job_type: string;
  location: string;
  overtime_hours: number;
  annual_holidays: number;
  average_salary: number;
  remote_score: number;
  stability_score: number;
  growth_score: number;
  ai_data_score: number;
  self_development_score: number;
  prime_contractor_score: number;
  assignment_uncertainty_score: number;
  information_risk_score: number;
  description: string;
};

export type MatchedCompany = Company & {
  weighted_satisfaction_score: number;
  cosine_similarity_score: number;
  career_priority_score: number;
  risk_penalty: number;
  match_score: number;
  recommendation_reasons: string[];
  concerns: string[];
};

export type MatchingPreferenceWeights = {
  salary_weight: number;
  work_life_weight: number;
  holiday_weight: number;
  remote_weight: number;
  stability_weight: number;
  growth_weight: number;
  ai_data_weight: number;
  self_development_weight: number;
  prime_contractor_weight: number;
  risk_tolerance: number;
};

export type LabClusterItem = {
  id: number;
  name: string;
  industry: string;
  location: string;
  cluster_id: number;
  cluster_label: string;
  cluster_description: string;
};

export type LabClusterSummary = {
  cluster_label: string;
  count: number;
  description: string;
};

export type LabTradeoffCompany = {
  id: number;
  name: string;
  industry: string;
  location: string;
  average_salary: number;
  overtime_hours: number;
  annual_holidays: number;
  ai_data_score: number;
  growth_score: number;
  assignment_uncertainty_score: number;
  information_risk_score: number;
  tradeoff_score: number;
  explanation: string;
};

export type LabTradeoffSection = {
  title: string;
  explanation: string;
  companies: LabTradeoffCompany[];
};

export type LabSensitivityCompany = {
  id: number;
  name: string;
  industry: string;
  location: string;
  match_score: number;
  recommendation_reasons: string[];
  concerns: string[];
};

export type LabSensitivityScenario = {
  name: string;
  description: string;
  preferences: MatchingPreferenceWeights;
  companies: LabSensitivityCompany[];
};

export type LabAnalytics = {
  cluster_analysis: {
    summaries: LabClusterSummary[];
    companies: LabClusterItem[];
  };
  tradeoff_analysis: LabTradeoffSection[];
  sensitivity_analysis: LabSensitivityScenario[];
  score_explanation: {
    summary: string;
    formula: string;
    metrics: Array<{ name: string; description: string }>;
  };
};

//const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getCompanies(): Promise<Company[]> {
  return fetchJson<Company[]>("/companies");
}

export function getCompanyById(id: number): Promise<Company> {
  return fetchJson<Company>(`/companies/${id}`);
}

export function getMatchedCompanies(): Promise<MatchedCompany[]> {
  return fetchJson<MatchedCompany[]>("/matching/companies");
}

export function getMatchedCompanyById(id: number): Promise<MatchedCompany> {
  return fetchJson<MatchedCompany>(`/matching/companies/${id}`);
}

export function submitMatchingPreferences(
  preference: MatchingPreferenceWeights,
): Promise<MatchedCompany[]> {
  return postJson<MatchedCompany[]>("/matching/companies", preference);
}

export function getLabAnalytics(): Promise<LabAnalytics> {
  return fetchJson<LabAnalytics>("/analytics/lab");
}