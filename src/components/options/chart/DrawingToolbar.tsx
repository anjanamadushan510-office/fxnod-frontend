"use client";

import { useState, useRef, useEffect } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { useChartDrawings, type Drawing } from "@/stores/useChartDrawings";
import { cn } from "@/lib/cn";

const PRESET_COLORS = [
  "#FF4444", // Red
  "#FF8800", // Orange
  "#FFCC00", // Yellow
  "#00C851", // Green
  "#00A79E", // Teal
  "#33B5E5", // Blue
  "#AA66CC", // Purple
  "#FFFFFF", // White
  "#9E9E9E", // Gray
  "#212121", // Dark Gray
];

export function DrawingToolbar() {
  const activeDrawingId = useChartDrawings((s) => s.activeDrawingId);
  const drawings = useChartDrawings((s) => s.drawings);
  const updateDrawing = useChartDrawings((s) => s.updateDrawing);
  const removeDrawing = useChartDrawings((s) => s.removeDrawing);
  const setActiveDrawingId = useChartDrawings((s) => s.setActiveDrawingId);

  const activeDrawing = activeDrawingId
    ? drawings.find((d) => d.id === activeDrawingId)
    : null;
    
  const activeDrawingScreenPos = useChartDrawings((s) => s.activeDrawingScreenPos);

  // Draggable State
  const [position, setPosition] = useState({ x: 80, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  useEffect(() => {
    // Basic centering when a new drawing is selected if we haven't dragged
    if (activeDrawingScreenPos) {
       setPosition({ x: activeDrawingScreenPos.x + 10, y: activeDrawingScreenPos.y - 35 });
    }
  }, [activeDrawingScreenPos, activeDrawingId]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initX + dx,
        y: dragRef.current.initY + dy,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const [thicknessOpen, setThicknessOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  // Close popovers if clicked outside
  const toolbarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setThicknessOpen(false);
        setColorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!activeDrawing) return null;

  const currentThickness = activeDrawing.thickness ?? 2;

  return (
    <div
      ref={toolbarRef}
      className="absolute z-[100] flex items-center gap-4 rounded-md border border-[#24344F] bg-[#10141f] px-3 py-1.5 shadow-xl text-sm"
      style={{
        left: position.x,
        top: position.y,
        // Make sure it doesn't block clicks from passing through if not clicked exactly on buttons
      }}
    >
      {/* Drag Handle */}
      <button
        onPointerDown={(e) => {
          setIsDragging(true);
          dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initX: position.x,
            initY: position.y,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        className="flex h-6 w-5 cursor-grab items-center justify-center rounded text-zinc-500 hover:text-white active:cursor-grabbing"
        title="Drag toolbar"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Thickness Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setThicknessOpen(!thicknessOpen);
            setColorOpen(false);
          }}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[#1a2332]",
            thicknessOpen && "bg-[#1a2332]"
          )}
        >
          <div
            className="w-3 rounded-full bg-zinc-300"
            style={{ height: currentThickness }}
          />
        </button>
        {thicknessOpen && (
          <div className="absolute left-0 top-full mt-2 w-[140px] rounded-md border border-[#24344F] bg-[#10141f] p-1 shadow-lg">
            {[1, 2, 3, 4].map((t) => (
              <button
                key={t}
                onClick={() => {
                  updateDrawing(activeDrawing.id, { thickness: t });
                  setThicknessOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-[13px] transition-colors hover:bg-[#1a2332]",
                  currentThickness === t ? "text-white bg-[#1a2332]" : "text-zinc-400"
                )}
              >
                <span>{t} px</span>
                <span className="w-8 flex items-center justify-center">
                   <div className="w-full border-b" style={{ borderWidth: t, borderColor: 'currentColor' }} />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-4 w-px bg-[#24344F]" />

      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => {
            setColorOpen(!colorOpen);
            setThicknessOpen(false);
          }}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-[#1a2332]",
            colorOpen && "bg-[#1a2332]"
          )}
        >
          <div
            className="h-4 w-4 rounded-sm border border-black/20"
            style={{ backgroundColor: activeDrawing.color }}
          />
        </button>
        {colorOpen && (
          <div className="absolute left-0 top-full mt-2 rounded-md border border-[#24344F] bg-[#10141f] p-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2 w-max">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    updateDrawing(activeDrawing.id, { color: c });
                    setColorOpen(false);
                  }}
                  className={cn(
                    "h-6 w-6 rounded border border-transparent transition-transform hover:scale-110",
                    activeDrawing.color === c && "ring-1 ring-white ring-offset-1 ring-offset-[#10141f]"
                  )}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-4 w-px bg-[#24344F]" />

      {/* Delete Button */}
      <button
        onClick={() => {
          removeDrawing(activeDrawing.id);
          setActiveDrawingId(null);
        }}
        className="flex h-6 w-6 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-500/10"
        title="Delete drawing"
      >
        <Trash2 className="h-4 w-4" />
      </button>

    </div>
  );
}
