import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
          <div className="max-w-md text-center">
            <h1 className="heading text-4xl text-[#7700CE] mb-4">ERROR</h1>
            <p className="text-white/70 mb-4">
              Algo salió mal. Por favor recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all"
            >
              Recargar página
            </button>
            {this.state.error && (
              <pre className="mt-4 text-xs text-white/40 text-left overflow-auto p-4 bg-white/5 rounded-lg">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
