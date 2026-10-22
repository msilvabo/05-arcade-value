import { FC } from "react";
import { HOME_FEATURES } from "@/data/activity";
import { NeonColor } from "@/types/activity";

interface FeatureIconProps {
  kind: "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET";
  colorClass: string;
}

const FeatureIcon: FC<FeatureIconProps> = ({ kind, colorClass }) => {
  const C = "currentColor";
  if (kind === "GAMEPAD") {
    return (
      <svg className={`w-11 h-11 ${colorClass}`} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <g fill={C}>
          <rect x="2" y="6" width="12" height="6" />
          <rect x="0" y="8" width="2" height="4" />
          <rect x="14" y="8" width="2" height="4" />
          <rect x="3" y="8" width="2" height="2" />
          <rect x="2" y="9" width="4" height="0.5" />
          <rect x="11" y="7" width="1.5" height="1.5" />
          <rect x="11" y="10" width="1.5" height="1.5" />
        </g>
      </svg>
    );
  }
  if (kind === "FREE") {
    return (
      <svg className={`w-11 h-11 ${colorClass}`} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <g fill={C}>
          <rect x="3" y="3" width="10" height="10" fill="none" stroke={C} strokeWidth="1.5" />
          <rect x="5" y="6" width="1.5" height="4" />
          <rect x="5" y="6" width="4" height="1.5" />
          <rect x="5" y="8" width="3" height="1" />
          <rect x="10" y="6" width="1.5" height="4" />
        </g>
      </svg>
    );
  }
  if (kind === "TROPHY") {
    return (
      <svg className={`w-11 h-11 ${colorClass}`} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <g fill={C}>
          <rect x="3" y="2" width="10" height="2" />
          <rect x="3" y="2" width="2" height="6" />
          <rect x="11" y="2" width="2" height="6" />
          <rect x="5" y="8" width="6" height="2" />
          <rect x="7" y="10" width="2" height="3" />
          <rect x="5" y="13" width="6" height="1.5" />
          <rect x="1" y="3" width="2" height="3" />
          <rect x="13" y="3" width="2" height="3" />
        </g>
      </svg>
    );
  }
  if (kind === "ROCKET") {
    return (
      <svg className={`w-11 h-11 ${colorClass}`} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <g fill={C}>
          <rect x="7" y="1" width="2" height="2" />
          <rect x="6" y="3" width="4" height="2" />
          <rect x="5" y="5" width="6" height="6" />
          <rect x="4" y="11" width="2" height="2" />
          <rect x="10" y="11" width="2" height="2" />
          <rect x="7" y="6" width="2" height="2" fill="#0a0a0f" />
          <rect x="6" y="13" width="1" height="2" />
          <rect x="9" y="13" width="1" height="2" />
        </g>
      </svg>
    );
  }
  return null;
};

const getColorStyles = (color: NeonColor) => {
  switch (color) {
    case "cyan":
      return {
        text: "text-[#00f5ff]",
        borderHover: "hover:border-[#00f5ff]",
        shadowHover: "hover:shadow-[0_12px_30px_rgba(0,245,255,0.25)]",
        glow: "drop-shadow-[0_0_8px_rgba(0,245,255,0.7)]",
      };
    case "yellow":
      return {
        text: "text-[#f5ff00]",
        borderHover: "hover:border-[#f5ff00]",
        shadowHover: "hover:shadow-[0_12px_30px_rgba(245,255,0,0.25)]",
        glow: "drop-shadow-[0_0_8px_rgba(245,255,0,0.7)]",
      };
    case "magenta":
      return {
        text: "text-[#ff006e]",
        borderHover: "hover:border-[#ff006e]",
        shadowHover: "hover:shadow-[0_12px_30px_rgba(255,0,110,0.25)]",
        glow: "drop-shadow-[0_0_8px_rgba(255,0,110,0.7)]",
      };
    case "green":
    default:
      return {
        text: "text-[#00ff88]",
        borderHover: "hover:border-[#00ff88]",
        shadowHover: "hover:shadow-[0_12px_30px_rgba(0,255,136,0.25)]",
        glow: "drop-shadow-[0_0_8px_rgba(0,255,136,0.7)]",
      };
  }
};

export const FeaturesSection: FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 reveal">
      {/* Section Head */}
      <div className="flex items-center gap-4 mb-10">
        <div className="font-mono text-xs tracking-[0.22em] text-[#ff006e] font-bold">
          {"//"} 01
        </div>
        <h2 className="font-mono text-xl sm:text-2xl md:text-3xl tracking-wider text-white font-black uppercase">
          ¿POR QUÉ ARCADE VAULT?
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-outline-variant/60 to-transparent" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {HOME_FEATURES.map((feature, idx) => {
          const colorStyles = getColorStyles(feature.color);
          return (
            <div
              key={feature.id}
              style={{ transitionDelay: `${idx * 80}ms` }}
              className={`p-6 rounded bg-gradient-to-b from-surface-container to-surface-container-low border border-outline-variant/30 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1.5 ${colorStyles.borderHover} ${colorStyles.shadowHover}`}
            >
              <div className={colorStyles.glow}>
                <FeatureIcon kind={feature.icon} colorClass={colorStyles.text} />
              </div>
              <div className={`font-mono text-xs tracking-wider uppercase font-bold ${colorStyles.text}`}>
                {feature.title}
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
