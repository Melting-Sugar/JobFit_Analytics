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