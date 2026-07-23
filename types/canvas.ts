import type { Edge, Node } from "@xyflow/react";

export const NODE_COLORS = [
  { fill: "#1F1F1F", name: "Neutral", text: "#EDEDED" },
  { fill: "#10233D", name: "Blue", text: "#52A8FF" },
  { fill: "#2E1938", name: "Purple", text: "#BF7AF0" },
  { fill: "#331B00", name: "Orange", text: "#FF990A" },
  { fill: "#3C1618", name: "Red", text: "#FF6166" },
  { fill: "#3A1726", name: "Pink", text: "#F75F8F" },
  { fill: "#0F2E18", name: "Green", text: "#62C073" },
  { fill: "#062822", name: "Teal", text: "#0AC7B4" },
] as const;

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

export type CanvasNodeColor = (typeof NODE_COLORS)[number]["fill"];
export type CanvasNodeTextColor = (typeof NODE_COLORS)[number]["text"];
export type CanvasNodeShape = (typeof NODE_SHAPES)[number];

export const DEFAULT_NODE_COLOR = NODE_COLORS[0].fill;
export const DEFAULT_NODE_TEXT_COLOR = NODE_COLORS[0].text;

export const MIN_CANVAS_NODE_SIZE = {
  height: 56,
  width: 96,
} as const;

export interface CanvasNodeSize {
  height: number;
  width: number;
}

export const NODE_SHAPE_SIZES: Record<CanvasNodeShape, CanvasNodeSize> = {
  rectangle: { width: 180, height: 96 },
  diamond: { width: 156, height: 156 },
  circle: { width: 112, height: 112 },
  pill: { width: 180, height: 72 },
  cylinder: { width: 160, height: 100 },
  hexagon: { width: 170, height: 100 },
};

export const CANVAS_SHAPE_DRAG_DATA_TYPE = "application/x-ghost-ai-canvas-shape";

export interface CanvasShapeDragPayload extends CanvasNodeSize {
  shape: CanvasNodeShape;
}

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: CanvasNodeColor;
  shape: CanvasNodeShape;
  textColor: CanvasNodeTextColor;
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<Record<string, never>, "canvasEdge">;
