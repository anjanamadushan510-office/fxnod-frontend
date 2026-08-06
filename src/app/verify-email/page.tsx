"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import { useVerifyEmail } from "@/services/api/endpoints/auth/auth";
import { AuthShell } from "@/components/auth/AuthShell";

function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate } = useVerifyEmail({
    mutation: {
      onSuccess: () => {
        setStatus("success");
        toast.success("Email verified successfully! You can now log in.");
        setTimeout(() => {
          router.push("/auth/login" as Route);
        }, 2000);
      },
      onError: (err: any) => {
        setStatus("error");
        setErrorMsg(err?.response?.data?.detail || "Failed to verify email. The link may have expired.");
      },
    },
  });

  useEffect(() => {
    if (token) {
      mutate({ data: { token } });
    } else {
      setStatus("error");
      setErrorMsg("Invalid verification link.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthShell title="Verify your email">
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        {status === "verifying" && (
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-content-subtle">Verifying your email...</p>
          </div>
        )}
        
        {status === "success" && (
          <div className="text-center space-y-2">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <p className="text-content">Email verified successfully!</p>
            <p className="text-content-subtle text-sm">Redirecting to login...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <div className="text-red-500 text-4xl mb-2">✗</div>
            <p className="text-danger font-medium">Verification Failed</p>
            <p className="text-content-subtle text-sm">{errorMsg}</p>
            <button
              onClick={() => router.push("/auth/login" as Route)}
              className="mt-4 px-4 py-2 bg-surface-raised border border-border rounded text-sm hover:bg-surface transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
