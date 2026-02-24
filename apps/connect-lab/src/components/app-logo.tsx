import { StyleHelper } from "@/helpers/style";
import { useEffect, useState, type ComponentProps } from "react";

import AppLogo from "@/assets/icons/app-logo.svg?react";

export function AnimatedAppLogo({
  className,
  ...props
}: ComponentProps<"div">) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={StyleHelper.merge(
        "flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-20 duration-500",
        {
          "animate-float": mounted,
        },
        className,
      )}
      {...props}
    >
      <div className="relative group scale-125">
        <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 animate-pulse animate-orbit" />
        <div
          className="absolute inset-0 bg-indigo-600 blur-2xl opacity-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="absolute -inset-3 rounded-[3rem] border border-blue-500/20 animate-energy" />

        <AppLogo className="size-32 max-sm:size-24 relative z-10" />

        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-transparent via-white/5 to-transparent rounded-[2.5rem] max-sm:rounded-4xl pointer-events-none" />
      </div>
    </div>
  );
}
