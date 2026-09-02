"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";
import { Check, X, Loader2 } from "lucide-react";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getManualDeposits();
      setDeposits(data);
    } catch (err: any) {
      setError(err.message || "Failed to load deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this deposit and credit the user's wallet?")) return;
    
    try {
      setProcessingId(id);
      await adminApi.approveManualDeposit(id);
      alert("Deposit approved successfully!");
      fetchDeposits();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const note = window.prompt("Reason for rejection (optional):");
    if (note === null) return; // User cancelled
    
    try {
      setProcessingId(id);
      await adminApi.rejectManualDeposit(id, note);
      alert("Deposit rejected.");
      fetchDeposits();
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manual Deposits</h1>
        <button onClick={fetchDeposits} className="text-sm bg-white border px-3 py-1.5 rounded-md hover:bg-gray-50">
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
              <th className="p-4">Date</th>
              <th className="p-4">User ID</th>
              <th className="p-4">Amount</th>
              <th className="p-4">TxHash</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {deposits.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No manual deposits found.
                </td>
              </tr>
            ) : (
              deposits.map((dep) => (
                <tr key={dep.id} className="border-b border-gray-100 last:border-none">
                  <td className="p-4 text-gray-600">
                    {new Date(dep.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-900 font-mono text-xs">
                    {dep.user_id}
                  </td>
                  <td className="p-4 font-bold text-green-600">
                    ${dep.amount} {dep.currency}
                  </td>
                  <td className="p-4">
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono break-all max-w-[200px]">
                      {dep.tx_hash}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dep.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : dep.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dep.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {dep.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(dep.id)}
                          disabled={processingId === dep.id}
                          className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                        >
                          {processingId === dep.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(dep.id)}
                          disabled={processingId === dep.id}
                          className="flex items-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                        >
                          {processingId === dep.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
