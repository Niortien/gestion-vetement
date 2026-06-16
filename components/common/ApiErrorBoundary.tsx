"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Button } from "@heroui/react";

interface ApiErrorBoundaryProps {
  children: ReactNode;
}

interface ApiErrorBoundaryState {
  hasError: boolean;
}

export class ApiErrorBoundary extends Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  state: ApiErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ApiErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ApiErrorBoundary", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="rounded-lg border border-out bg-[var(--color-out-dim)] p-5">
        <p className="text-sm text-text">Une erreur est survenue.</p>
        <Button className="mt-3" color="danger" variant="flat" onPress={() => this.setState({ hasError: false })}>
          Reessayer
        </Button>
      </div>
    );
  }
}
