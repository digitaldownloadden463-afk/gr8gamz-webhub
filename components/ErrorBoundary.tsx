'use client';

import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component catches JavaScript errors in child components.
 * Used to gracefully handle iframe embed failures and other runtime errors.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback?.(this.state.error!) || (
          <div
            style={{
              padding: '24px',
              borderRadius: '12px',
              background: 'rgba(255, 47, 125, 0.1)',
              border: '1px solid rgba(255, 47, 125, 0.2)',
              color: '#fff',
            }}
          >
            <strong>Something went wrong</strong>
            <p style={{ color: '#a1a1aa', marginTop: '8px' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
