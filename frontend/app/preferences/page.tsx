"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import {
  submitMatchingPreferences,
  type MatchedCompany,
  type MatchingPreferenceWeights,
} from "@/lib/api";

const preferenceFields: Array<{
  key: keyof MatchingPreferenceWeights;
  label: string;
}> = [
  { key: "salary_weight", label: "年収重視度" },
  { key: "work_life_weight", label: "ワークライフバランス重視度" },
  { key: "holiday_weight", label: "休日重視度" },
  { key: "remote_weight", label: "リモート勤務重視度" },
  { key: "stability_weight", label: "安定性重視度" },
  { key: "growth_weight", label: "成長性重視度" },
  { key: "ai_data_weight", label: "AI・データ活用重視度" },
  { key: "self_development_weight", label: "自己成長環境重視度" },
  { key: "prime_contractor_weight", label: "元請け・上流工程重視度" },
  { key: "risk_tolerance", label: "リスク許容度" },
];

const defaultPreferences: MatchingPreferenceWeights = {
  salary_weight: 4,
  work_life_weight: 5,
  holiday_weight: 5,
  remote_weight: 4,
  stability_weight: 4,
  growth_weight: 4,
  ai_data_weight: 5,
  self_development_weight: 5,
  prime_contractor_weight: 4,
  risk_tolerance: 2,
};

const options = [1, 2, 3, 4, 5];
const PREFERENCES_STORAGE_KEY = "jobfit-preferences";

function isBrowser() {
  return typeof window !== "undefined";
}

function isValidPreferenceValue(value: unknown): value is 1 | 2 | 3 | 4 | 5 {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

function isValidPreferenceObject(value: unknown): value is MatchingPreferenceWeights {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return preferenceFields.every((field) => isValidPreferenceValue((value as Record<string, unknown>)[field.key]));
}

function readStoredPreferences(): MatchingPreferenceWeights {
  if (!isBrowser()) {
    return defaultPreferences;
  }

  try {
    const rawValue = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!rawValue) {
      return defaultPreferences;
    }

    const parsedValue = JSON.parse(rawValue) as unknown;
    if (!isValidPreferenceObject(parsedValue)) {
      return defaultPreferences;
    }

    return parsedValue;
  } catch {
    return defaultPreferences;
  }
}

function saveStoredPreferences(preferences: MatchingPreferenceWeights) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<MatchingPreferenceWeights>(defaultPreferences);
  const [results, setResults] = useState<MatchedCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);

  useEffect(() => {
    setPreferences(readStoredPreferences());
    setHasLoadedPreferences(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedPreferences) {
      return;
    }

    saveStoredPreferences(preferences);
  }, [hasLoadedPreferences, preferences]);

  const updatePreference = (key: keyof MatchingPreferenceWeights, value: number) => {
    const nextValue = Number.isInteger(value) && value >= 1 && value <= 5 ? value : defaultPreferences[key];
    setPreferences((current) => ({ ...current, [key]: nextValue }));
  };

  const handleResetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const matchedCompanies = await submitMatchingPreferences(preferences);
      setResults(matchedCompanies.slice(0, 5));
    } catch {
      setErrorMessage("相性判定の取得に失敗しました。バックエンドが起動しているか確認してください。");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">希望条件</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          重視したい条件を設定して、相性の高い企業を確認できます。
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="space-y-4">
            {preferenceFields.map((field) => (
              <label key={field.key} className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-slate-950">{field.label}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700">
                    {preferences[field.key]}
                  </span>
                </div>
                <select
                  value={preferences[field.key]}
                  onChange={(event) => updatePreference(field.key, Number(event.target.value))}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? "判定中..." : "この条件で相性を確認"}
          </button>

          <button
            type="button"
            onClick={handleResetPreferences}
            className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            初期値に戻す
          </button>

          {errorMessage ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{errorMessage}</p>
          ) : null}
        </form>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">推薦結果</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                送信後、相性の高い企業を上位から表示します。
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              上位 {results.length || 5} 件
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {results.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-600">
                まだ判定結果はありません。左の条件を調整して、「この条件で相性を確認」を押してください。
              </p>
            ) : (
              results.map((company) => (
                <article key={company.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{company.industry}</p>
                      <h4 className="mt-2 text-lg font-semibold text-slate-950">{company.name}</h4>
                    </div>
                    <p className="text-3xl font-semibold text-slate-950">{company.match_score}</p>
                  </div>

                  <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">おすすめ理由</p>
                      <ul className="mt-2 space-y-2">
                        {company.recommendation_reasons.slice(0, 2).map((reason) => (
                          <li key={reason} className="rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-900">
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {company.concerns.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">懸念点</p>
                        <p className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-amber-900">
                          {company.concerns[0]}
                        </p>
                      </div>
                    ) : null}

                    <Link
                      href={`/companies/${company.id}`}
                      className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}