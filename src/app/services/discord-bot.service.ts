import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { DiscordLog, BotStatus } from '../models/discord-log.model';

@Injectable({
  providedIn: 'root'
})
export class DiscordBotService {
  private apiUrl = 'api/discord'; // URL de l'API à remplacer par la vraie URL
  
  // Signaux pour l'état réactif
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);
  public botStatus = signal<BotStatus>({ isOnline: false });
  
  // Données mockées pour le développement
  private mockLogs: DiscordLog[] = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 3600000), // 1 heure avant
      level: 'info',
      message: 'Bot démarré avec succès',
      source: 'system'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3000000), // 50 minutes avant
      level: 'info',
      message: 'Connexion établie avec le serveur Discord',
      source: 'connection'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 2400000), // 40 minutes avant
      level: 'warning',
      message: 'Latence élevée détectée',
      source: 'network',
      details: 'Latence: 350ms'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 1800000), // 30 minutes avant
      level: 'error',
      message: 'Échec de la commande !help',
      source: 'command',
      details: 'Erreur: Permission manquante'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1200000), // 20 minutes avant
      level: 'info',
      message: 'Utilisateur rejoint le serveur',
      source: 'event',
      details: 'Utilisateur: Jean Dupont'
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 600000), // 10 minutes avant
      level: 'debug',
      message: 'Traitement de la file de messages',
      source: 'queue',
      details: '15 messages en attente'
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 300000), // 5 minutes avant
      level: 'info',
      message: 'Commande !ressources exécutée',
      source: 'command',
      details: 'Utilisateur: Marie Martin'
    },
    {
      id: 8,
      timestamp: new Date(Date.now() - 60000), // 1 minute avant
      level: 'info',
      message: 'Mise à jour des statistiques',
      source: 'system'
    }
  ];

  private mockStatus: BotStatus = {
    isOnline: true,
    lastStartTime: new Date(Date.now() - 3600000), // 1 heure avant
    version: '1.2.3',
    uptime: 3600, // 1 heure en secondes
    connectedServers: 3,
    activeUsers: 120
  };

  constructor(private http: HttpClient) {
    // Initialiser le statut du bot
    this.refreshBotStatus();
  }

  /**
   * Récupère les logs du bot Discord
   * @param limit Nombre maximum de logs à récupérer
   * @param offset Décalage pour la pagination
   * @param level Filtre par niveau de log
   * @returns Observable avec les logs
   */
  getLogs(limit: number = 50, offset: number = 0, level?: 'info' | 'warning' | 'error' | 'debug'): Observable<DiscordLog[]> {
    this.isLoading.set(true);
    this.error.set(null);
    
    // En environnement de production, utiliser l'API réelle
    // return this.http.get<DiscordLog[]>(`${this.apiUrl}/logs?limit=${limit}&offset=${offset}${level ? `&level=${level}` : ''}`)
    
    // Pour le développement, utiliser des données mockées
    return of(this.mockLogs
      .filter(log => !level || log.level === level)
      .slice(offset, offset + limit)
    ).pipe(
      delay(800), // Simuler un délai réseau
      tap(() => this.isLoading.set(false)),
      catchError(error => {
        this.isLoading.set(false);
        this.error.set('Erreur lors du chargement des logs');
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère le statut actuel du bot Discord
   * @returns Observable avec le statut du bot
   */
  getBotStatus(): Observable<BotStatus> {
    // En environnement de production, utiliser l'API réelle
    // return this.http.get<BotStatus>(`${this.apiUrl}/status`)
    
    // Pour le développement, utiliser des données mockées
    return of(this.mockStatus).pipe(
      delay(500), // Simuler un délai réseau
      tap(status => this.botStatus.set(status)),
      catchError(error => {
        this.error.set('Erreur lors de la récupération du statut du bot');
        return throwError(() => error);
      })
    );
  }

  /**
   * Démarre le bot Discord
   * @returns Observable avec le nouveau statut
   */
  startBot(): Observable<BotStatus> {
    this.isLoading.set(true);
    this.error.set(null);
    
    // En environnement de production, utiliser l'API réelle
    // return this.http.post<BotStatus>(`${this.apiUrl}/start`, {})
    
    // Pour le développement, simuler le démarrage
    return of({
      ...this.mockStatus,
      isOnline: true,
      lastStartTime: new Date(),
      uptime: 0
    }).pipe(
      delay(2000), // Simuler un délai de démarrage
      tap(status => {
        this.mockStatus = status;
        this.botStatus.set(status);
        this.isLoading.set(false);
        
        // Ajouter un log de démarrage
        this.mockLogs.unshift({
          id: this.mockLogs.length + 1,
          timestamp: new Date(),
          level: 'info',
          message: 'Bot démarré manuellement',
          source: 'system'
        });
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.error.set('Erreur lors du démarrage du bot');
        return throwError(() => error);
      })
    );
  }

  /**
   * Arrête le bot Discord
   * @returns Observable avec le nouveau statut
   */
  stopBot(): Observable<BotStatus> {
    this.isLoading.set(true);
    this.error.set(null);
    
    // En environnement de production, utiliser l'API réelle
    // return this.http.post<BotStatus>(`${this.apiUrl}/stop`, {})
    
    // Pour le développement, simuler l'arrêt
    return of({
      ...this.mockStatus,
      isOnline: false,
      lastStopTime: new Date(),
      uptime: 0
    }).pipe(
      delay(1500), // Simuler un délai d'arrêt
      tap(status => {
        this.mockStatus = status;
        this.botStatus.set(status);
        this.isLoading.set(false);
        
        // Ajouter un log d'arrêt
        this.mockLogs.unshift({
          id: this.mockLogs.length + 1,
          timestamp: new Date(),
          level: 'info',
          message: 'Bot arrêté manuellement',
          source: 'system'
        });
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.error.set('Erreur lors de l\'arrêt du bot');
        return throwError(() => error);
      })
    );
  }

  /**
   * Rafraîchit le statut du bot
   */
  refreshBotStatus(): void {
    this.getBotStatus().subscribe();
  }

  /**
   * Efface les logs du bot (pour le développement uniquement)
   */
  clearLogs(): Observable<boolean> {
    this.isLoading.set(true);
    
    // En environnement de production, utiliser l'API réelle
    // return this.http.delete<boolean>(`${this.apiUrl}/logs`)
    
    // Pour le développement, simuler la suppression
    return of(true).pipe(
      delay(1000),
      tap(() => {
        this.mockLogs = [];
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        this.error.set('Erreur lors de la suppression des logs');
        return throwError(() => error);
      })
    );
  }
} 