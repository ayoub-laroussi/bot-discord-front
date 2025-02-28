import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Signalement, SignalementFilters, SignalementStatut } from '../../models/signalement.model';
import { SignalementService } from '../../services/signalement.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-signalements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signalements.component.html',
  styleUrl: './signalements.component.scss'
})
export class SignalementsComponent implements OnInit {
  // Signalements et filtres
  signalements: Signalement[] = [];
  filteredSignalements = signal<Signalement[]>([]);
  isLoading = signal<boolean>(true);
  
  // État des filtres
  activeFilters: SignalementFilters = {};
  searchTerm = '';
  searchTermChanged = new Subject<string>();
  
  // État de l'interface
  showFilters = signal<boolean>(false);
  
  // Enum pour le template
  SignalementStatut = SignalementStatut;
  
  constructor(private signalementService: SignalementService) {
    // Configuration du debounce pour la recherche
    this.searchTermChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadSignalements();
  }

  /**
   * Charge tous les signalements
   */
  loadSignalements(): void {
    this.isLoading.set(true);
    this.signalementService.getSignalements().subscribe({
      next: (data) => {
        this.signalements = data;
        this.filteredSignalements.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des signalements', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Gère le changement dans la barre de recherche
   */
  onSearchChange(term: string): void {
    this.searchTermChanged.next(term);
  }

  /**
   * Applique un filtre de statut
   */
  applyStatusFilter(status: SignalementStatut | null): void {
    this.activeFilters.statut = status || undefined;
    this.applyFilters();
  }

  /**
   * Applique tous les filtres actifs
   */
  applyFilters(): void {
    this.isLoading.set(true);
    
    // Ajouter le terme de recherche aux filtres
    const filters: SignalementFilters = {
      ...this.activeFilters,
      searchTerm: this.searchTerm
    };
    
    this.signalementService.filterSignalements(filters).subscribe({
      next: (filteredData) => {
        this.filteredSignalements.set(filteredData);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors de l\'application des filtres', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.activeFilters = {};
    this.searchTerm = '';
    this.filteredSignalements.set(this.signalements);
  }

  /**
   * Bascule l'affichage du panneau de filtres
   */
  toggleFilters(): void {
    this.showFilters.update(value => !value);
  }

  /**
   * Met à jour le statut d'un signalement
   */
  updateStatus(signalement: Signalement, newStatus: SignalementStatut): void {
    this.signalementService.updateSignalementStatus(signalement.id_signalement, newStatus).subscribe({
      next: (updatedSignalement) => {
        if (updatedSignalement) {
          // Mettre à jour le signalement dans la liste
          const index = this.signalements.findIndex(s => s.id_signalement === updatedSignalement.id_signalement);
          if (index !== -1) {
            this.signalements[index] = updatedSignalement;
            this.applyFilters(); // Réappliquer les filtres pour mettre à jour la liste filtrée
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
      }
    });
  }

  /**
   * Retourne la classe CSS pour le badge de statut
   */
  getStatusClass(status: SignalementStatut): string {
    switch (status) {
      case SignalementStatut.EnAttente:
        return 'bg-amber-100 text-amber-800';
      case SignalementStatut.Traite:
        return 'bg-green-100 text-green-800';
      case SignalementStatut.Rejete:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Retourne le libellé du statut
   */
  getStatusLabel(status: SignalementStatut): string {
    switch (status) {
      case SignalementStatut.EnAttente:
        return 'En attente';
      case SignalementStatut.Traite:
        return 'Traité';
      case SignalementStatut.Rejete:
        return 'Rejeté';
      default:
        return status;
    }
  }

  /**
   * Formate une date en chaîne lisible
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
