import React from "react";
import ErrorPage from "../pages/ErrorPage";

// Error Boundary Component
type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

/*
 * ErrorBoundary component to catch JavaScript errors in its child component tree
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("UI Crash:", error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
