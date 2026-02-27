import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

type TProps = {
  content: any;
};

export function CopyButton({ content }: TProps) {
  const [hasCopied, setHasCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }

  return (
    <Button
      className="absolute top-4 right-4"
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
    >
      <span className="relative">
        <Check
          className={`size-4 absolute transition-opacity duration-300 ${
            hasCopied ? "opacity-100" : "opacity-0"
          }`}
        />

        <Copy
          className={`size-4 transition-opacity duration-300 ${
            hasCopied ? "opacity-0" : "opacity-100"
          }`}
        />
      </span>
    </Button>
  );
}
