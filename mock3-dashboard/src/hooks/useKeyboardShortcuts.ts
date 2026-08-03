import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlOrMeta?: boolean;
  handler: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const modMatch = shortcut.ctrlOrMeta
          ? e.metaKey || e.ctrlKey
          : !e.metaKey && !e.ctrlKey;

        if (keyMatch && modMatch) {
          if (
            !(
              e.target instanceof HTMLInputElement ||
              e.target instanceof HTMLTextAreaElement ||
              e.target instanceof HTMLSelectElement || 
              (e.target as HTMLElement)?.isContentEditable
            )
          ) {
            e.preventDefault();
            shortcut.handler();
            return;
          }
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
