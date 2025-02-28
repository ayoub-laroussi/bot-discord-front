import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Commentaire, CommentaireFilters } from '../models/commentaire.model';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  // Données fictives pour simuler une API
  private commentaires: Commentaire[] = [
    {
      id_commentaire: 1,
      contenu: 'Excellente ressource, très utile pour comprendre les bases d\'Angular !',
      date_creation: new Date('2023-10-20'),
      id_resource: 1,
      id_member: 3,
      resource_title: 'Introduction à Angular',
      member_name: 'Sophie Leroux',
      likes: 12,
      dislikes: 2
    },
    {
      id_commentaire: 2,
      contenu: 'La documentation est claire et bien structurée. Je recommande vivement.',
      date_creation: new Date('2023-09-25'),
      id_resource: 2,
      id_member: 1,
      resource_title: 'Bases de données SQL',
      member_name: 'Marie Dupont',
      likes: 8,
      dislikes: 0
    },
    {
      id_commentaire: 3,
      contenu: 'Cette vidéo m\'a beaucoup aidé pour mon projet mobile. Merci !',
      date_creation: new Date('2023-11-10'),
      id_resource: 3,
      id_member: 4,
      resource_title: 'Tutoriel React Native',
      member_name: 'Thomas Petit',
      likes: 15,
      dislikes: 1
    },
    {
      id_commentaire: 4,
      contenu: 'Guide très complet, parfait pour les débutants comme pour les plus expérimentés.',
      date_creation: new Date('2023-08-22'),
      id_resource: 4,
      id_member: 2,
      resource_title: 'Guide Git & GitHub',
      member_name: 'Jean Martin',
      likes: 20,
      dislikes: 3
    },
    {
      id_commentaire: 5,
      contenu: 'J\'ai trouvé quelques erreurs dans le code d\'exemple. Pourriez-vous les corriger ?',
      date_creation: new Date('2023-12-05'),
      date_modification: new Date('2023-12-06'),
      id_resource: 5,
      id_member: 6,
      resource_title: 'API REST avec Node.js',
      member_name: 'Emma Blanc',
      likes: 4,
      dislikes: 2
    },
    {
      id_commentaire: 6,
      contenu: 'Contenu très accessible pour les débutants en cybersécurité.',
      date_creation: new Date('2023-07-15'),
      id_resource: 6,
      id_member: 5,
      resource_title: 'Cybersécurité pour débutants',
      member_name: 'Lucas Moreau',
      likes: 10,
      dislikes: 0
    },
    {
      id_commentaire: 7,
      contenu: 'Tutoriel très pratique, j\'ai pu mettre en place Docker rapidement grâce à cette vidéo.',
      date_creation: new Date('2023-11-02'),
      id_resource: 7,
      id_member: 8,
      resource_title: 'Tutoriel Docker',
      member_name: 'Claire Martin',
      likes: 7,
      dislikes: 1
    },
    {
      id_commentaire: 8,
      contenu: 'Les ressources sont bien choisies, mais certains liens ne fonctionnent plus.',
      date_creation: new Date('2023-09-10'),
      id_resource: 8,
      id_member: 7,
      resource_title: 'Ressources Python Data Science',
      member_name: 'Pierre Dubois',
      likes: 5,
      dislikes: 3
    }
  ];

  constructor() { }

  /**
   * Récupère tous les commentaires
   */
  getCommentaires(): Observable<Commentaire[]> {
    return of(this.commentaires);
  }

  /**
   * Récupère un commentaire par son ID
   */
  getCommentaireById(id: number): Observable<Commentaire | undefined> {
    const commentaire = this.commentaires.find(c => c.id_commentaire === id);
    return of(commentaire);
  }

  /**
   * Récupère les commentaires pour une ressource spécifique
   */
  getCommentairesByResourceId(resourceId: number): Observable<Commentaire[]> {
    const filteredCommentaires = this.commentaires.filter(c => c.id_resource === resourceId);
    return of(filteredCommentaires);
  }

  /**
   * Filtre les commentaires selon les critères spécifiés
   */
  filterCommentaires(filters: CommentaireFilters): Observable<Commentaire[]> {
    let filteredCommentaires = [...this.commentaires];
    
    // Appliquer les filtres
    if (filters.id_resource) {
      filteredCommentaires = filteredCommentaires.filter(c => c.id_resource === filters.id_resource);
    }
    
    if (filters.id_member) {
      filteredCommentaires = filteredCommentaires.filter(c => c.id_member === filters.id_member);
    }
    
    if (filters.dateDebut) {
      filteredCommentaires = filteredCommentaires.filter(c => 
        c.date_creation >= filters.dateDebut!
      );
    }
    
    if (filters.dateFin) {
      filteredCommentaires = filteredCommentaires.filter(c => 
        c.date_creation <= filters.dateFin!
      );
    }
    
    // Appliquer la recherche textuelle
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase().trim();
      filteredCommentaires = filteredCommentaires.filter(c => 
        c.contenu.toLowerCase().includes(term) || 
        c.resource_title?.toLowerCase().includes(term) ||
        c.member_name?.toLowerCase().includes(term)
      );
    }
    
    return of(filteredCommentaires);
  }

  /**
   * Ajoute un nouveau commentaire
   */
  addCommentaire(commentaire: Omit<Commentaire, 'id_commentaire'>): Observable<Commentaire> {
    const newId = Math.max(...this.commentaires.map(c => c.id_commentaire)) + 1;
    const newCommentaire: Commentaire = {
      ...commentaire,
      id_commentaire: newId
    };
    this.commentaires.push(newCommentaire);
    return of(newCommentaire);
  }

  /**
   * Met à jour un commentaire existant
   */
  updateCommentaire(id: number, contenu: string): Observable<Commentaire | undefined> {
    const index = this.commentaires.findIndex(c => c.id_commentaire === id);
    if (index !== -1) {
      this.commentaires[index] = {
        ...this.commentaires[index],
        contenu,
        date_modification: new Date()
      };
      return of(this.commentaires[index]);
    }
    return of(undefined);
  }

  /**
   * Supprime un commentaire
   */
  deleteCommentaire(id: number): Observable<boolean> {
    const index = this.commentaires.findIndex(c => c.id_commentaire === id);
    if (index !== -1) {
      this.commentaires.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  /**
   * Ajoute un like à un commentaire
   */
  likeCommentaire(id: number): Observable<Commentaire | undefined> {
    const index = this.commentaires.findIndex(c => c.id_commentaire === id);
    if (index !== -1) {
      const likes = this.commentaires[index].likes || 0;
      this.commentaires[index] = {
        ...this.commentaires[index],
        likes: likes + 1
      };
      return of(this.commentaires[index]);
    }
    return of(undefined);
  }

  /**
   * Ajoute un dislike à un commentaire
   */
  dislikeCommentaire(id: number): Observable<Commentaire | undefined> {
    const index = this.commentaires.findIndex(c => c.id_commentaire === id);
    if (index !== -1) {
      const dislikes = this.commentaires[index].dislikes || 0;
      this.commentaires[index] = {
        ...this.commentaires[index],
        dislikes: dislikes + 1
      };
      return of(this.commentaires[index]);
    }
    return of(undefined);
  }
} 