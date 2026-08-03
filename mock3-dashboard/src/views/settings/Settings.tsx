import { useUser } from "@clerk/clerk-react";
import { useMe } from "@/api/useMe";
import { useCurrentUsage } from "@/api/useUsage";
import { useMocks } from "@/api/useMocks";
import ProfileSection from "@/components/settings/ProfileSection";
import PlanSection from "@/components/settings/PlanSection";
import DangerZoneSection from "@/components/settings/DangerZoneSection";

export default function Settings() {
  const { data: me, isLoading: meLoading } = useMe();
  const { data: current, isLoading: usageLoading } = useCurrentUsage();
  const { data: mocks, isLoading: mocksLoading } = useMocks();
  const { user, isLoaded } = useUser();

  const sectionLoading = meLoading || usageLoading || mocksLoading;

  return (
    <div>
      <h1 className="text-[24px] font-semibold text-text-primary">Settings</h1>
      <p className="mt-1 text-[13px] text-text-secondary">
        Manage your account, plan and usage limits.
      </p>

      <div className="mt-6 space-y-6">
        <ProfileSection
          user={{
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.primaryEmailAddress?.emailAddress,
            imageUrl: user?.imageUrl,
          }}
          isLoading={!isLoaded}
        />
        <PlanSection
          me={me}
          requestsUsage={current}
          mocksUsage={{
            used: mocks?.length ?? 0,
            max: me?.maxSlots ?? 3,
          }}
          isLoading={sectionLoading}
        />
        <DangerZoneSection />
      </div>
    </div>
  );
}
