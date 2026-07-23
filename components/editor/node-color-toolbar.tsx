import { useState, type PointerEvent } from "react";

import { NODE_COLORS, type CanvasNodeColor } from "@/types/canvas";

interface NodeColorToolbarProps {
  activeColor: CanvasNodeColor;
  onColorChange: (color: (typeof NODE_COLORS)[number]) => void;
}

export function NodeColorToolbar({
  activeColor,
  onColorChange,
}: NodeColorToolbarProps) {
  const [hoveredColor, setHoveredColor] = useState<CanvasNodeColor | null>(null);

  function stopCanvasInteraction(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  return (
    <div
      aria-label="Node colors"
      className="nodrag nopan absolute bottom-full left-1/2 z-20 mb-3 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-surface-border bg-surface/95 p-1.5 shadow-lg backdrop-blur"
      role="toolbar"
    >
      {NODE_COLORS.map((color) => {
        const isActive = color.fill === activeColor;
        const isHovered = color.fill === hoveredColor;

        return (
          <button
            aria-label={`Set node color to ${color.name}`}
            aria-pressed={isActive}
            className="nodrag nopan h-5 w-5 rounded-full border transition-[border-color,box-shadow,transform] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            key={color.fill}
            onClick={() => onColorChange(color)}
            onPointerDown={stopCanvasInteraction}
            onPointerEnter={() => setHoveredColor(color.fill)}
            onPointerLeave={() => setHoveredColor(null)}
            style={{
              backgroundColor: color.fill,
              borderColor: isActive ? color.text : "var(--border-subtle)",
              boxShadow: isActive || isHovered ? `0 0 6px ${color.text}` : "none",
            }}
            title={color.name}
            type="button"
          />
        );
      })}
    </div>
  );
}
