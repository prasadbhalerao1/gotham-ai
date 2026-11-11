import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center bg-ink px-6 text-bone">
        <div className="mx-auto w-full max-w-2xl">
          <p className="label mb-6 text-signal">Something broke</p>
          <h1 className="display text-7xl md:text-8xl">
            Signal <span className="accent">interrupted</span>
          </h1>
          <p className="mt-6 text-lg text-bone-dim">An unexpected error stopped this page from rendering. Reloading usually fixes it.</p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 max-h-64 overflow-auto border border-bone/10 p-4 font-mono text-xs text-alert">
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={() => window.location.reload()} className="btn-signal">
              Reload page
            </button>
            <a href="/" className="btn-ghost">
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
