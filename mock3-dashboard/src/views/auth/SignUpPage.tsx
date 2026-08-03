import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-terminal">
      <div className="w-full max-w-md flex flex-col items-center  ">
        <div className="mb-8 text-center">
          <picture>
            <source type="image/webp" srcSet="/logo-mock3.webp" />
            <img
              src="/logo-mock3.png"
              alt="Mock3 Logo"
              className="mx-auto h-12 w-auto"
            />
          </picture>
          <h1 className="text-2xl font-semibold text-text-primary">Mock3</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Instant mock API endpoints
          </p>
        </div>
        <SignUp fallbackRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
