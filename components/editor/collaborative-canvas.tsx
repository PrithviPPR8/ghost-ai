"use client";

import { useCallback, useMemo, useRef, useState, type DragEvent } from "react";
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
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";

import "@liveblocks/react-flow/styles.css";
import "@xyflow/react/dist/style.css";

import { CanvasErrorBoundary } from "@/components/editor/canvas-error-boundary";
import {
  CanvasNodeComponent,
  CanvasNodeShape as CanvasNodeShapePreview,
} from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";
import {
  CANVAS_SHAPE_DRAG_DATA_TYPE,
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_TEXT_COLOR,
  NODE_SHAPES,
  type CanvasEdge,
  type CanvasNode,
  type CanvasNodeColor,
  type CanvasNodeShape,
  type CanvasNodeTextColor,
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const clientId = useRef(crypto.randomUUID());
  const nodeCounter = useRef(0);
  const nodesRef = useRef(nodes);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);

  nodesRef.current = nodes;

  const handleNodeLabelChange = useCallback(
    (nodeId: string, label: string) => {
      const node = nodesRef.current.find((currentNode) => currentNode.id === nodeId);

      if (!node || node.data.label === label) {
        return;
      }

      onNodesChange([
        {
          id: nodeId,
          item: {
            ...node,
            data: {
              ...node.data,
              label,
            },
          },
          type: "replace",
        },
      ]);
    },
    [onNodesChange],
  );

  const handleNodeColorChange = useCallback(
    (nodeId: string, color: CanvasNodeColor, textColor: CanvasNodeTextColor) => {
      const node = nodesRef.current.find((currentNode) => currentNode.id === nodeId);

      if (!node || (node.data.color === color && node.data.textColor === textColor)) {
        return;
      }

      onNodesChange([
        {
          id: nodeId,
          item: {
            ...node,
            data: {
              ...node.data,
              color,
              textColor,
            },
          },
          type: "replace",
        },
      ]);
    },
    [onNodesChange],
  );

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      canvasNode: (nodeProps) => (
        <CanvasNodeComponent
          {...(nodeProps as NodeProps<CanvasNode>)}
          onColorChange={handleNodeColorChange}
          onLabelChange={handleNodeLabelChange}
        />
      ),
    }),
    [handleNodeColorChange, handleNodeLabelChange],
  );

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    updateDragPreview(event);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const payload = readCanvasShapeDragPayload(event.dataTransfer);

    if (!payload) {
      setDragPreview(null);
      return;
    }

    nodeCounter.current += 1;
    const timestamp = Date.now();

    onNodesChange([
      {
        type: "add",
        item: {
          id: `${payload.shape}-${clientId.current}-${timestamp}-${nodeCounter.current}`,
          type: "canvasNode",
          position: screenToFlowPosition({ x: event.clientX, y: event.clientY }),
          style: { width: payload.width, height: payload.height },
          data: {
            label: "",
            color: DEFAULT_NODE_COLOR,
            shape: payload.shape,
            textColor: DEFAULT_NODE_TEXT_COLOR,
          },
        },
      },
    ]);
    setDragPreview(null);
  }

  function handleShapeDragStart(
    event: DragEvent<HTMLButtonElement>,
    payload: CanvasShapeDragPayload,
  ) {
    updateDragPreviewPosition(event, payload);
  }

  function updateDragPreview(event: DragEvent<HTMLDivElement>) {
    const payload = readCanvasShapeDragPayload(event.dataTransfer);

    if (!payload) {
      return;
    }

    updateDragPreviewPosition(event, payload);
  }

  function updateDragPreviewPosition(
    event: DragEvent<HTMLElement>,
    payload: CanvasShapeDragPayload,
  ) {
    const canvasBounds = canvasRef.current?.getBoundingClientRect();

    if (!canvasBounds) {
      return;
    }

    setDragPreview({
      ...payload,
      x: event.clientX - canvasBounds.left,
      y: event.clientY - canvasBounds.top,
    });
  }

  return (
    <div
      className="relative h-full w-full"
      ref={canvasRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow<CanvasNode, CanvasEdge>
        connectionMode={ConnectionMode.Loose}
        edges={edges}
        fitView
        nodes={nodes}
        nodeTypes={nodeTypes}
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
          <ShapePanel
            onDragEnd={() => setDragPreview(null)}
            onDragMove={updateDragPreviewPosition}
            onDragStart={handleShapeDragStart}
          />
        </Panel>
      </ReactFlow>
      {dragPreview ? <ShapeDragPreview preview={dragPreview} /> : null}
    </div>
  );
}

interface DragPreview extends CanvasShapeDragPayload {
  x: number;
  y: number;
}

function ShapeDragPreview({ preview }: { preview: DragPreview }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-50"
      style={{
        height: preview.height,
        left: preview.x,
        top: preview.y,
        transform: "translate(-50%, -50%)",
        width: preview.width,
      }}
    >
      <CanvasNodeShapePreview
        color={DEFAULT_NODE_COLOR}
        label=""
        preview
        shape={preview.shape}
        textColor={DEFAULT_NODE_TEXT_COLOR}
      />
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
