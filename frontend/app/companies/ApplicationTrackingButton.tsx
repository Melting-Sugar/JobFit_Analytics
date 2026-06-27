"use client";

import { useEffect, useState } from "react";

import { addApplication, isApplicationAdded, type ApplicationRecord } from "@/lib/applications";
import type { MatchedCompany } from "@/lib/api";

type ApplicationTrackingButtonProps = {
  company: MatchedCompany;
};

export default function ApplicationTrackingButton({ company }: ApplicationTrackingButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsAdded(isApplicationAdded(company.id));
  }, [company.id]);

  const handleAddApplication = () => {
    if (isAdded || isSaving) {
      return;
    }

    setIsSaving(true);
    const updatedApplications: ApplicationRecord[] = addApplication(company);
    setIsAdded(updatedApplications.some((application) => application.id === company.id));
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:items-end">
      <button
        type="button"
        onClick={handleAddApplication}
        className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={isAdded || isSaving}
      >
        {isAdded ? "応募管理に追加済み" : isSaving ? "保存中..." : "応募管理に追加"}
      </button>
      <p className="text-sm leading-6 text-slate-600">
        {isAdded ? "この企業は応募管理に保存されています。" : "クリックすると応募管理に保存されます。"}
      </p>
    </div>
  );
}