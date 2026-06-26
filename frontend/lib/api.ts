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
  ses_risk_score: number;
  information_risk_score: number;
  description: string;
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

export function getCompanies(): Promise<Company[]> {
  return fetchJson<Company[]>("/companies");
}

export function getCompanyById(id: number): Promise<Company> {
  return fetchJson<Company>(`/companies/${id}`);
}