import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest py-space-lg shadow-[0_-4px_20px_rgba(0,0,0,0.6)] relative z-20">
      <div className="w-full px-space-lg lg:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md text-left">
          <div className="w-3 h-3 bg-secondary-container rounded-sm shadow-[0_0_8px_rgba(255,77,128,0.8)] shrink-0" />
          <div>
            <p className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
              © 1984-2025 ARCADE VAULT CORP. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <p className="font-label-sm text-label-sm text-tertiary-fixed tracking-widest uppercase">
              INSERT COIN TO CONTINUE // NODO CENTRAL: ONLINE // CANAL CH-01
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-lg shrink-0 flex-wrap justify-center">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-primary-fixed" />
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              LATENCIA: 12MS
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed" />
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              POTENCIA: 100%
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-secondary-container" />
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              CABINAS: 48/50
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
