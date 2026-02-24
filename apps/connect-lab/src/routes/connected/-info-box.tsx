import { StyleHelper } from "@/helpers/style";
import { Fragment, type ComponentProps, type ReactNode } from "react";

type TProps = {
  label?: ReactNode;
} & ComponentProps<"div">;

export function InfoBox({ children, label, className, ...props }: TProps) {
  return (
    <div
      className={StyleHelper.merge(
        "flex flex-col border border-white/5 rounded-2xl px-4 py-2 backdrop-blur-xs",
        className,
      )}
      {...props}
    >
      {label && (
        <Fragment>
          {typeof label === "object" ? (
            label
          ) : (
            <p className="capitalize text-xs font-medium text-slate-500 font-grotesk whitespace-nowrap">
              {label}
            </p>
          )}
        </Fragment>
      )}

      {typeof children === "object" ? (
        children
      ) : (
        <p className="text-sm font-black text-white font-sans capitalize">
          {children}
        </p>
      )}
    </div>
  );
}
