import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ressource, RessourceFilters } from '../../models/ressource.model';
import { RessourceService } from '../../services/ressource.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ressources.component.html',
  styleUrl: './ressources.component.scss'
})
export class RessourcesComponent implements OnInit {
  // Ressources et filtres
  ressources: Ressource[] = [];
  filteredRessources = signal<Ressource[]>([]);
  isLoading = signal<boolean>(true);
  
  // Options de filtres
  filterOptions = {
    types: [] as string[],
    categories: [] as string[],
    formations: [] as string[],
    campus: [] as string[],
    promos: [] as string[],
    tags: [] as string[]
  };
  
  // État des filtres
  activeFilters: RessourceFilters = {};
  searchTerm = '';
  searchTermChanged = new Subject<string>();
  
  // État de l'interface
  showFilters = signal<boolean>(false);
  selectedTags: string[] = [];
  
  constructor(private ressourceService: RessourceService) {
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
    this.loadRessources();
    this.loadFilterOptions();
  }

  /**
   * Charge toutes les ressources
   */
  loadRessources(): void {
    this.isLoading.set(true);
    this.ressourceService.getRessources().subscribe({
      next: (data) => {
        this.ressources = data;
        this.filteredRessources.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ressources', error);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Charge les options de filtres
   */
  loadFilterOptions(): void {
    this.ressourceService.getFilterOptions().subscribe({
      next: (options) => {
        this.filterOptions = options;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des options de filtres', error);
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
   * Applique un filtre de type
   */
  applyTypeFilter(type: string | null): void {
    this.activeFilters.type = type || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de catégorie
   */
  applyCategorieFilter(categorie: string | null): void {
    this.activeFilters.categorie = categorie || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de formation
   */
  applyFormationFilter(formation: string | null): void {
    this.activeFilters.formation = formation || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de campus
   */
  applyCampusFilter(campus: string | null): void {
    this.activeFilters.campus = campus || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de promo
   */
  applyPromoFilter(promo: string | null): void {
    this.activeFilters.promo = promo || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de visibilité
   */
  applyVisibilityFilter(estPublic: boolean | null): void {
    this.activeFilters.estPublic = estPublic === null ? undefined : estPublic;
    this.applyFilters();
  }

  /**
   * Gère la sélection d'un tag
   */
  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.activeFilters.tags = this.selectedTags.length > 0 ? [...this.selectedTags] : undefined;
    this.applyFilters();
  }

  /**
   * Applique tous les filtres actifs
   */
  applyFilters(): void {
    this.isLoading.set(true);
    this.ressourceService.filterRessources(this.activeFilters, this.searchTerm).subscribe({
      next: (filteredData) => {
        this.filteredRessources.set(filteredData);
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
    this.selectedTags = [];
    this.filteredRessources.set(this.ressources);
  }

  /**
   * Bascule l'affichage du panneau de filtres
   */
  toggleFilters(): void {
    this.showFilters.update(value => !value);
  }

  /**
   * Ouvre une ressource et incrémente le compteur de vues
   */
  openRessource(ressource: Ressource): void {
    this.ressourceService.incrementVues(ressource.id).subscribe();
    window.open(ressource.url, '_blank');
  }

  /**
   * Télécharge une ressource et incrémente le compteur de téléchargements
   */
  downloadRessource(ressource: Ressource): void {
    if (ressource.telechargements !== undefined) {
      this.ressourceService.incrementTelechargements(ressource.id).subscribe();
    }
    window.open(ressource.url, '_blank');
  }

  /**
   * Retourne l'icône correspondant au type de ressource
   */
  getTypeIcon(type: string): string {
    switch (type) {
      case 'document': return 'fas fa-file-alt';
      case 'video': return 'fas fa-video';
      case 'lien': return 'fas fa-link';
      case 'cours': return 'fas fa-book';
      default: return 'fas fa-file';
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
