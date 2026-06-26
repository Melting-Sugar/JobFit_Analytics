import type { Company, MatchedCompany } from "@/lib/api";

export const APPLICATION_STATUSES = [
  "未応募",
  "ES提出済み",
  "適性検査",
  "一次面接",
  "二次面接",
  "最終面接",
  "内定",
  "見送り・辞退",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ApplicationRecord = Company &
  Partial<Pick<MatchedCompany, "weighted_satisfaction_score" | "cosine_similarity_score" | "career_priority_score" | "risk_penalty" | "match_score" | "recommendation_reasons" | "concerns">> & {
  status: ApplicationStatus;
  addedAt: string;
};

const STORAGE_KEY = "jobfit-applications";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStorage(): ApplicationRecord[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as ApplicationRecord[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeStorage(applications: ApplicationRecord[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export function getApplications(): ApplicationRecord[] {
  return readStorage();
}

export function addApplication(company: Company | MatchedCompany): ApplicationRecord[] {
  const currentApplications = readStorage();
  const newApplication: ApplicationRecord = {
    ...company,
    status: "未応募",
    addedAt: new Date().toISOString(),
  };
  const nextApplications = currentApplications.some((application) => application.id === company.id)
    ? currentApplications
    : [...currentApplications, newApplication];

  writeStorage(nextApplications);
  return nextApplications;
}

export function updateApplicationStatus(companyId: number, status: ApplicationStatus): ApplicationRecord[] {
  const currentApplications = readStorage();
  const nextApplications = currentApplications.map((application) =>
    application.id === companyId ? { ...application, status } : application,
  );

  writeStorage(nextApplications);
  return nextApplications;
}

export function removeApplication(companyId: number): ApplicationRecord[] {
  const nextApplications = readStorage().filter((application) => application.id !== companyId);
  writeStorage(nextApplications);
  return nextApplications;
}

export function isApplicationAdded(companyId: number): boolean {
  return readStorage().some((application) => application.id === companyId);
}