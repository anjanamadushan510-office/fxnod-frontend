import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface UpdateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateEmailModal({ isOpen, onClose }: UpdateEmailModalProps) {
  const [step, setStep] = useState<"verify" | "newEmail">("verify");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    // Mock API call to verify current password
    setTimeout(() => {
      setIsLoading(false);
      setStep("newEmail");
    }, 1000);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setIsLoading(true);
    // Mock API call to send verification code to new email
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Verification code sent to " + newEmail);
      onClose();
      // Reset state for next open
      setTimeout(() => {
        setStep("verify");
        setPassword("");
        setNewEmail("");
      }, 500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface border border-line rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-lg font-semibold text-ink">
            {step === "verify" ? "Verify Identity" : "Update Email"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === "verify" ? (
            <form onSubmit={handleVerify} className="space-y-4">
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
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
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
        </div>
      </div>
    </div>
  );
}
