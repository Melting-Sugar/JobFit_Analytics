"use client";

import { useEffect, useMemo, useState } from "react";

import { getApplications, removeApplication, updateApplicationStatus, type ApplicationRecord, type ApplicationStatus, APPLICATION_STATUSES } from "@/lib/applications";

function getStatusLabel(status: ApplicationStatus) {
  return status;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  useEffect(() => {
    setApplications(getApplications());
  }, []);

  const groupedApplications = useMemo(
    () =>
      APPLICATION_STATUSES.map((status) => ({
        status,
        items: applications.filter((application) => application.status === status),
      })),
    [applications],
  );

  const handleStatusChange = (companyId: number, status: ApplicationStatus) => {
    setApplications(updateApplicationStatus(companyId, status));
  };

  const handleRemove = (companyId: number) => {
    setApplications(removeApplication(companyId));
  };

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-950">応募管理</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          応募した企業を一覧で管理し、選考ステータスをその場で更新できます。
        </p>
      </section>

      {applications.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">まだ応募管理に企業がありません</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            企業詳細ページから「応募管理に追加」を押すと、ここに一覧が表示されます。
          </p>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {groupedApplications.map(({ status, items }) => (
            <article key={status} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-950">{getStatusLabel(status)}</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{items.length}件</span>
              </div>

              <div className="mt-4 space-y-3">
                {items.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm leading-6 text-slate-500">
                    このステータスの企業はまだありません。
                  </p>
                ) : (
                  items.map((application) => (
                    <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-base font-semibold text-slate-950">{application.name}</h4>
                            <p className="mt-1 text-sm text-slate-600">
                              {application.industry} / {application.job_type}
                            </p>
                          </div>
                          <p className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
                            {typeof application.match_score === "number" ? `相性 ${application.match_score}` : "相性 --"}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                          <label className="text-sm font-semibold text-slate-700">
                            ステータス
                            <select
                              value={application.status}
                              onChange={(event) => handleStatusChange(application.id, event.target.value as ApplicationStatus)}
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                            >
                              {APPLICATION_STATUSES.map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                  {statusOption}
                                </option>
                              ))}
                            </select>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemove(application.id)}
                            className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}