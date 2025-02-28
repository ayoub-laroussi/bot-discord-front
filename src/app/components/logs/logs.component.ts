import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DiscordBotService } from '../../services/discord-bot.service';
import { DiscordLog, BotStatus } from '../../models/discord-log.model';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  // Signaux pour l'état réactif
  logs = signal<DiscordLog[]>([]);
  selectedLevel = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Calcul dérivé pour le statut du bot
  botStatus = computed(() => this.discordBotService.botStatus());
  
  // Pagination
  currentPage = signal<number>(1);
  itemsPerPage = 10;
  
  // Destruction du composant
  private destroy$ = new Subject<void>();

  constructor(private discordBotService: DiscordBotService) {
    // Utiliser effect pour réagir aux changements des signaux du service
    effect(() => {
      this.isLoading.set(this.discordBotService.isLoading());
    });
    
    effect(() => {
      this.error.set(this.discordBotService.error());
    });
  }

  ngOnInit(): void {
    // Charger les logs initiaux
    this.loadLogs();
    
    // Rafraîchir le statut du bot
    this.refreshBotStatus();
  }

  ngOnDestroy(): void {
    // Nettoyer les abonnements
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les logs du bot Discord
   */
  loadLogs(): void {
    const offset = (this.currentPage() - 1) * this.itemsPerPage;
    const level = this.selectedLevel() as 'info' | 'warning' | 'error' | 'debug' | undefined;
    
    this.discordBotService.getLogs(this.itemsPerPage, offset, level)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logs) => this.logs.set(logs),
        error: (err: Error) => console.error('Erreur lors du chargement des logs:', err)
      });
  }

  /**
   * Rafraîchit le statut du bot
   */
  refreshBotStatus(): void {
    this.discordBotService.refreshBotStatus();
  }

  /**
   * Démarre le bot Discord
   */
  startBot(): void {
    this.discordBotService.startBot()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadLogs(),
        error: (err: Error) => console.error('Erreur lors du démarrage du bot:', err)
      });
  }

  /**
   * Arrête le bot Discord
   */
  stopBot(): void {
    this.discordBotService.stopBot()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadLogs(),
        error: (err: Error) => console.error('Erreur lors de l\'arrêt du bot:', err)
      });
  }

  /**
   * Efface les logs du bot
   */
  clearLogs(): void {
    if (confirm('Êtes-vous sûr de vouloir effacer tous les logs ?')) {
      this.discordBotService.clearLogs()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.loadLogs(),
          error: (err: Error) => console.error('Erreur lors de la suppression des logs:', err)
        });
    }
  }

  /**
   * Change le filtre de niveau de log
   * @param level Niveau de log à filtrer
   */
  filterByLevel(level: string | null): void {
    this.selectedLevel.set(level);
    this.currentPage.set(1);
    this.loadLogs();
  }

  /**
   * Change de page
   * @param page Numéro de page
   */
  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadLogs();
  }

  /**
   * Formate la date pour l'affichage
   * @param date Date à formater
   * @returns Date formatée
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Formate la durée pour l'affichage
   * @param seconds Durée en secondes
   * @returns Durée formatée
   */
  formatUptime(seconds?: number): string {
    if (!seconds) return '0s';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let result = '';
    if (days > 0) result += `${days}j `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (remainingSeconds > 0 || result === '') result += `${remainingSeconds}s`;
    
    return result.trim();
  }

  /**
   * Obtient la classe CSS pour un niveau de log
   * @param level Niveau de log
   * @returns Classe CSS
   */
  getLevelClass(level: string): string {
    switch (level) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Obtient l'icône pour un niveau de log
   * @param level Niveau de log
   * @returns Classe d'icône
   */
  getLevelIcon(level: string): string {
    switch (level) {
      case 'info': return 'fas fa-info-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'error': return 'fas fa-times-circle';
      case 'debug': return 'fas fa-bug';
      default: return 'fas fa-circle';
    }
  }
}
