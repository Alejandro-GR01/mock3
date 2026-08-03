import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { CLERK_PUBLISHABLE_KEY } from "./config/clerk";
import { queryClient } from "./config/queryClient";
import AppRoutes from "./routes";
import { ToastProvider } from "@/contexts/ToastContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { dark } from "@clerk/themes";

function App() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        theme: dark,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ErrorBoundary>
        </ToastProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
