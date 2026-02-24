import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StyleHelper } from "@/helpers/style";

function Root({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function Trigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function Portal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function Close({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" asChild {...props}>
      <Button variant="ghost" size="icon">
        <X />
        <span className="sr-only">Close</span>
      </Button>
    </DialogPrimitive.Close>
  );
}

function Overlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={StyleHelper.merge(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-md",
        className,
      )}
      {...props}
    />
  );
}

function Content({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <Portal data-slot="dialog-portal">
      <Overlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={StyleHelper.merge(
          "bg-slate-900 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%]  rounded-4xl border border-slate-700/50 shadow-[0_0_100px_rgba(37,99,235,0.2)] duration-200 outline-none sm:max-w-lg items-center flex flex-col w-full overflow-hidden",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </Portal>
  );
}

function Body({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={StyleHelper.merge(
        "flex flex-col gap-4 p-10 w-full",
        className,
      )}
      {...props}
    />
  );
}

function Header({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={StyleHelper.merge(
        "flex flex-col gap-2 bg-slate-950/20 p-10 relative border border-slate-700/50",
        className,
      )}
      {...props}
    />
  );
}

function Footer({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={StyleHelper.merge(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function Title({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={StyleHelper.merge(
        "text-3xl font-black text-white font-grotesk tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function Description({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={StyleHelper.merge(
        "text-slate-400 font-sans text-base max-w-xs mx-auto leading-relaxed text-center",
        className,
      )}
      {...props}
    />
  );
}

export const Dialog = {
  Root,
  Close,
  Content,
  Description,
  Footer,
  Header,
  Overlay,
  Portal,
  Title,
  Trigger,
  Body,
};
