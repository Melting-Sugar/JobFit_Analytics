"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  APPLICATION_STATUSES,
  getApplications,
  type ApplicationRecord,
  type ApplicationStatus,
} from "@/lib/applications";
import { getMatchedCompanies, type MatchedCompany } from "@/lib/api";

const EARLY_STAGE_STATUSES: ApplicationStatus[] = ["未応募", "ES提出済み", "適性検査"];

function countByStatus(applications: ApplicationRecord[], status: ApplicationStatus) {
  return applications.filter((application) => application.status === status).length;
}

function formatAverageMatchScore(applications: ApplicationRecord[]) {
  const scoredApplications = applications.filter((application) => typeof application.match_score === "number");

  if (scoredApplications.length === 0) {
    return "--";
  }

  const totalScore = scoredApplications.reduce((sum, application) => sum + (application.match_score ?? 0), 0);
  return (totalScore / scoredApplications.length).toFixed(1);
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [recommendedCompanies, setRecommendedCompanies] = useState<MatchedCompany[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  useEffect(() => {
    setApplications(getApplications());

    let isActive = true;

    async function loadRecommendations() {
      setIsLoadingRecommendations(true);
      setLoadError("");

      try {
        const matchedCompanies = await getMatchedCompanies();
        if (isActive) {
          setRecommendedCompanies(matchedCompanies.slice(0, 5));
        }
      } catch {
        if (isActive) {
          setLoadError("おすすめ企業の取得に失敗しました。backend が起動しているか確認してください。");
        }
      } finally {
        if (isActive) {
          setIsLoadingRecommendations(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      isActive = false;
    };
  }, []);

  const applicationCount = applications.length;
  const offerCount = countByStatus(applications, "内定");
  const interviewCount = ["一次面接", "二次面接", "最終面接"].reduce(
    (sum, status) => sum + countByStatus(applications, status as ApplicationStatus),
    0,
  );
  const averageMatchScore = formatAverageMatchScore(applications);

  const statusDistribution = useMemo(
    () =>
      APPLICATION_STATUSES.map((status) => ({
        status,
        count: countByStatus(applications, status),
      })),
    [applications],
  );

  const earlyStageCount = EARLY_STAGE_STATUSES.reduce((sum, status) => sum + countByStatus(applications, status), 0);
  const earlyStageRatio = applicationCount > 0 ? earlyStageCount / applicationCount : 0;
  const averageMatchScoreValue = averageMatchScore === "--" ? null : Number(averageMatchScore);

  const insights = [
    applicationCount === 0
      ? "応募管理がまだありません。企業一覧から気になる企業を追加すると、ここで全体像を確認できます。"
      : null,
    averageMatchScoreValue !== null && averageMatchScoreValue >= 80
      ? "相性の高い企業が多く、前向きに進めやすい状態です。"
      : null,
    applicationCount > 0 && earlyStageRatio >= 0.5
      ? "応募は初期ステージが中心です。次の選考に進める企業を優先して整理すると見やすくなります。"
      : null,
  ].filter(Boolean) as string[];

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">ダッシュボード</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          応募状況とおすすめ企業をまとめて確認できる、就活の進捗用ダッシュボードです。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "応募管理中の企業数", value: applicationCount },
          { label: "内定数", value: offerCount },
          { label: "面接中の企業数", value: interviewCount },
          { label: "平均相性スコア", value: averageMatchScore },
        ].map((metric) => (
          <article key={metric.label} className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{metric.label}</p>
            <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">応募ステータス分布</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">ステータスごとの件数を簡単に確認できます。</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {applicationCount}件
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {statusDistribution.map((item) => {
              const percentage = applicationCount > 0 ? (item.count / applicationCount) * 100 : 0;

              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-slate-700">{item.status}</span>
                    <span className="text-slate-500">{item.count}件</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-sky-500"
                      style={{ width: `${Math.max(percentage, item.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">ひとことインサイト</h3>
          <div className="mt-4 space-y-3">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <p key={insight} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {insight}
                </p>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                応募とおすすめ企業の両方が揃っています。次のアクションを整理しやすい状態です。
              </p>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {loadError
              ? loadError
              : isLoadingRecommendations
                ? "おすすめ企業を読み込み中です。"
                : "おすすめ企業と応募状況をあわせて確認できます。"}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">トップおすすめ企業</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">match_score の高い企業を上位5件表示します。</p>
          </div>
          <Link
            href="/companies"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            企業一覧へ
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {recommendedCompanies.map((company) => (
            <article key={company.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{company.industry}</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950">{company.name}</h4>
                </div>
                <p className="text-3xl font-semibold text-slate-950">{company.match_score}</p>
              </div>

              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
                {company.recommendation_reasons[0] ?? "複数の条件がバランスよく合っています。"}
              </p>

              <Link
                href={`/companies/${company.id}`}
                className="mt-4 inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
              >
                詳細を見る
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}