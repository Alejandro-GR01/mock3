import { Component, type ReactNode, type ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-bg-editor">
          <div className="flex flex-col items-center gap-4 p-8">
            <picture>
              <source type="image/webp" srcSet="/mocky-cables.webp" />
              <img
                src="/mocky-cables.png"
                alt="Mocky tangled in cables"
                width={200}
                height={200}
                className="object-contain"
              />
            </picture>
            <h2 className="text-lg font-semibold text-text-primary">
              Something went wrong
            </h2>
            <p className="max-w-md text-center text-[13px] text-brand-gold">
              Mocky got tangled in the cables!
            </p>
            <p className="max-w-md text-center text-[13px] text-text-muted">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 text-[13px] text-white bg-accent-blue hover:bg-accent-blue/90"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
