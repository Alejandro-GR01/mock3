import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSectionProps {
  user:
    | {
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        imageUrl?: string | null;
      }
    | undefined;
  isLoading: boolean;
}

export default function ProfileSection({ user, isLoading }: ProfileSectionProps) {
  const [imgError, setImgError] = useState(false);
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const email = user?.email;
  const imageUrl = user?.imageUrl;

  const initial = (firstName ?? email ?? "?").charAt(0).toUpperCase();
  const displayName =
    firstName || lastName
      ? [firstName, lastName].filter(Boolean).join(" ")
      : (email ?? "");

  const showImage = Boolean(imageUrl) && !imgError;

  if (isLoading) {
    return (
      <Card className="rounded-none border-border-strong bg-card shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-border" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-24 animate-pulse bg-border" />
              <div className="h-3 w-40 animate-pulse bg-border" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none border-border-strong bg-card shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {showImage ? (
            <img
              src={imageUrl ?? undefined}
              alt={displayName}
              onError={() => setImgError(true)}
              className="h-12 w-12 rounded-full border border-border-strong object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-bg-terminal">
              <span className="text-text-secondary font-semibold">{initial}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-text-primary">
              {displayName}
            </p>
            {email && (
              <p className="mt-0.5 truncate text-[13px] text-text-secondary">
                {email}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
