"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getLabAnalytics, type LabAnalytics } from "@/lib/api";

export default function LabPage() {
  const [analytics, setAnalytics] = useState<LabAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadAnalytics() {
      setIsLoading(true);
      setLoadError("");

      try {
        const result = await getLabAnalytics();
        if (isActive) {
          setAnalytics(result);
        }
      } catch {
        if (isActive) {
          setLoadError("分析データの取得に失敗しました。backend が起動しているか確認してください。");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">分析ラボ</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          企業タイプ分類、トレードオフ、条件別の見え方を、説明可能な形で確認できるページです。
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">スコア計算の説明</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p>{analytics?.score_explanation.summary ?? "企業データをもとに説明可能な重みづけでスコアを作っています。"}</p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900">
              {analytics?.score_explanation.formula ??
                "match_score = 0.5 * weighted_satisfaction_score + 0.3 * cosine_similarity_score + 0.2 * career_priority_score - risk_penalty"}
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
          <h3 className="text-xl font-semibold">指標の意味</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-100">
            {(analytics?.score_explanation.metrics ?? []).map((metric) => (
              <div key={metric.name} className="rounded-2xl bg-white/10 px-4 py-3">
                <p className="font-semibold">{metric.name}</p>
                <p className="mt-1 text-slate-200">{metric.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">企業タイプ分類</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              KMeans を使って、企業を説明しやすい 4 つのタイプにまとめています。
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {isLoading ? "読み込み中" : `${analytics?.cluster_analysis.companies.length ?? 0}件`}
          </span>
        </div>

        {loadError ? (
          <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">{loadError}</p>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {(analytics?.cluster_analysis.summaries ?? []).map((summary) => (
                <article key={summary.cluster_label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-lg font-semibold text-slate-950">{summary.cluster_label}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{summary.description}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-950">{summary.count}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">件</p>
                </article>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">企業名</th>
                      <th className="px-4 py-3 font-semibold">タイプ</th>
                      <th className="px-4 py-3 font-semibold">説明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {(analytics?.cluster_analysis.companies ?? []).map((company) => (
                      <tr key={company.id}>
                        <td className="px-4 py-4">
                          <Link href={`/companies/${company.id}`} className="font-semibold text-sky-700 hover:underline">
                            {company.name}
                          </Link>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">{company.cluster_label}</td>
                        <td className="px-4 py-4 text-slate-600">{company.cluster_description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {(analytics?.tradeoff_analysis ?? []).map((section) => (
          <article key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-slate-950">{section.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{section.explanation}</p>

            <div className="mt-4 space-y-3">
              {section.companies.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  該当企業はまだありません。
                </p>
              ) : (
                section.companies.map((company) => (
                  <div key={company.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{company.name}</p>
                        <p className="text-xs text-slate-500">
                          {company.industry} / {company.location}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{company.tradeoff_score}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{company.explanation}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">条件別おすすめ企業</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              いくつかの想定シナリオで、上位 3 社がどう変わるかを比較できます。
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {analytics?.sensitivity_analysis.length ?? 0} シナリオ
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {(analytics?.sensitivity_analysis ?? []).map((scenario) => (
            <article key={scenario.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-950">{scenario.name}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{scenario.description}</p>
                </div>
                <div className="text-xs text-slate-500">
                  {scenario.preferences ? "1〜5 の重みを使った仮想シナリオ" : ""}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">企業名</th>
                        <th className="px-4 py-3 font-semibold">相性スコア</th>
                        <th className="px-4 py-3 font-semibold">おすすめ理由</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {scenario.companies.map((company) => (
                        <tr key={company.id}>
                          <td className="px-4 py-4">
                            <Link href={`/companies/${company.id}`} className="font-semibold text-sky-700 hover:underline">
                              {company.name}
                            </Link>
                          </td>
                          <td className="px-4 py-4 font-semibold text-slate-950">{company.match_score}</td>
                          <td className="px-4 py-4 text-slate-600">{company.recommendation_reasons[0] ?? "複数条件のバランスが良いです。"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-slate-950">注記</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          これらは学習済み予測ではなく、ダミー企業データを使った説明可能な分析です。ポートフォリオ向けに、判断の見え方を整理することを優先しています。
        </p>
      </section>
    </main>
  );
}