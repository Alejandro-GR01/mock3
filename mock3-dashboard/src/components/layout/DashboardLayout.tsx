import { useState } from "react";
import { Outlet } from "react-router";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Topbar from "./Topbar";
import CommandPalette from "@/components/command-palette/CommandPalette";
import PaywallModal from "@/components/paywall/PaywallModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useConnectionStore } from "@/stores/connection.store";
import { useUIStore } from "@/stores/ui.store";
import OfflineState from "@/components/OfflineState";
import { queryClient } from "@/config/queryClient";

export default function DashboardLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const isOffline = useConnectionStore((s) => s.isOffline);
  const paywallOpen = useUIStore((s) => s.paywallOpen);
  const closePaywall = useUIStore((s) => s.closePaywall);

  useKeyboardShortcuts([
    {
      key: "k",
      ctrlOrMeta: true,
      handler: () => setCommandPaletteOpen(true),
    },
  ]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          {isOffline ? (
            <OfflineState
              onRetry={() => {
                useConnectionStore.getState().setOffline(false);
                queryClient.invalidateQueries();
              }}
            />
          ) : (
            <Outlet />
          )}
        </main>
      </SidebarInset>
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
      <PaywallModal open={paywallOpen} onClose={closePaywall} />
    </SidebarProvider>
  );
}
