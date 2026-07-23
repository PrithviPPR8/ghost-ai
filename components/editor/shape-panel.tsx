"use client";

import type { DragEvent } from "react";
import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  Pill,
  RectangleHorizontal,
  type LucideIcon,
} from "lucide-react";

import {
  CANVAS_SHAPE_DRAG_DATA_TYPE,
  NODE_SHAPE_SIZES,
  type CanvasNodeShape,
  type CanvasShapeDragPayload,
} from "@/types/canvas";

interface ShapeToolbarItem {
  icon: LucideIcon;
  label: string;
  shape: CanvasNodeShape;
}

interface ShapePanelProps {
  onDragEnd?: () => void;
  onDragMove?: (
    event: DragEvent<HTMLButtonElement>,
    payload: CanvasShapeDragPayload,
  ) => void;
  onDragStart?: (
    event: DragEvent<HTMLButtonElement>,
    payload: CanvasShapeDragPayload,
  ) => void;
}

const SHAPE_TOOLBAR_ITEMS: ShapeToolbarItem[] = [
  { shape: "rectangle", label: "Rectangle", icon: RectangleHorizontal },
  { shape: "diamond", label: "Diamond", icon: Diamond },
  { shape: "circle", label: "Circle", icon: Circle },
  { shape: "pill", label: "Pill", icon: Pill },
  { shape: "cylinder", label: "Cylinder", icon: Cylinder },
  { shape: "hexagon", label: "Hexagon", icon: Hexagon },
];

export function ShapePanel({ onDragEnd, onDragMove, onDragStart }: ShapePanelProps) {
  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    shape: CanvasNodeShape,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      CANVAS_SHAPE_DRAG_DATA_TYPE,
      JSON.stringify({ shape, ...NODE_SHAPE_SIZES[shape] }),
    );
    onDragStart?.(event, { shape, ...NODE_SHAPE_SIZES[shape] });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 p-2 shadow-2xl backdrop-blur">
      {SHAPE_TOOLBAR_ITEMS.map(({ icon: Icon, label, shape }) => (
        <button
          aria-label={`Drag ${label} shape onto canvas`}
          className="nodrag nopan flex h-9 w-9 cursor-grab items-center justify-center rounded-xl text-copy-muted transition-colors hover:bg-subtle hover:text-copy-primary active:cursor-grabbing"
          draggable
          key={shape}
          onDragEnd={onDragEnd}
          onDrag={(event) => onDragMove?.(event, { shape, ...NODE_SHAPE_SIZES[shape] })}
          onDragStart={(event) => handleDragStart(event, shape)}
          title={label}
          type="button"
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}
