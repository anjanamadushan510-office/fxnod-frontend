import React from "react";
import { cn } from "@/lib/cn";

const TEAL = "#00A79E";
const RED = "#ef5350";
const GREY = "#999999";

interface IconProps {
  className?: string;
}

export function IconAwesomeOscillator({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <rect x="4" y="10" width="3" height="6" fill={RED} />
      <rect x="9" y="6" width="3" height="10" fill={TEAL} />
      <rect x="14" y="4" width="3" height="12" fill={TEAL} />
      <rect x="19" y="8" width="3" height="8" fill={RED} />
    </svg>
  );
}

export function IconDPO({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <path d="M3 12 L7 6 L11 15 L16 8 L21 14" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMACD({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      {/* Histogram */}
      <rect x="4" y="12" width="2" height="4" fill={GREY} opacity="0.3" />
      <rect x="8" y="10" width="2" height="6" fill={GREY} opacity="0.5" />
      <rect x="12" y="7" width="2" height="9" fill={GREY} opacity="0.7" />
      <rect x="16" y="11" width="2" height="5" fill={GREY} opacity="0.5" />
      <rect x="20" y="13" width="2" height="3" fill={GREY} opacity="0.3" />
      {/* Lines */}
      <path d="M2 14 L8 10 L14 16 L22 6" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 16 L9 12 L15 14 L22 8" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconROC({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <path d="M3 8 L9 16 L15 12 L21 6" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="12" x2="22" y2="12" stroke={GREY} strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

export function IconRSI({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <line x1="2" y1="6" x2="22" y2="6" stroke={RED} strokeWidth="1" strokeDasharray="2 2" />
      <line x1="2" y1="18" x2="22" y2="18" stroke={RED} strokeWidth="1" strokeDasharray="2 2" />
      <path d="M2 14 L6 10 L10 16 L15 8 L18 12 L22 5" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStochastic({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <path d="M2 12 Q6 4, 10 12 T18 12 T22 8" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14 Q7 7, 11 14 T19 14 T22 10" stroke={RED} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconWPR({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <line x1="2" y1="5" x2="22" y2="5" stroke={GREY} strokeWidth="1" strokeDasharray="2 2" />
      <line x1="2" y1="19" x2="22" y2="19" stroke={GREY} strokeWidth="1" strokeDasharray="2 2" />
      <path d="M2 10 L6 16 L10 8 L15 14 L19 6 L22 12" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGenericTrend({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <path d="M3 18 L9 10 L15 14 L21 4" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGenericVolatility({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <path d="M2 12 Q6 4 12 12 T22 12" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12 Q6 20 12 12 T22 12" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGenericMA({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <path d="M2 16 Q8 10 14 12 T22 6" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGenericOther({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5", className)}>
      <circle cx="6" cy="12" r="2" fill={GREY} />
      <circle cx="12" cy="12" r="2" fill={GREY} />
      <circle cx="18" cy="12" r="2" fill={GREY} />
    </svg>
  );
}
