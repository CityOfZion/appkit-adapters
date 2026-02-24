import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import Neo3Icon from "@/assets/icons/neo3.svg?react";
import EthereumIcon from "@/assets/icons/ethereum.svg?react";
import ArbitrumIcon from "@/assets/icons/arbitrum.svg?react";
import BaseIcon from "@/assets/icons/base.svg?react";
import NeoxIcon from "@/assets/icons/neox.svg?react";
import PolygonIcon from "@/assets/icons/polygon.svg?react";
import SolanaIcon from "@/assets/icons/solana.svg?react";

const icons = [
  Neo3Icon,
  EthereumIcon,
  ArbitrumIcon,
  BaseIcon,
  NeoxIcon,
  PolygonIcon,
  SolanaIcon,
];

export function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Add a depth property (0 = far, 1 = near)
  const renderIcons = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const depth = Math.random(); // 0 (far) to 1 (near)
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        Icon: icons[Math.floor(Math.random() * icons.length)],
        size: Math.floor(16 + depth * 32),
        opacity: 0.05 + depth * 0.25,
        speed: 1 + depth * 2,
        depth,
      };
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Fragment>
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      >
        {renderIcons.map((item) => {
          // ...existing position logic...
          const iconGlobalX =
            (item.x / 100) *
            (typeof window !== "undefined" ? window.innerWidth : 1000);
          const iconGlobalY =
            (item.y / 100) *
            (typeof window !== "undefined" ? window.innerHeight : 1000);

          const dx = mousePos.x - iconGlobalX;
          const dy = mousePos.y - iconGlobalY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Depth-based movement: farther = less movement
          const radius = 250 * (0.5 + item.depth); // closer icons have larger radius
          const strength = 40 * (0.5 + item.depth); // closer icons move more
          let translateX = 0;
          let translateY = 0;

          if (distance < radius) {
            const ratio = (radius - distance) / radius;
            translateX = (dx / distance) * -strength * ratio;
            translateY = (dy / distance) * -strength * ratio;
          }

          // Optional: add blur for far icons
          const blur = 6 * (1 - item.depth);

          return (
            <div
              key={item.id}
              className="absolute transition-transform duration-300 ease-out text-primary/30"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                opacity: item.opacity,
                filter: `blur(${blur}px)`,
                transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${translateX * 0.5}deg)`,
                zIndex: Math.floor(item.depth * 10), // closer icons above
              }}
            >
              <item.Icon style={{ width: item.size, height: item.size }} />
            </div>
          );
        })}
      </div>

      {/* <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse transition-all duration-[4s]" />
      </div> */}
    </Fragment>
  );
}
