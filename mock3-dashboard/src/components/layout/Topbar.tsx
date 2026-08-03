import { useLocation } from "react-router";
import { UserButton } from "@clerk/clerk-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useMocks, useMockDetail } from "@/api/useMocks";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/mocks": "Mocks",
  "/dashboard/api-keys": "API Keys",
  "/dashboard/settings": "Settings",
  "/dashboard/usage": "Usage",
  "/dashboard/guide": "Guide",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function MockNameSegment({ id }: { id: string }) {
  // Try cached list first (instant if navigated from MockList)
  const { data: mocks } = useMocks();
  const cached = mocks?.find((m) => m.id === id);
  // Fallback to detail query (for direct URL access)
  const { data: detail } = useMockDetail(cached ? undefined : id);
  return <>{cached?.name ?? detail?.name ?? "Mock"}</>;
}

export default function Topbar() {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;
    const isUuid = UUID_RE.test(segment);
    return {
      label: routeLabels[path] ?? (isUuid ? null : segment.charAt(0).toUpperCase() + segment.slice(1)),
      isLast: index === segments.length - 1,
      uuid: isUuid ? segment : null,
    };
  });

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b border-border bg-sidebar px-4 py-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="flex h-7 w-7 items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground data-[state=open]:text-sidebar-foreground" />

        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, i) => (
              <BreadcrumbItem key={crumb.label ?? crumb.uuid ?? i}>
                {i > 0 && <BreadcrumbSeparator />}
                {crumb.isLast ? (
                  <BreadcrumbPage className="text-[13px]">
                    {crumb.uuid ? (
                      <MockNameSegment id={crumb.uuid} />
                    ) : (
                      crumb.label
                    )}
                  </BreadcrumbPage>
                ) : (
                  <span className="text-[13px] text-text-secondary">
                    {crumb.label}
                  </span>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center">
        <UserButton
          afterSignOutUrl="/auth"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-12! h-12! border-2 border-accent-blue",
              userButtonPopoverCard: "bg-bg-sidebar rounded-none border border-border",
              userButtonPopoverActionButton: "text-text-primary hover:bg-bg-editor",
              userButtonPopoverActionButtonIcon: "text-accent-blue",
              userButtonPopoverActionButtonText: "text-text-secondary",
              avatarBox: "h-9! w-9!",
            },
          }}
        />
      </div>
    </header>
  );
}
