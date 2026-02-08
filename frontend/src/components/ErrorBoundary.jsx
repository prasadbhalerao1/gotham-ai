import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 text-center backdrop-blur-lg">
            <div className="mb-6">
              <svg
                className="mx-auto size-20 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h1 className="mb-4 text-3xl font-bold text-white">
              Oops! Something went wrong
            </h1>
            
            <p className="mb-6 text-blue-100/80">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="mb-2 cursor-pointer text-yellow-400 hover:text-yellow-300">
                  Error Details (Development Only)
                </summary>
                <div className="max-h-64 overflow-auto rounded-lg bg-black/50 p-4">
                  <p className="mb-2 font-mono text-sm text-red-400">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="font-mono text-xs text-gray-400">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
              >
                Go to Homepage
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-white/10 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/20"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
