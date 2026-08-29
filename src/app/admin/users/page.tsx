"use client";

import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/adminApi";
import { Search, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin_users"],
    queryFn: adminApi.getUsers,
  });

  const filteredUsers = users?.filter((u) => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link 
            href={"/admin/dashboard" as Route} 
            className="mb-2 flex w-max items-center text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h2>
          <p className="text-gray-500">View and manage all registered FXNOD users.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to load users. Please ensure you have admin privileges.
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  KYC Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                // Loading Skeletons
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-6 py-4"><div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div></td>
                    <td className="whitespace-nowrap px-6 py-4"><div className="h-5 w-16 animate-pulse rounded bg-gray-200"></div></td>
                    <td className="whitespace-nowrap px-6 py-4"><div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div></td>
                    <td className="whitespace-nowrap px-6 py-4"><div className="h-5 w-16 animate-pulse rounded bg-gray-200"></div></td>
                    <td className="whitespace-nowrap px-6 py-4"><div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {u.avatar_url ? (
                            <img className="h-10 w-10 rounded-full" src={u.avatar_url} alt="" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                              {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{u.full_name || "No Name"}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        u.kyc_status === 'approved' ? 'bg-green-100 text-green-800' : 
                        u.kyc_status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {u.kyc_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
