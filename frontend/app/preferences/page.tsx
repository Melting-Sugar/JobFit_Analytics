export default function PreferencesPage() {
  const items = [
    "希望業界",
    "希望職種",
    "勤務地・働き方",
    "想定年収レンジ",
    "条件満足度の重視度",
    "キャリア適合度の重視度",
  ];

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">希望条件</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          ユーザーが重視する条件を設定し、相性スコア計算の基準を整えるためのプレースホルダーです。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">{item}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">MVP段階のため、入力UIは今後実装予定です。</p>
          </article>
        ))}
      </section>
    </main>
  );
}