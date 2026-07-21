"use client";

import { Component, type ReactNode } from "react";

interface CanvasErrorBoundaryProps {
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center bg-base px-6">
          <p className="max-w-sm text-center text-sm leading-6 text-copy-muted">
            Unable to connect to the collaborative canvas. Please refresh and try
            again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
