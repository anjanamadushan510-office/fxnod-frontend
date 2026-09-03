"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRegister } from "@/services/api/endpoints/auth/auth";
import { parseApiError } from "@/lib/apiError";
import { clearReferralCode, readReferralCode } from "@/lib/referral";
import { AuthShell } from "./AuthShell";
import { Field, SubmitButton } from "./fields";

/**
 * Registration screen wired to the Orval `useRegister` mutation (POST
 * /api/v1/auth/register). On the 201 response we send the user to the login
 * page with a success toast (register returns a user, not a session — so the
 * user logs in explicitly).
 */
export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Read after mount, never during render: sessionStorage does not exist on the
  // server, and this page is prerendered.
  const [referralCode, setReferralCode] = useState<string | null>(null);
  useEffect(() => setReferralCode(readReferralCode()), []);

  const registerMut = useRegister({
    mutation: {
      onSuccess: () => {
        // Spent. Leaving it would attribute a second account made in the same
        // browser session to the same affiliate.
        clearReferralCode();
        toast.success("Account created — enter the code we emailed to verify.");
        // Registration issues an OTP; continue to the verification screen.
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}` as Route);
      },
      onError: (err) => {
        const parsed = parseApiError(err, "Registration failed. Please try again.");
        setFieldErrors(parsed.fieldErrors);
        toast.error(parsed.message);
      },
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    if (password !== confirmPassword) {
      setFieldErrors({ confirm_password: "Passwords do not match" });
      return;
    }
    registerMut.mutate({
      data: {
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
        // Carried from the `?ref=` this visit arrived by. The server decides
        // whether the code resolves to anyone; an unknown one just leaves the
        // account unattributed rather than failing the signup.
        referral_code: referralCode,
      },
    });
  }

  return (
    <AuthShell
      title="Create your FXNod account"
      subtitle="Join FXNod to fund your wallet and start trading."
      footer={
        <>
          Already have an account?{" "}
          <a href="/auth/login" className="font-semibold text-gold hover:underline">
            Log in
          </a>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {/* Attribution is a lasting fact about the account — who introduced you
            never changes afterwards — so it is stated rather than applied
            invisibly. The code, not a name: this page has no business asking
            the server who owns it. */}
        {referralCode && (
          <p className="m-0 rounded-lg bg-gold-soft px-3 py-2 text-[12px] text-gold-3">
            Invited with referral code{" "}
            <span className="font-bold tracking-wide">{referralCode}</span>
          </p>
        )}
        <Field
          label="Full name"
          value={fullName}
          onChange={setFullName}
          error={fieldErrors.full_name}
          autoComplete="name"
          placeholder="Ada Lovelace"
          required
        />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
        />
        <Field
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={fieldErrors.confirm_password}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          required
        />
        <SubmitButton pending={registerMut.isPending}>Create account</SubmitButton>
      </form>
    </AuthShell>
  );
}
