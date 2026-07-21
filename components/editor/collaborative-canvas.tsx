"use client";

import { useRef, type DragEvent } from "react";
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";

import "@liveblocks/react-flow/styles.css";
import "@xyflow/react/dist/style.css";

import { CanvasErrorBoundary } from "@/components/editor/canvas-error-boundary";
import { CanvasNodeComponent } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";
import {
  CANVAS_SHAPE_DRAG_DATA_TYPE,
  DEFAULT_NODE_COLOR,
  NODE_SHAPES,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeShape,
  type CanvasShapeDragPayload,
} from "@/types/canvas";

interface CollaborativeCanvasProps {
  roomId: string;
}

export function CollaborativeCanvas({ roomId }: CollaborativeCanvasProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
      >
        <CanvasErrorBoundary>
          <ClientSideSuspense fallback={<CanvasLoadingState />}>
            <CanvasFlow />
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasSurface />
    </ReactFlowProvider>
  );
}

function CanvasSurface() {
  const { edges, nodes, onConnect, onDelete, onEdgesChange, onNodesChange } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });
  const { screenToFlowPosition } = useReactFlow<CanvasNode, CanvasEdge>();
  const nodeCounter = useRef(0);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const payload = readCanvasShapeDragPayload(event.dataTransfer);

    if (!payload) {
      return;
    }

    nodeCounter.current += 1;
    const timestamp = Date.now();

    onNodesChange([
      {
        type: "add",
        item: {
          id: `${payload.shape}-${timestamp}-${nodeCounter.current}`,
          type: "canvasNode",
          position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
          style: { width: payload.width, height: payload.height },
          data: {
            label: "",
            color: DEFAULT_NODE_COLOR,
            shape: payload.shape,
          },
        },
      },
    ]);
  }

  return (
    <div
      className="h-full w-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow<CanvasNode, CanvasEdge>
        connectionMode={ConnectionMode.Loose}
        edges={edges}
        fitView
        nodes={nodes}
        nodeTypes={{ canvasNode: CanvasNodeComponent }}
        onConnect={onConnect}
        onDelete={onDelete}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
      >
        <MiniMap
          bgColor="var(--bg-surface)"
          maskColor="var(--bg-base)"
          nodeColor="var(--bg-elevated)"
          nodeStrokeColor="var(--border-subtle)"
        />
        <Background
          color="var(--border-default)"
          gap={16}
          size={1}
          variant={BackgroundVariant.Dots}
        />
        <Panel position="bottom-center">
          <ShapePanel />
        </Panel>
      </ReactFlow>
    </div>
  );
}

function readCanvasShapeDragPayload(
  dataTransfer: DataTransfer,
): CanvasShapeDragPayload | null {
  const rawPayload = dataTransfer.getData(CANVAS_SHAPE_DRAG_DATA_TYPE);

  if (!rawPayload) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(rawPayload);

    if (
      !isRecord(payload) ||
      !isCanvasNodeShape(payload.shape) ||
      !isPositiveNumber(payload.width) ||
      !isPositiveNumber(payload.height)
    ) {
      return null;
    }

    return {
      shape: payload.shape,
      width: payload.width,
      height: payload.height,
    };
  } catch {
    return null;
  }
}

function isCanvasNodeShape(value: unknown): value is CanvasNodeShape {
  return typeof value === "string" && NODE_SHAPES.includes(value as CanvasNodeShape);
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function CanvasLoadingState() {
  return (
    <div className="flex h-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Loading collaborative canvas…</p>
    </div>
  );
}
