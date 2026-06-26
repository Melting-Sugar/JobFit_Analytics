export default function LabPage() {
  const experiments = [
    "相性スコア算出ロジックの検証",
    "企業比較ビューの分析案",
    "条件満足度とキャリア適合度の重み検証",
    "配属・案件不確実性と情報開示の少なさの評価方針",
  ];

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">分析ラボ</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          スコア計算や企業比較の分析結果を確認するためのプレースホルダーです。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {experiments.map((item) => (
          <article key={item} className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}