"use client";

import { useEffect, useRef, useState } from "react";
import {
  ordersApi,
  type ConfirmResponse,
  type ProposalRequest,
  type ProposalResponse,
} from "@/services/tradingApi";
import { buildWsUrl } from "@/services/ws";
import { useAuthStore } from "@/stores/authStore";

interface UseProposalStreamOptions {
  enabled?: boolean;
}

interface UseProposalStreamResult {
  proposal: ProposalResponse | null;
  loading: boolean;
  error: string | null;
  confirm: () => Promise<ConfirmResponse>;
}

export function useProposalStream(
  request: ProposalRequest | null,
  { enabled = true }: UseProposalStreamOptions = {},
): UseProposalStreamResult {
  const [proposal, setProposal] = useState<ProposalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authStatus = useAuthStore((s) => s.status);

  const requestRef = useRef<ProposalRequest | null>(request);
  const proposalRef = useRef<ProposalResponse | null>(null);
  requestRef.current = request;
  proposalRef.current = proposal;

  const key = request ? JSON.stringify(request) : null;
  const wsRef = useRef<WebSocket | null>(null);

    if (!enabled || !request || authStatus !== "authenticated") {
      setProposal(null);
      setLoading(false);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    setLoading(true);
    setError(null);

    let reconnectAttempts = 0;
    let isCleanedUp = false;

    const connect = () => {
      if (isCleanedUp) return;

      const ws = new WebSocket(buildWsUrl("/ws/proposal"));
      wsRef.current = ws;

      let pingInterval: ReturnType<typeof setInterval>;

      ws.onopen = () => {
        if (isCleanedUp) {
          ws.close();
          return;
        }
        reconnectAttempts = 0;
        setError(null);
        ws.send(JSON.stringify(requestRef.current));
        
        pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        if (isCleanedUp) return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === "proposal") {
            setProposal(data as ProposalResponse);
            setLoading(false);
            setError(null);
          } else if (data.type === "error") {
            setError(data.message || "Unknown error");
            setLoading(false);
          }
        } catch (err) {
          console.error("Failed to parse proposal stream message:", err);
        }
      };

      ws.onclose = () => {
        clearInterval(pingInterval);
        if (!isCleanedUp && reconnectAttempts < 5) {
          const delay = Math.pow(2, reconnectAttempts) * 1000;
          setTimeout(connect, delay);
          reconnectAttempts++;
        }
      };
      
      ws.onerror = () => {
        if (!isCleanedUp) {
          setError("Stream connection error");
        }
      };
    };

    connect();

    return () => {
      isCleanedUp = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [key, enabled, authStatus]);

  const confirm = async (): Promise<ConfirmResponse> => {
    let current = proposalRef.current;
    if (!current) throw new Error("No pending request.");
    try {
      return await ordersApi.confirm(current.proposal_id);
    } catch (e) {
      if (statusOf(e) === 410 && requestRef.current) {
        // Fallback to one-shot fetch for a fresh quote if the stream quote expired
        const fresh = await ordersApi.proposal(requestRef.current);
        setProposal(fresh);
        proposalRef.current = fresh;
        current = fresh;
        return await ordersApi.confirm(fresh.proposal_id);
      }
      throw e;
    }
  };

  return { proposal, loading, error, confirm };
}

function statusOf(e: unknown): number | undefined {
  return (e as { response?: { status?: number } })?.response?.status;
}
