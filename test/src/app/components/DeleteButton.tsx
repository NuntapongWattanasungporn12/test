"use client";

import { useState, useTransition } from "react";

import type { FormState } from "@/src/app/actions";

type Props = {
  action: () => Promise<FormState>;
  confirmText: string;
  label?: string;
};

export function DeleteButton({ action, confirmText, label = "ลบ" }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="deleteWrap">
      <button
        type="button"
        className="btn danger"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          setError(null);
          startTransition(async () => {
            const result = await action();
            if (result?.error) setError(result.error);
          });
        }}
      >
        {pending ? "กำลังลบ..." : label}
      </button>
      {error && <span className="inlineError">{error}</span>}
    </span>
  );
}
