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
      window.history.pushState(null, "", path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#111928] font-sans pt-safe pb-safe px-safe">
      {/* Header */}
      <div className="relative flex h-14 flex-none items-center lg:h-16 justify-center border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2234] px-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reports</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reports"
          className="absolute right-2 rounded p-3 lg:right-4 lg:p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body: Sidebar + Main Content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Tabs: a row across the top on a phone, a left rail on desktop */}
        <div className="flex-none border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2234] lg:w-[280px] lg:border-b-0 lg:border-r lg:py-4">
          <nav className="flex lg:flex-col">
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
        <div className="min-h-0 flex-1 overflow-hidden bg-white dark:bg-[#111928]">
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
      className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-2 py-3.5 text-[13px] font-medium transition-colors lg:flex-none lg:justify-start lg:gap-3 lg:px-6 lg:py-4 lg:text-left lg:text-[14px] ${
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          : "text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-zinc-200"
      }`}
    >
      {isActive && (
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-opt-rise lg:top-0 lg:h-auto lg:w-1" />
      )}
      <span className={isActive ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-zinc-400"}>
        {icon}
      </span>
      {label}
    </button>
  );
}
