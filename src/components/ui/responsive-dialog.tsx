"use client";

import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

/**
 * A unified modal that renders a centered Dialog on desktop (md and up) and a
 * bottom-anchored Drawer on mobile. The sub-components below mirror the
 * Dialog/Drawer API so a single markup tree adapts to the active form factor.
 *
 * Layout note: place the scrollable body between Header and Footer and give it
 * `flex-1 min-h-0 overflow-y-auto` so the Drawer body scrolls within its
 * max-height while the Footer stays pinned to the bottom.
 */

const ResponsiveDialogContext = React.createContext(false);

function useResponsiveDialog() {
  return React.useContext(ResponsiveDialogContext);
}

interface RootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function ResponsiveDialog({ open, onOpenChange, children }: RootProps) {
  const isMobile = useIsMobile();
  const Root = isMobile ? Drawer : Dialog;
  return (
    <ResponsiveDialogContext.Provider value={isMobile}>
      <Root open={open} onOpenChange={onOpenChange}>
        {children}
      </Root>
    </ResponsiveDialogContext.Provider>
  );
}

interface ContentProps {
  className?: string;
  children?: React.ReactNode;
}

function ResponsiveDialogContent({ className, children }: ContentProps) {
  const isMobile = useResponsiveDialog();
  if (isMobile) {
    return <DrawerContent className={className}>{children}</DrawerContent>;
  }
  return <DialogContent className={className}>{children}</DialogContent>;
}

function ResponsiveDialogHeader(props: React.ComponentProps<"div">) {
  const isMobile = useResponsiveDialog();
  return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
}

function ResponsiveDialogFooter(props: React.ComponentProps<"div">) {
  const isMobile = useResponsiveDialog();
  return isMobile ? <DrawerFooter {...props} /> : <DialogFooter {...props} />;
}

interface TextProps {
  className?: string;
  children?: React.ReactNode;
}

function ResponsiveDialogTitle(props: TextProps) {
  const isMobile = useResponsiveDialog();
  return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
}

function ResponsiveDialogDescription(props: TextProps) {
  const isMobile = useResponsiveDialog();
  return isMobile ? (
    <DrawerDescription {...props} />
  ) : (
    <DialogDescription {...props} />
  );
}

export {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
};
