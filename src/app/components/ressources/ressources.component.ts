import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ressource, RessourceFilters, Tag, Category, Visibility } from '../../models/ressource.model';
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
    categories: [] as Category[],
    tags: [] as Tag[],
    visibilities: [] as Visibility[],
    members: [] as { id: number, name: string }[]
  };
  
  // État des filtres
  activeFilters: RessourceFilters = {};
  searchTerm = '';
  searchTermChanged = new Subject<string>();
  
  // État de l'interface
  showFilters = signal<boolean>(false);
  selectedTags: number[] = [];
  
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
   * Applique un filtre de catégorie
   */
  applyCategoryFilter(categoryId: number | null): void {
    this.activeFilters.category_id = categoryId || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de membre
   */
  applyMemberFilter(memberId: number | null): void {
    this.activeFilters.member_id = memberId || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de visibilité
   */
  applyVisibilityFilter(visibilityId: number | null): void {
    this.activeFilters.visibility_id = visibilityId || undefined;
    this.applyFilters();
  }

  /**
   * Gère la sélection d'un tag
   */
  toggleTag(tagId: number): void {
    const index = this.selectedTags.indexOf(tagId);
    if (index === -1) {
      this.selectedTags.push(tagId);
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
    
    // Ajouter le terme de recherche aux filtres
    const filters: RessourceFilters = {
      ...this.activeFilters,
      searchTerm: this.searchTerm
    };
    
    this.ressourceService.filterRessources(filters).subscribe({
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
    this.ressourceService.incrementViews(ressource.id_resource).subscribe();
    window.open(ressource.content_url, '_blank');
  }

  /**
   * Retourne l'icône correspondant à la catégorie de la ressource
   */
  getCategoryIcon(categoryId: number): string {
    switch (categoryId) {
      case 1: return 'fas fa-code'; // Développement Web
      case 2: return 'fas fa-database'; // Base de données
      case 3: return 'fas fa-mobile-alt'; // Développement Mobile
      case 4: return 'fas fa-server'; // DevOps
      case 5: return 'fas fa-shield-alt'; // Sécurité
      case 6: return 'fas fa-chart-bar'; // Data Science
      default: return 'fas fa-file';
    }
  }

  /**
   * Retourne le nom de la catégorie à partir de son ID
   */
  getCategoryName(categoryId: number): string {
    const category = this.filterOptions.categories.find(c => c.id_category === categoryId);
    return category ? category.name : '';
  }

  /**
   * Retourne le nom de la visibilité à partir de son ID
   */
  getVisibilityName(visibilityId: number): string {
    const visibility = this.filterOptions.visibilities.find(v => v.id_visibility === visibilityId);
    return visibility ? visibility.name : '';
  }

  /**
   * Retourne le nom du tag à partir de son ID
   */
  getTagName(tagId: number): string {
    const tag = this.filterOptions.tags.find(t => t.id_tag === tagId);
    return tag ? tag.tag_name : '';
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
