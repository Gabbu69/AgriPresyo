import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-2">
            Something went wrong
          </h3>
          <p className="text-zinc-500 text-sm max-w-md mb-6">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 bg-green-500 text-black px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all"
          >
            <RefreshCw size={18} /> Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
