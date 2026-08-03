import { NavLink, useLocation } from "react-router";
import * as React from "react";
import { LayoutDashboard, Code, Key, Settings, BookOpen, Info } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/mocks", label: "Mocks", icon: Code },
  { to: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { to: "/dashboard/guide", label: "Guide", icon: BookOpen },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const [helpOpen, setHelpOpen] = React.useState(false);
  const { state } = useSidebar();

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <picture className="flex h-6 w-6 items-center justify-center shrink-0">
              <source type="image/webp" srcSet="/logo-mock3.webp" />
              <img src="/logo-mock3.png" alt="Mock3" className="h-6 w-6" />
            </picture>

            <div
              aria-hidden={state === "collapsed"}
              className={`transition-all overflow-hidden ${state === "collapsed" && "w-0 p-0 m-0  "}`}
            >
              <span
                className={`text-[13px] font-semibold text-sidebar-foreground `}
              >
                Mock3
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
              Navigation
            </SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.to === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.to);

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="data-[active=true]:border-l-2 data-[active=true]:border-accent-blue data-[active=true]:pl-[6px]"
                    >
                      <NavLink to={item.to} end={item.to === "/dashboard"}>
                        <item.icon
                          size={16}
                          className={isActive ? "text-accent-blue" : ""}
                        />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton
            asChild
            className="data-[active=true]:border-l-2 data-[active=true]:border-accent-blue data-[active=true]:pl-[6px]"
          >
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="flex w-full items-center gap-2 rounded-none px-2 py-1.5 text-[12px] text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Info size={14} />
              <span>About Mock3</span>
            </button>
          </SidebarMenuButton>

          <p className="px-2 py-1 text-[10px] text-sidebar-foreground/50">
            Mock3 v0.0.0
          </p>
        </SidebarFooter>
      </Sidebar>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Mock3</DialogTitle>
            <DialogDescription>
              Mock API endpoints in seconds. No backend setup required.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 text-[13px] text-text-secondary leading-relaxed">
            <div>
              <h4 className="mb-1 font-semibold text-text-primary">
                What is Mock3?
              </h4>
              <p>
                Mock3 lets you create instant mock API endpoints accessible via
                API keys. Think "Mockoon as a web service."
              </p>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-text-primary">
                Free Tier
              </h4>
              <p>
                <strong className="text-text-primary">3 mocks</strong> and{" "}
                <strong className="text-text-primary">300 requests/hour</strong>{" "}
                per user.
              </p>
              <p className="mt-1">
                Need more? Check the{" "}
                <a
                  href="/dashboard/guide"
                  onClick={() => setHelpOpen(false)}
                  className="text-accent-blue hover:underline"
                >
                  Guide
                </a>{" "}
                page for full documentation.
              </p>
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-[12px] text-text-muted">
                Version: <span className="text-text-primary">v0.0.0</span>
              </p>
              <p className="text-[12px] text-text-muted">
                License: <span className="text-text-primary">MIT</span>
              </p>
              <p className="text-[12px] text-text-muted">
                Author:{" "}
                <span className="text-text-primary">
                  Alejandro Guzmán Rodríguez
                </span>
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/Alejandro-GR01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-accent-blue hover:underline"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/alejandro-gr01/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-accent-blue hover:underline"
                >
                  LinkedIn
                </a>
              </div>
              <p className="text-[11px] text-text-muted mt-2">
                &copy; {new Date().getFullYear()} Alejandro Guzmán Rodríguez.
                Licensed under MIT.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
