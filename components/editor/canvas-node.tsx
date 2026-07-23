import {
  Handle,
  NodeResizer,
  Position,
  type NodeProps,
} from "@xyflow/react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  MIN_CANVAS_NODE_SIZE,
  type CanvasNode,
  type CanvasNodeColor,
  type CanvasNodeShape,
  type CanvasNodeTextColor,
} from "@/types/canvas";
import { NodeColorToolbar } from "@/components/editor/node-color-toolbar";

interface CanvasNodeShapeProps {
  color: CanvasNodeColor;
  label: string;
  preview?: boolean;
  selected?: boolean;
  shape: CanvasNodeShape;
  textColor: CanvasNodeTextColor;
  labelContent?: ReactNode;
}

interface CanvasNodeComponentProps extends NodeProps<CanvasNode> {
  onColorChange: (nodeId: string, color: CanvasNodeColor, textColor: CanvasNodeTextColor) => void;
  onLabelChange: (nodeId: string, label: string) => void;
}

export function CanvasNodeComponent({
  data,
  id,
  selected,
  onColorChange,
  onLabelChange,
}: CanvasNodeComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(data.label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  function beginEditing() {
    setDraftLabel(data.label);
    setIsEditing(true);
  }

  function finishEditing() {
    setIsEditing(false);
  }

  function handleLabelChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const label = event.target.value;

    setDraftLabel(label);
    onLabelChange(id, label);
  }

  function handleLabelKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    event.stopPropagation();

    if (event.key === "Escape") {
      event.preventDefault();
      finishEditing();
    }
  }

  return (
    <div className="group h-full w-full">
      {selected ? (
        <NodeColorToolbar
          activeColor={data.color}
          onColorChange={(color) => onColorChange(id, color.fill, color.text)}
        />
      ) : null}
      <NodeResizer
        color="var(--accent-primary)"
        handleClassName="!h-2 !w-2 !rounded-sm !border !border-surface-border !bg-surface"
        isVisible={selected}
        lineClassName="!border-brand/70"
        minHeight={MIN_CANVAS_NODE_SIZE.height}
        minWidth={MIN_CANVAS_NODE_SIZE.width}
      />
      <Handle
        className="h-2 w-2 border border-surface-border bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        id="target-top"
        position={Position.Top}
        type="target"
      />
      <Handle
        className="h-2 w-2 border border-surface-border bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        id="target-left"
        position={Position.Left}
        type="target"
      />
      <CanvasNodeShape
        {...data}
        labelContent={
          isEditing ? (
            <textarea
              aria-label="Edit node label"
              className="nodrag nopan relative z-10 h-10 w-full resize-none bg-transparent px-3 text-center text-sm leading-5 outline-none placeholder:text-copy-muted"
              onBlur={finishEditing}
              onChange={handleLabelChange}
              onDoubleClick={(event) => event.stopPropagation()}
              onKeyDown={handleLabelKeyDown}
              placeholder="Add label"
              ref={textareaRef}
              value={draftLabel}
            />
          ) : (
            <span
              className="nodrag nopan relative z-10 max-w-full cursor-text px-3"
              onDoubleClick={(event) => {
                event.stopPropagation();
                beginEditing();
              }}
            >
              {data.label || <span className="text-copy-muted">Add label</span>}
            </span>
          )
        }
        selected={selected}
      />
      <Handle
        className="h-2 w-2 border border-surface-border bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        id="source-right"
        position={Position.Right}
        type="source"
      />
      <Handle
        className="h-2 w-2 border border-surface-border bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        id="source-bottom"
        position={Position.Bottom}
        type="source"
      />
    </div>
  );
}

export function CanvasNodeShape({
  color,
  label,
  preview = false,
  selected = false,
  shape,
  textColor,
  labelContent,
}: CanvasNodeShapeProps) {
  const borderColor = selected ? "var(--text-primary)" : "var(--border-subtle)";
  const shapeContent = isSvgShape(shape) ? (
    <SvgShape color={color} shape={shape} stroke={borderColor} />
  ) : null;

  return (
    <div
      className={[
        "relative flex h-full w-full items-center justify-center text-center text-sm",
        preview ? "opacity-55" : "",
        shape === "rectangle" ? "rounded-xl border" : "",
        shape === "pill" ? "rounded-full border" : "",
        shape === "circle" ? "rounded-full border" : "",
      ].join(" ")}
      style={{
        ...(isSvgShape(shape) ? undefined : { backgroundColor: color }),
        borderColor: isSvgShape(shape) ? undefined : borderColor,
        color: textColor,
      }}
    >
      {shapeContent}
      {labelContent ?? <span className="relative z-10 max-w-full px-3">{label}</span>}
    </div>
  );
}

function SvgShape({
  color,
  shape,
  stroke,
}: Pick<CanvasNodeShapeProps, "color" | "shape"> & { stroke: string }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {shape === "diamond" ? (
        <polygon
          fill={color}
          points="50,1 99,50 50,99 1,50"
          stroke={stroke}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      {shape === "hexagon" ? (
        <polygon
          fill={color}
          points="25,1 75,1 99,50 75,99 25,99 1,50"
          stroke={stroke}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      {shape === "cylinder" ? (
        <>
          <path
            d="M4 18 C4 7 96 7 96 18 V82 C96 93 4 93 4 82 Z"
            fill={color}
            stroke={stroke}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M4 18 C4 29 96 29 96 18"
            fill="none"
            stroke={stroke}
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : null}
    </svg>
  );
}

function isSvgShape(shape: CanvasNodeShape) {
  return shape === "diamond" || shape === "hexagon" || shape === "cylinder";
}
