import { FC } from "react";
import { Game } from "@/types/game";

interface GameArtworkProps {
  artType: Game["artType"];
  title: string;
}

export const GameArtwork: FC<GameArtworkProps> = ({ artType, title }) => {
  switch (artType) {
    case "arkanoid":
      return (
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 320 180"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={title}
        >
          <rect fill="#0d0d16" height="180" width="320" />
          <g fill="#ff4d80">
            <rect height="10" rx="1" width="28" x="40" y="25" />
            <rect height="10" rx="1" width="28" x="72" y="25" />
            <rect height="10" rx="1" width="28" x="104" y="25" />
            <rect height="10" rx="1" width="28" x="136" y="25" />
            <rect height="10" rx="1" width="28" x="168" y="25" />
            <rect height="10" rx="1" width="28" x="200" y="25" />
            <rect height="10" rx="1" width="28" x="232" y="25" />
            <rect height="10" rx="1" width="28" x="264" y="25" />
          </g>
          <g fill="#00f5ff">
            <rect height="10" rx="1" width="28" x="40" y="38" />
            <rect height="10" rx="1" width="28" x="72" y="38" />
            <rect height="10" rx="1" width="28" x="104" y="38" />
            <rect height="10" rx="1" width="28" x="136" y="38" />
            <rect height="10" rx="1" width="28" x="168" y="38" />
            <rect height="10" rx="1" width="28" x="200" y="38" />
            <rect height="10" rx="1" width="28" x="232" y="38" />
            <rect height="10" rx="1" width="28" x="264" y="38" />
          </g>
          <g fill="#dee700">
            <rect height="10" rx="1" width="28" x="72" y="51" />
            <rect height="10" rx="1" width="28" x="104" y="51" />
            <rect height="10" rx="1" width="28" x="168" y="51" />
            <rect height="10" rx="1" width="28" x="200" y="51" />
          </g>
          <circle cx="160" cy="115" fill="#ffffff" filter="drop-shadow(0 0 6px #00f5ff)" r="5" />
          <line
            stroke="#00f5ff"
            strokeDasharray="3 3"
            strokeWidth="1.5"
            x1="160"
            x2="160"
            y1="120"
            y2="155"
          />
          <rect
            fill="#e9feff"
            filter="drop-shadow(0 0 8px #00f5ff)"
            height="8"
            rx="3"
            width="70"
            x="125"
            y="158"
          />
          <rect fill="#ff4d80" height="2" width="30" x="145" y="156" />
        </svg>
      );

    case "tetris":
      return (
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 320 180"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={title}
        >
          <rect fill="#0d0d16" height="180" width="320" />
          <g opacity="0.15" stroke="#849495" strokeWidth="0.5">
            <line x1="90" x2="90" y1="10" y2="170" />
            <line x1="110" x2="110" y1="10" y2="170" />
            <line x1="130" x2="130" y1="10" y2="170" />
            <line x1="150" x2="150" y1="10" y2="170" />
            <line x1="170" x2="170" y1="10" y2="170" />
            <line x1="190" x2="190" y1="10" y2="170" />
            <line x1="210" x2="210" y1="10" y2="170" />
            <line x1="230" x2="230" y1="10" y2="170" />
          </g>
          <g fill="#00f5ff" filter="drop-shadow(0 0 6px #00f5ff)">
            <rect height="18" rx="1" width="18" x="130" y="30" />
            <rect height="18" rx="1" width="18" x="149" y="30" />
            <rect height="18" rx="1" width="18" x="168" y="30" />
            <rect height="18" rx="1" width="18" x="187" y="30" />
          </g>
          <g fill="#ff4d80" filter="drop-shadow(0 0 6px #ff4d80)">
            <rect height="18" rx="1" width="18" x="111" y="90" />
            <rect height="18" rx="1" width="18" x="130" y="90" />
            <rect height="18" rx="1" width="18" x="149" y="90" />
            <rect height="18" rx="1" width="18" x="130" y="71" />
          </g>
          <g fill="#dee700">
            <rect height="18" rx="1" width="18" x="91" y="150" />
            <rect height="18" rx="1" width="18" x="110" y="150" />
            <rect height="18" rx="1" width="18" x="129" y="150" />
            <rect height="18" rx="1" width="18" x="167" y="150" />
            <rect height="18" rx="1" width="18" x="186" y="150" />
            <rect height="18" rx="1" width="18" x="205" y="150" />
          </g>
        </svg>
      );

    case "space-invaders":
      return (
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 320 180"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={title}
        >
          <rect fill="#0d0d16" height="180" width="320" />
          <circle cx="20" cy="40" fill="#fff" r="1" />
          <circle cx="80" cy="90" fill="#fff" r="1" />
          <circle cx="280" cy="30" fill="#fff" r="1" />
          <circle cx="240" cy="120" fill="#fff" r="1" />
          <g fill="#ff4d80" filter="drop-shadow(0 0 6px #ff4d80)">
            <path d="M 60,35 h 20 v 4 h -4 v 4 h 8 v 8 h -4 v -4 h -16 v 4 h -4 v -8 h 8 v -4 h -4 z" />
            <path d="M 150,35 h 20 v 4 h -4 v 4 h 8 v 8 h -4 v -4 h -16 v 4 h -4 v -8 h 8 v -4 h -4 z" />
            <path d="M 240,35 h 20 v 4 h -4 v 4 h 8 v 8 h -4 v -4 h -16 v 4 h -4 v -8 h 8 v -4 h -4 z" />
          </g>
          <g fill="#00f5ff" filter="drop-shadow(0 0 6px #00f5ff)">
            <path d="M 105,65 h 20 v 4 h -4 v 4 h 8 v 8 h -4 v -4 h -16 v 4 h -4 v -8 h 8 v -4 h -4 z" />
            <path d="M 195,65 h 20 v 4 h -4 v 4 h 8 v 8 h -4 v -4 h -16 v 4 h -4 v -8 h 8 v -4 h -4 z" />
          </g>
          <rect
            fill="#dee700"
            filter="drop-shadow(0 0 4px #dee700)"
            height="12"
            width="4"
            x="158"
            y="110"
          />
          <path
            d="M 148,162 h 24 v -4 h -8 v -6 h -8 v 6 h -8 z"
            fill="#00f5ff"
            filter="drop-shadow(0 0 8px #00f5ff)"
          />
        </svg>
      );

    case "pacman":
      return (
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 320 180"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={title}
        >
          <rect fill="#0d0d16" height="180" width="320" />
          <g fill="none" opacity="0.85" stroke="#00dce5" strokeLinecap="round" strokeWidth="4">
            <path d="M 40,30 H 280 V 150 H 40 Z" />
            <path d="M 90,60 H 130 V 100" />
            <path d="M 190,60 H 230 V 100" />
            <path d="M 160,30 V 80" />
            <path d="M 130,120 H 190" />
          </g>
          <circle cx="65" cy="55" fill="#dee700" filter="drop-shadow(0 0 4px #dee700)" r="4" />
          <circle cx="100" cy="135" fill="#fff" r="2.5" />
          <circle cx="120" cy="135" fill="#fff" r="2.5" />
          <circle cx="140" cy="135" fill="#fff" r="2.5" />
          <circle cx="160" cy="135" fill="#fff" r="2.5" />
          <path
            d="M 190,135 L 205,124 A 12 12 0 1 0 205,146 Z"
            fill="#dee700"
            filter="drop-shadow(0 0 8px #dee700)"
          />
          <path
            d="M 230,125 Q 238,115 246,125 V 142 L 243,138 L 238,142 L 233,138 L 230,142 Z"
            fill="#ff4d80"
            filter="drop-shadow(0 0 8px #ff4d80)"
          />
          <circle cx="235" cy="126" fill="#fff" r="2" />
          <circle cx="241" cy="126" fill="#fff" r="2" />
        </svg>
      );

    case "snake":
      return (
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 320 180"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={title}
        >
          <rect fill="#0d0d16" height="180" width="320" />
          <g opacity="0.3" stroke="#3a494a" strokeWidth="0.7">
            <line x1="0" x2="320" y1="30" y2="30" />
            <line x1="0" x2="320" y1="60" y2="60" />
            <line x1="0" x2="320" y1="90" y2="90" />
            <line x1="0" x2="320" y1="120" y2="120" />
            <line x1="0" x2="320" y1="150" y2="150" />
          </g>
          <g fill="#00dce5" filter="drop-shadow(0 0 6px #00f5ff)">
            <rect height="16" rx="2" width="16" x="70" y="90" />
            <rect height="16" rx="2" width="16" x="88" y="90" />
            <rect height="16" rx="2" width="16" x="106" y="90" />
            <rect height="16" rx="2" width="16" x="124" y="90" />
            <rect height="16" rx="2" width="16" x="142" y="90" />
            <rect height="16" rx="2" width="16" x="142" y="72" />
            <rect height="16" rx="2" width="16" x="142" y="54" />
            <rect height="16" rx="2" width="16" x="160" y="54" />
            <rect height="16" rx="2" width="16" x="178" y="54" />
            <rect fill="#63f7ff" height="16" rx="4" width="16" x="196" y="54" />
          </g>
          <circle cx="250" cy="62" fill="#ff4d80" filter="drop-shadow(0 0 8px #ff4d80)" r="7" />
          <circle cx="250" cy="62" fill="#ffffff" r="3" />
        </svg>
      );

    case "asteroids":
      return (
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 320 180"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={title}
        >
          <rect fill="#0d0d16" height="180" width="320" />
          <polygon
            fill="none"
            filter="drop-shadow(0 0 5px #00f5ff)"
            points="60,30 90,20 110,40 100,70 70,80 50,60"
            stroke="#e9feff"
            strokeWidth="2"
          />
          <polygon
            fill="none"
            filter="drop-shadow(0 0 5px #00f5ff)"
            points="220,110 245,95 270,115 260,140 230,145 210,130"
            stroke="#e9feff"
            strokeWidth="2"
          />
          <polygon
            fill="none"
            points="240,30 260,20 275,35 265,55 245,50"
            stroke="#ff4d80"
            strokeWidth="1.5"
          />
          <polygon
            fill="none"
            filter="drop-shadow(0 0 8px #dee700)"
            points="160,85 175,115 160,105 145,115"
            stroke="#dee700"
            strokeWidth="2.5"
          />
          <line
            filter="drop-shadow(0 0 4px #00f5ff)"
            stroke="#00f5ff"
            strokeDasharray="8 4"
            strokeWidth="2"
            x1="160"
            x2="160"
            y1="80"
            y2="35"
          />
        </svg>
      );

    default:
      return <div className="w-full h-full bg-surface-container-lowest" />;
  }
};
