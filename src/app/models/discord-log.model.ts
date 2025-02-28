export interface DiscordLog {
  id: number;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  details?: string;
}

export interface BotStatus {
  isOnline: boolean;
  lastStartTime?: Date;
  lastStopTime?: Date;
  version?: string;
  uptime?: number; // en secondes
  connectedServers?: number;
  activeUsers?: number;
} 