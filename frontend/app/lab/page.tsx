"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getMatchedCompanies, type MatchedCompany } from "@/lib/api";

const metricExplanations = [
  {
    title: "条件満足度",
    description: "年収・残業・休日・働き方・安定性など、基本条件の満足度をまとめた指標です。",
  },
  {
    title: "希望との近さ",
    description: "企業の特徴ベクトルと希望条件の近さをもとに算出する、相性の方向性を示す指標です。",
  },
  {
    title: "キャリア適合度",
    description: "成長性、AI・データ活用、自己成長環境、元請け・上流工程などを重視した指標です。",
  },
  {
    title: "リスク減点",
    description: "配属・案件不確実性、情報開示の少なさ、残業などの要素を踏まえた減点です。",
  },
];

export default function LabPage() {
  const [companies, setCompanies] = useState<MatchedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadCompanies() {
      setIsLoading(true);
      setLoadError("");

      try {
        const matchedCompanies = await getMatchedCompanies();
        if (isActive) {
          setCompanies(matchedCompanies.slice(0, 5));
        }
      } catch {
        if (isActive) {
          setLoadError("分析対象の取得に失敗しました。backend が起動しているか確認してください。");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCompanies();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">分析ラボ</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          マッチングスコアがどのように計算されているかを、シンプルに確認するためのページです。
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">スコアの考え方</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p>・企業特徴を数値ベクトルとして扱います。</p>
            <p>・年収、残業、休日などの指標を $0〜100$ に正規化します。</p>
            <p>・条件満足度、希望との近さ、キャリア適合度、リスク減点を個別に計算します。</p>
            <p>・それらを組み合わせて、最終的な総合相性スコアを算出します。</p>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
          <h3 className="text-xl font-semibold">スコア式</h3>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-100">
            <p className="rounded-2xl bg-white/10 px-4 py-3 font-semibold">総合相性スコア =</p>
            <p className="rounded-2xl bg-white/10 px-4 py-3">0.5 × 条件満足度</p>
            <p className="rounded-2xl bg-white/10 px-4 py-3">+ 0.3 × 希望との近さ</p>
            <p className="rounded-2xl bg-white/10 px-4 py-3">+ 0.2 × キャリア適合度</p>
            <p className="rounded-2xl bg-white/10 px-4 py-3">- リスク減点</p>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">上位企業の比較</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              GET /matching/companies の結果から、総合相性スコア上位5件を表示しています。
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {isLoading ? "読み込み中" : `${companies.length}件`}
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">企業名</th>
                  <th className="px-4 py-3 font-semibold">総合相性スコア</th>
                  <th className="px-4 py-3 font-semibold">条件満足度</th>
                  <th className="px-4 py-3 font-semibold">希望との近さ</th>
                  <th className="px-4 py-3 font-semibold">キャリア適合度</th>
                  <th className="px-4 py-3 font-semibold">リスク減点</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loadError ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-amber-700" colSpan={6}>
                      {loadError}
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-slate-600" colSpan={6}>
                      まだ比較対象がありません。
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id} className="align-top">
                      <td className="px-4 py-4">
                        <Link href={`/companies/${company.id}`} className="font-semibold text-sky-700 hover:underline">
                          {company.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-lg font-semibold text-slate-950">{company.match_score}</td>
                      <td className="px-4 py-4">{company.weighted_satisfaction_score}</td>
                      <td className="px-4 py-4">{company.cosine_similarity_score}</td>
                      <td className="px-4 py-4">{company.career_priority_score}</td>
                      <td className="px-4 py-4">{company.risk_penalty}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricExplanations.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
            <h4 className="text-lg font-semibold text-slate-950">{item.title}</h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-slate-950">注記</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          現在のスコアは仮の重みとダミーデータにもとづくプロトタイプです。将来的には実データやユーザーの選考結果・満足度データを用いて改善できます。
        </p>
      </section>
    </main>
  );
}