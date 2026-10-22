import { FC } from "react";

export const ArcadeLogo: FC<{ className?: string }> = ({
  className = "h-8 w-auto",
}) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]`}
      aria-label="ARCADE VAULT Logo"
    >
      {/* Outer cabinet frame */}
      <path
        d="M8 36L6 10L10 4H30L34 10L32 36H8Z"
        fill="#0e0e13"
        stroke="#00f5ff"
        strokeWidth="1.5"
      />
      {/* Marquee header */}
      <path
        d="M9 11L11 5H29L31 11H9Z"
        fill="#002021"
        stroke="#00f5ff"
        strokeWidth="1"
      />
      {/* Marquee neon light */}
      <rect x="13" y="7" width="14" height="2" rx="1" fill="#63f7ff" />
      {/* CRT Screen housing */}
      <rect
        x="9"
        y="13"
        width="22"
        height="14"
        rx="2"
        fill="#131318"
        stroke="#00dce5"
        strokeWidth="1"
      />
      {/* Pixel vector content on screen */}
      <rect x="13" y="16" width="4" height="3" fill="#ff4d80" />
      <rect x="19" y="16" width="4" height="3" fill="#00f5ff" />
      <rect x="25" y="16" width="3" height="3" fill="#dee700" />
      <circle cx="20" cy="22" r="1.5" fill="#ffffff" />
      <rect x="16" y="24" width="8" height="1.5" rx="0.5" fill="#00f5ff" />
      {/* Control panel deck */}
      <path
        d="M7 28L6 31H34L33 28H7Z"
        fill="#1f1f25"
        stroke="#00f5ff"
        strokeWidth="1"
      />
      {/* Joystick & buttons */}
      <circle cx="12" cy="29.5" r="1" fill="#ff4d80" />
      <circle cx="26" cy="29.5" r="0.75" fill="#dee700" />
      <circle cx="29" cy="29.5" r="0.75" fill="#00f5ff" />
      {/* Coin door */}
      <rect
        x="15"
        y="32"
        width="10"
        height="3"
        rx="0.5"
        fill="#0e0e13"
        stroke="#3a494a"
        strokeWidth="0.8"
      />
      <rect x="17" y="33" width="2" height="1" fill="#dee700" />
      <rect x="21" y="33" width="2" height="1" fill="#dee700" />
    </svg>
  );
};
