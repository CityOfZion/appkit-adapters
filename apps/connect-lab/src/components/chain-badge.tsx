import { ChainHelper, type TSupportedChain } from "@/helpers/chain";
import { StyleHelper } from "@/helpers/style";

type TProps = {
  chain: TSupportedChain;
};

export function ChainBadge({ chain }: TProps) {
  const color = ChainHelper.colorsByChain[chain];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-sm group hover:border-blue-500/30 transition-all duration-300">
      <div
        className={StyleHelper.merge(
          "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all",
          color,
        )}
      />

      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors font-brand">
        {chain}
      </span>
    </div>
  );
}
