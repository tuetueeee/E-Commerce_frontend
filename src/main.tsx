import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner";

// Simple error boundary using functional component with error state
type ErrorBoundaryProps = {
  children: React.ReactNode;
};

function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      setError(event.error);
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ color: "red" }}>Something went wrong</h1>
        <p style={{ color: "#333" }}>{error.message || "Unknown error"}</p>
        {error.stack && (
          <pre style={{ background: "#f5f5f5", padding: "10px", textAlign: "left", overflow: "auto", maxWidth: "800px", margin: "20px auto" }}>
            {error.stack}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: "20px", padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

// Check if root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  console.log("Starting React app...");
  const root = createRoot(rootElement);
  console.log("Root created, rendering App...");
  root.render(
    <ErrorBoundary children={
      <React.Fragment>
        <App />
        <Toaster position="top-right" richColors />
      </React.Fragment>
    } />
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Failed to render app:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: red;">Failed to load application</h1>
      <p style="color: #333;">${error instanceof Error ? error.message : "Unknown error"}</p>
      <pre style="background: #f5f5f5; padding: 10px; text-align: left; overflow: auto;">${error instanceof Error ? error.stack : String(error)}</pre>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Reload Page</button>
    </div>
  `;
}