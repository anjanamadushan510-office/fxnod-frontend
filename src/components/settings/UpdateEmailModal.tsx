import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { 
  verifyCurrentPassword, 
  requestEmailUpdate, 
  confirmEmailUpdate 
} from "@/services/api/endpoints/users/users";
import { isAxiosError } from "axios";

interface UpdateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateEmailModal({ isOpen, onClose }: UpdateEmailModalProps) {
  const [step, setStep] = useState<"verify" | "newEmail" | "otp">("verify");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bootstrap = useAuthStore((state) => state.bootstrap);

  if (!isOpen) return null;

  const resetState = () => {
    setStep("verify");
    setPassword("");
    setNewEmail("");
    setOtp("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const extractError = (err: unknown): string => {
    if (isAxiosError(err) && err.response?.data?.detail) {
      const detail = err.response.data.detail;
      if (typeof detail === "string") {
        return detail;
      }
      if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
        return detail[0].msg;
      }
    }
    return "An unexpected error occurred.";
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    try {
      await verifyCurrentPassword({ current_password: password });
      setStep("newEmail");
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setIsLoading(true);
    try {
      await requestEmailUpdate({ new_email: newEmail });
      toast.success("Verification code sent to " + newEmail);
      setStep("otp");
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      await confirmEmailUpdate({ new_email: newEmail, otp });
      toast.success("Email successfully updated!");
      // Refresh the session so the new email shows up in the UI
      await bootstrap();
      handleClose();
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface border border-line rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-lg font-semibold text-ink">
            {step === "verify" ? "Verify Identity" : step === "newEmail" ? "Update Email" : "Confirm OTP"}
          </h2>
          <button 
            onClick={handleClose}
            className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === "verify" && (
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <p className="text-sm text-ink-2 mb-4">
                  For your security, please verify your identity by entering your current password before changing your email address.
                </p>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm text-ink outline-none focus:border-ink transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!password || isLoading}
                className="w-full h-10 mt-2 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Identity"}
              </button>
            </form>
          )}

          {step === "newEmail" && (
            <form onSubmit={handleRequestUpdate} className="space-y-4">
              <div>
                <p className="text-sm text-ink-2 mb-4">
                  Enter your new email address. We will send a verification code to confirm you own it.
                </p>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm text-ink outline-none focus:border-ink transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!newEmail || isLoading}
                className="w-full h-10 mt-2 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleConfirmUpdate} className="space-y-4">
              <div>
                <p className="text-sm text-ink-2 mb-4">
                  Enter the 6-digit verification code sent to <span className="font-medium text-ink">{newEmail}</span>.
                </p>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm text-ink outline-none focus:border-ink transition-colors tracking-widest"
                  required
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                className="w-full h-10 mt-2 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Confirming..." : "Confirm Email Update"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
