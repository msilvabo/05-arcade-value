export interface GameMissionLog {
  story: string;
  objective: string;
  controls: {
    key: string;
    action: string;
  }[];
  powerups: {
    name: string;
    color: string;
    description: string;
  }[];
}

export interface GameExtendedDetails {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  version: string;
  releaseYear: number;
  developer: string;
  genre: string;
  maxScore: string;
  recordHolder: string;
  activePlayers: number;
  cabinetNumber: string;
  missionLog: GameMissionLog;
}
