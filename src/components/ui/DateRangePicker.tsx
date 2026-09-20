import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { format, subDays, startOfQuarter, endOfQuarter, subQuarters } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Basic styling overrides for react-day-picker to match dark theme
const cssOverrides = `
  .rdp {
    --rdp-cell-size: 32px;
    --rdp-accent-color: #3b82f6; /* bg-blue-500 */
    --rdp-background-color: #1f2937; /* bg-gray-800 */
    --rdp-accent-color-dark: #3b82f6;
    --rdp-background-color-dark: #1f2937;
    --rdp-outline: 2px solid var(--rdp-accent-color);
    --rdp-outline-selected: 2px solid var(--rdp-accent-color);
    margin: 0;
  }
  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
    background-color: var(--rdp-accent-color) !important;
    color: white !important;
  }
  .rdp-day_selected.rdp-day_range_middle {
    background-color: #1e3a8a !important; /* bg-blue-900 */
    color: white !important;
  }
  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: var(--rdp-background-color) !important;
  }
`;

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Quick range helpers
  const handleQuickSelect = (rangeType: string) => {
    const today = new Date();
    
    let range: DateRange | undefined;
    
    switch (rangeType) {
      case "all_time":
        range = undefined;
        break;
      case "last_7":
        range = { from: subDays(today, 6), to: today };
        break;
      case "last_30":
        range = { from: subDays(today, 29), to: today };
        break;
      case "last_60":
        range = { from: subDays(today, 59), to: today };
        break;
      case "last_quarter":
        const lastQ = subQuarters(today, 1);
        range = { from: startOfQuarter(lastQ), to: endOfQuarter(lastQ) };
        break;
      default:
        range = undefined;
    }
    
    if (onChange) onChange(range);
    setIsOpen(false);
  };

  // Format the display text for the triggers
  const formatStr = "MMM, dd yyyy";
  let fromText = "Date from";
  let toText = "Today";

  if (value?.from) {
    fromText = format(value.from, formatStr);
  }
  if (value?.to) {
    toText = format(value.to, formatStr);
  }

  return (
    <>
      <style>{cssOverrides}</style>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 outline-none group">
            <div className="flex items-center gap-2 rounded border border-gray-700 bg-transparent px-3 py-1.5 text-white group-hover:bg-gray-800/50 transition-colors text-[14px]">
              <CalendarIcon className="h-4 w-4 text-zinc-400" />
              <span>{fromText}</span>
            </div>
            <span className="text-zinc-500">-</span>
            <div className="flex items-center gap-2 rounded border border-gray-700 bg-transparent px-3 py-1.5 text-white group-hover:bg-gray-800/50 transition-colors text-[14px]">
              <CalendarIcon className="h-4 w-4 text-zinc-400" />
              <span>{toText}</span>
            </div>
          </button>
        </Popover.Trigger>
        
        <Popover.Portal>
          <Popover.Content 
            className="z-[110] flex rounded-lg border border-gray-800 bg-panel shadow-2xl overflow-hidden mt-2 text-[14px] text-zinc-300 outline-none"
            align="end"
            sideOffset={4}
          >
            {/* Left Sidebar: Quick Filters */}
            <div className="w-[160px] border-r border-gray-800 bg-[#151a24] p-2 flex flex-col gap-1">
              <button 
                onClick={() => handleQuickSelect("all_time")}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                All time
              </button>
              <button 
                onClick={() => handleQuickSelect("last_7")}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Last 7 days
              </button>
              <button 
                onClick={() => handleQuickSelect("last_30")}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Last 30 days
              </button>
              <button 
                onClick={() => handleQuickSelect("last_60")}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Last 60 days
              </button>
              <button 
                onClick={() => handleQuickSelect("last_quarter")}
                className="text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Last quarter
              </button>
            </div>
            
            {/* Right Content: Calendar */}
            <div className="p-4 bg-panel">
              <DayPicker
                mode="range"
                selected={value}
                onSelect={onChange}
                numberOfMonths={2}
                showOutsideDays={false}
              />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
