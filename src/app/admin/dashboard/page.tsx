"use client";

import type { Route } from "next";
import { Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Overview and management tools for FXNOD.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* User Management Card */}
        <Link 
          href={"/admin/users" as Route}
          className="group relative rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300 flex flex-col items-start"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1A1A]">
            <Users className="h-6 w-6 text-[#FFB11A]" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">User Management</h3>
          <p className="mb-6 text-sm text-gray-500 leading-relaxed">
            View all registered users on FXNOD. Check KYC statuses, active sessions, and manage platform access.
          </p>
          <div className="mt-auto flex w-full items-center text-sm font-medium text-[#B87A00] group-hover:text-[#996600]">
            Open Users
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link>
        
        {/* Placeholder for future admin tools */}
      </div>
    </div>
  );
}
