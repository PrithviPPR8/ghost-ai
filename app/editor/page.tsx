import { EditorHomeActions } from "@/components/editor/editor-home-actions";

export default function EditorPage() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <EditorHomeActions />
      </div>
    </div>
  );
}
