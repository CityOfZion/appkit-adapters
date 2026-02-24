import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";

type TProps = {
  name: string;
  docUrl?: string;
  description: string;
  onPlay?: () => void;
};

export function MethodCard({ name, docUrl, description, onPlay }: TProps) {
  return (
    <div className="relative flex flex-col p-4 gap-2 items-start rounded-2xl transition-all duration-300 border border-white/5 backdrop-blur-xs h-full">
      <p className="font-black capitalize font-sans text-sm text-white  truncate">
        {name}
      </p>

      <p className="text-[0.625rem] tracking-wider font-bold text-slate-500">
        {description}
      </p>

      <div className="flex gap-1 w-full mt-auto">
        <Button size="sm" className="grow" variant="default" onClick={onPlay}>
          Execute
        </Button>

        {docUrl && (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button size="icon-sm" variant="outline">
                <BookOpen className="size-4" />
              </Button>
            </Tooltip.Trigger>

            <Tooltip.Content>
              <span>View documentation</span>
            </Tooltip.Content>
          </Tooltip.Root>
        )}
      </div>
    </div>
  );
}
