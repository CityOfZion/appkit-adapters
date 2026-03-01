import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { StyleHelper } from "@/helpers/style";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={StyleHelper.merge(
        "flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest font-mono leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ml-1",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
