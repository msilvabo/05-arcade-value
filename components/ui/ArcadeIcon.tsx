import { FC, SVGProps } from "react";

export type ArcadeIconName =
  | "videogame_asset"
  | "person"
  | "toll"
  | "military_tech"
  | "emoji_events"
  | "search"
  | "sort"
  | "sports_esports"
  | "tune"
  | "close"
  | "search_off";

interface ArcadeIconProps extends SVGProps<SVGSVGElement> {
  name: ArcadeIconName;
  className?: string;
  size?: number | string;
}

export const ArcadeIcon: FC<ArcadeIconProps> = ({
  name,
  className = "w-5 h-5",
  size,
  ...props
}) => {
  const style = size ? { width: size, height: size } : undefined;

  switch (name) {
    case "videogame_asset":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      );

    case "person":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );

    case "toll":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M15 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM3 12c0-2.61 1.28-4.93 3.23-6.37l-1.42-1.42C2.33 6.25 1 8.97 1 12s1.33 5.75 3.81 7.79l1.42-1.42C4.28 16.93 3 14.61 3 12z" />
        </svg>
      );

    case "military_tech":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M17 10.43V2H7v8.43c0 .35.18.68.49.86l4.51 2.71 4.51-2.71c.31-.18.49-.51.49-.86zM9 9.61V4h6v5.61l-3 1.8-3-1.8zM12 14c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z" />
        </svg>
      );

    case "emoji_events":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
      );

    case "search":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      );

    case "sort":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
        </svg>
      );

    case "sports_esports":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2 3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      );

    case "tune":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
        </svg>
      );

    case "close":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      );

    case "search_off":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden="true"
          {...props}
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      );

    default:
      return null;
  }
};
