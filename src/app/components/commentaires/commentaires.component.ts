import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Commentaire, CommentaireFilters } from '../../models/commentaire.model';
import { CommentaireService } from '../../services/commentaire.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UniqueResourcesPipe } from '../../pipes/unique-resources.pipe';
import { UniqueMembersPipe } from '../../pipes/unique-members.pipe';

// Débogage
console.log('Chargement du module CommentairesComponent');

@Component({
  selector: 'app-commentaires',
  standalone: true,
  imports: [CommonModule, FormsModule, UniqueResourcesPipe, UniqueMembersPipe],
  templateUrl: './commentaires.component.html',
  styleUrl: './commentaires.component.scss'
})
export class CommentairesComponent implements OnInit {
  // Commentaires et filtres
  commentaires: Commentaire[] = [];
  filteredCommentaires = signal<Commentaire[]>([]);
  isLoading = signal<boolean>(true);
  
  // État des filtres
  activeFilters: CommentaireFilters = {};
  searchTerm = '';
  searchTermChanged = new Subject<string>();
  
  // État de l'interface
  showFilters = signal<boolean>(false);
  editingCommentaire: Commentaire | null = null;
  newCommentContent = '';
  
  constructor(private commentaireService: CommentaireService) {
    console.log('CommentairesComponent: constructeur appelé');
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
    console.log('CommentairesComponent: ngOnInit appelé');
    this.loadCommentaires();
  }

  /**
   * Charge tous les commentaires
   */
  loadCommentaires(): void {
    console.log('CommentairesComponent: chargement des commentaires...');
    this.isLoading.set(true);
    this.commentaireService.getCommentaires().subscribe({
      next: (data) => {
        console.log('CommentairesComponent: commentaires chargés:', data.length);
        this.commentaires = data;
        this.filteredCommentaires.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('CommentairesComponent: erreur lors du chargement des commentaires', error);
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
   * Applique un filtre de ressource
   */
  applyResourceFilter(resourceId: number | null): void {
    this.activeFilters.id_resource = resourceId || undefined;
    this.applyFilters();
  }

  /**
   * Applique un filtre de membre
   */
  applyMemberFilter(memberId: number | null): void {
    this.activeFilters.id_member = memberId || undefined;
    this.applyFilters();
  }

  /**
   * Applique tous les filtres actifs
   */
  applyFilters(): void {
    this.isLoading.set(true);
    
    // Ajouter le terme de recherche aux filtres
    const filters: CommentaireFilters = {
      ...this.activeFilters,
      searchTerm: this.searchTerm
    };
    
    this.commentaireService.filterCommentaires(filters).subscribe({
      next: (filteredData) => {
        this.filteredCommentaires.set(filteredData);
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
    this.filteredCommentaires.set(this.commentaires);
  }

  /**
   * Bascule l'affichage du panneau de filtres
   */
  toggleFilters(): void {
    this.showFilters.update(value => !value);
  }

  /**
   * Commence l'édition d'un commentaire
   */
  startEditing(commentaire: Commentaire): void {
    this.editingCommentaire = commentaire;
    this.newCommentContent = commentaire.contenu;
  }

  /**
   * Annule l'édition d'un commentaire
   */
  cancelEditing(): void {
    this.editingCommentaire = null;
    this.newCommentContent = '';
  }

  /**
   * Sauvegarde les modifications d'un commentaire
   */
  saveEditing(): void {
    if (this.editingCommentaire && this.newCommentContent.trim() !== '') {
      this.commentaireService.updateCommentaire(
        this.editingCommentaire.id_commentaire, 
        this.newCommentContent
      ).subscribe({
        next: (updatedCommentaire) => {
          if (updatedCommentaire) {
            // Mettre à jour le commentaire dans la liste
            const index = this.commentaires.findIndex(c => c.id_commentaire === updatedCommentaire.id_commentaire);
            if (index !== -1) {
              this.commentaires[index] = updatedCommentaire;
              this.applyFilters(); // Réappliquer les filtres pour mettre à jour la liste filtrée
            }
          }
          this.editingCommentaire = null;
          this.newCommentContent = '';
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du commentaire', error);
        }
      });
    }
  }

  /**
   * Supprime un commentaire
   */
  deleteCommentaire(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.commentaireService.deleteCommentaire(id).subscribe({
        next: (success) => {
          if (success) {
            // Supprimer le commentaire de la liste
            this.commentaires = this.commentaires.filter(c => c.id_commentaire !== id);
            this.applyFilters(); // Réappliquer les filtres pour mettre à jour la liste filtrée
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du commentaire', error);
        }
      });
    }
  }

  /**
   * Ajoute un like à un commentaire
   */
  likeCommentaire(id: number): void {
    this.commentaireService.likeCommentaire(id).subscribe({
      next: (updatedCommentaire) => {
        if (updatedCommentaire) {
          // Mettre à jour le commentaire dans la liste
          const index = this.commentaires.findIndex(c => c.id_commentaire === updatedCommentaire.id_commentaire);
          if (index !== -1) {
            this.commentaires[index] = updatedCommentaire;
            this.applyFilters(); // Réappliquer les filtres pour mettre à jour la liste filtrée
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du like', error);
      }
    });
  }

  /**
   * Ajoute un dislike à un commentaire
   */
  dislikeCommentaire(id: number): void {
    this.commentaireService.dislikeCommentaire(id).subscribe({
      next: (updatedCommentaire) => {
        if (updatedCommentaire) {
          // Mettre à jour le commentaire dans la liste
          const index = this.commentaires.findIndex(c => c.id_commentaire === updatedCommentaire.id_commentaire);
          if (index !== -1) {
            this.commentaires[index] = updatedCommentaire;
            this.applyFilters(); // Réappliquer les filtres pour mettre à jour la liste filtrée
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du dislike', error);
      }
    });
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

  /**
   * Vérifie si un commentaire a été modifié
   */
  isEdited(commentaire: Commentaire): boolean {
    return !!commentaire.date_modification;
  }
}
