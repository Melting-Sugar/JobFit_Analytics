import Link from "next/link";

const highlights = [
  {
    title: "企業相性の可視化",
    description: "企業データと希望条件を照合し、相性スコアを一覧で確認できます。",
  },
  {
    title: "応募状況の整理",
    description: "応募管理ページで選考ステータスを段階ごとに把握できます。",
  },
  {
    title: "分析設計のポートフォリオ",
    description: "スコア設計・データ活用・画面設計の一連の流れを示す試作です。",
  },
];

export default function HomePage() {
  return (
    <main className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-950 px-6 py-14 text-white shadow-soft sm:px-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            MVP プロトタイプ
          </span>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            企業比較から応募管理まで、就活の判断を一画面で。
          </h2>
          <p className="text-base leading-7 text-slate-300 sm:text-lg">
            複数企業の比較、相性指標の確認、応募状況の整理を一貫して行うための
            日本語ポートフォリオ用プロトタイプです。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/companies"
              className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              企業一覧を見る
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              ダッシュボードを見る
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">このアプリで確認できること</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "相性スコアの設計方針",
              "条件満足度・キャリア適合度の評価軸",
              "応募管理を含む画面設計",
              "将来のデータ永続化を見据えた構成",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}