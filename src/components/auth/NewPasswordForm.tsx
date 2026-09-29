import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

export interface NewPasswordFormProps {
  onSubmit: (newPassword: string) => void;
  isLoading?: boolean;
  buttonText?: string;
}

export function NewPasswordForm({ onSubmit, isLoading, buttonText = "Update password" }: NewPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const handleSubmit = () => {
    setPasswordMatchError("");
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMatchError("New passwords do not match");
      return;
    }
    onSubmit(newPassword);
  };

  return (
    <>
      <div className="pt-2 border-t border-line">
        <label className="block mb-4">
          <span className="text-xs text-zinc-500">New password</span>
          <input 
            type="password" 
            minLength={8} 
            value={newPassword} 
            onChange={(e) => { setNewPassword(e.target.value); setPasswordMatchError(""); }} 
            className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" 
            placeholder="At least 8 characters" 
          />
        </label>
        <label className="block mb-4">
          <span className="text-xs text-zinc-500">Confirm new password</span>
          <input 
            type="password" 
            minLength={8} 
            value={confirmPassword} 
            onChange={(e) => { setConfirmPassword(e.target.value); setPasswordMatchError(""); }} 
            className={cn("mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border text-sm outline-none focus:border-zinc-500", passwordMatchError ? "border-red-500" : "border-line")} 
            placeholder="Repeat new password" 
          />
          {passwordMatchError && <span className="block mt-1 text-xs text-red-500">{passwordMatchError}</span>}
        </label>
      </div>
      <button 
        type="button" 
        disabled={isLoading} 
        className="h-10 px-5 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-medium disabled:opacity-50" 
        onClick={handleSubmit}
      >
        {isLoading ? "Processing..." : buttonText}
      </button>
    </>
  );
}
