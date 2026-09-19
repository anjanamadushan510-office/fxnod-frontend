import { useState, useEffect } from "react";
import { X, Clock, Table, FileText } from "lucide-react";
import { OpenPositions } from "./OpenPositions";
import { TradeTable } from "./TradeTable";
import { Statement } from "./Statement";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = "open_positions" | "trade_table" | "statement";

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (typeof window === "undefined") return "open_positions";
    const path = window.location.pathname;
    if (path.includes("/profit")) return "trade_table";
    if (path.includes("/statement")) return "statement";
    return "open_positions";
  });

  // Sync activeTab on popstate (browser back/forward) if modal is already open
  useEffect(() => {
    if (!isOpen) return;
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("/profit")) setActiveTab("trade_table");
      else if (path.includes("/statement")) setActiveTab("statement");
      else setActiveTab("open_positions");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen]);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    let path = "/reports/positions";
    if (tab === "trade_table") path = "/reports/profit";
    else if (tab === "statement") path = "/reports/statement";
    
    // Only push state if the path actually changes to prevent duplicate history entries
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#111928] font-sans">
      {/* Header */}
      <div className="relative flex h-16 items-center justify-center border-b border-gray-800 bg-opt-bg-elev px-4">
        <h2 className="text-lg font-bold text-white">Reports</h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 rounded p-2 text-zinc-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Tabs */}
        <div className="w-[280px] border-r border-gray-800 bg-opt-bg-elev py-4">
          <nav className="flex flex-col">
            <TabItem
              id="open_positions"
              label="Open positions"
              icon={<Clock className="h-5 w-5" />}
              isActive={activeTab === "open_positions"}
              onClick={() => handleTabChange("open_positions")}
            />
            <TabItem
              id="trade_table"
              label="Trade table"
              icon={<Table className="h-5 w-5" />}
              isActive={activeTab === "trade_table"}
              onClick={() => handleTabChange("trade_table")}
            />
            <TabItem
              id="statement"
              label="Statement"
              icon={<FileText className="h-5 w-5" />}
              isActive={activeTab === "statement"}
              onClick={() => handleTabChange("statement")}
            />
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#111928]">
          {activeTab === "open_positions" && <OpenPositions />}
          {activeTab === "trade_table" && <TradeTable />}
          {activeTab === "statement" && <Statement />}
        </div>
      </div>
    </div>
  );
}

interface TabItemProps {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function TabItem({ label, icon, isActive, onClick }: TabItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3 px-6 py-4 text-left text-[14px] font-medium transition-colors ${
        isActive
          ? "bg-gray-800 text-white"
          : "text-zinc-400 hover:bg-gray-800/50 hover:text-zinc-200"
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-opt-rise" />
      )}
      <span className={isActive ? "text-white" : "text-zinc-400"}>{icon}</span>
      {label}
    </button>
  );
}
