import { useState } from "react";
import { toast } from "sonner";
import { NewPasswordForm } from "./NewPasswordForm";
import { parseApiError } from "@/lib/apiError";
import {
  useForgotPassword,
  useVerifyForgotPasswordOtp,
  useResetPassword,
} from "@/services/api/endpoints/users/users";

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordFlow({ onBackToLogin }: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const forgotPassword = useForgotPassword({
    mutation: {
      onSuccess: () => {
        setStep(2);
        toast.success("OTP sent to your email");
      },
      onError: (err) => {
        toast.error(parseApiError(err).message || "Failed to send OTP. Please check your email.");
      }
    }
  });

  const verifyOtp = useVerifyForgotPasswordOtp({
    mutation: {
      onSuccess: (data) => {
        setResetToken(data.reset_token);
        setStep(3);
        toast.success("OTP verified. Please enter your new password.");
      },
      onError: (err) => {
        toast.error(parseApiError(err).message || "Invalid OTP");
      }
    }
  });

  const resetPassword = useResetPassword({
    mutation: {
      onSuccess: () => {
        toast.success("Password reset successful. You can now log in.");
        onBackToLogin();
      },
      onError: (err) => {
        toast.error(parseApiError(err).message || "Failed to reset password");
      }
    }
  });

  const handleRequestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    forgotPassword.mutate({ data: { email } });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return toast.error("Please enter the OTP");
    verifyOtp.mutate({ data: { email, code: otpCode } });
  };

  const handleResetPassword = (newPassword: string) => {
    resetPassword.mutate({ data: { reset_token: resetToken, new_password: newPassword } });
  };

  const isLoading = forgotPassword.isPending || verifyOtp.isPending || resetPassword.isPending;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-sm text-zinc-400">
          {step === 1 && "Enter your email to receive a reset code."}
          {step === 2 && `Enter the 6-digit code sent to ${email}.`}
          {step === 3 && "Create a new password for your account."}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleRequestEmail} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm text-zinc-300">Email</span>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-10 px-3.5 rounded-xl bg-[#0B1220] border border-[#24344F] focus:border-[#C9A08C] focus:outline-none transition-colors"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm text-zinc-300">Reset Code</span>
            <input
              type="text"
              required
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="mt-2 w-full h-10 px-3.5 rounded-xl text-center tracking-[0.5em] font-mono bg-[#0B1220] border border-[#24344F] focus:border-[#C9A08C] focus:outline-none transition-colors"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}

      {step === 3 && (
        <NewPasswordForm
          onSubmit={handleResetPassword}
          isLoading={isLoading}
          buttonText="Reset Password"
        />
      )}

      <div className="text-center mt-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
