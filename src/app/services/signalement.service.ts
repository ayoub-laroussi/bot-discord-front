import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Signalement, SignalementFilters, SignalementStatut } from '../models/signalement.model';

@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  // Données fictives pour simuler une API
  private signalements: Signalement[] = [
    {
      id_signalement: 1,
      motif: 'Contenu inapproprié',
      description: 'Cette ressource contient des propos offensants',
      date_signalement: new Date('2023-11-15'),
      statut: SignalementStatut.EnAttente,
      id_resource: 3,
      id_member: 2,
      resource_title: 'Tutoriel React Native',
      member_name: 'Jean Martin'
    },
    {
      id_signalement: 2,
      motif: 'Contenu obsolète',
      description: 'Les informations de cette ressource ne sont plus à jour',
      date_signalement: new Date('2023-10-22'),
      statut: SignalementStatut.Traite,
      id_resource: 1,
      id_member: 4,
      resource_title: 'Introduction à Angular',
      member_name: 'Thomas Petit'
    },
    {
      id_signalement: 3,
      motif: 'Lien mort',
      description: 'Le lien vers la ressource ne fonctionne plus',
      date_signalement: new Date('2023-12-05'),
      statut: SignalementStatut.Rejete,
      id_resource: 5,
      id_member: 3,
      resource_title: 'API REST avec Node.js',
      member_name: 'Sophie Leroux'
    },
    {
      id_signalement: 4,
      motif: 'Contenu dupliqué',
      description: 'Cette ressource est identique à une autre déjà présente',
      date_signalement: new Date('2023-09-18'),
      statut: SignalementStatut.EnAttente,
      id_resource: 2,
      id_member: 5,
      resource_title: 'Bases de données SQL',
      member_name: 'Lucas Moreau'
    },
    {
      id_signalement: 5,
      motif: 'Droits d\'auteur',
      description: 'Cette ressource viole des droits d\'auteur',
      date_signalement: new Date('2023-11-30'),
      statut: SignalementStatut.EnAttente,
      id_resource: 6,
      id_member: 1,
      resource_title: 'Cybersécurité pour débutants',
      member_name: 'Marie Dupont'
    }
  ];

  constructor() { }

  /**
   * Récupère tous les signalements
   */
  getSignalements(): Observable<Signalement[]> {
    return of(this.signalements);
  }

  /**
   * Récupère un signalement par son ID
   */
  getSignalementById(id: number): Observable<Signalement | undefined> {
    const signalement = this.signalements.find(s => s.id_signalement === id);
    return of(signalement);
  }

  /**
   * Récupère les signalements pour une ressource spécifique
   */
  getSignalementsByResourceId(resourceId: number): Observable<Signalement[]> {
    const filteredSignalements = this.signalements.filter(s => s.id_resource === resourceId);
    return of(filteredSignalements);
  }

  /**
   * Filtre les signalements selon les critères spécifiés
   */
  filterSignalements(filters: SignalementFilters): Observable<Signalement[]> {
    let filteredSignalements = [...this.signalements];
    
    // Appliquer les filtres
    if (filters.statut) {
      filteredSignalements = filteredSignalements.filter(s => s.statut === filters.statut);
    }
    
    if (filters.id_resource) {
      filteredSignalements = filteredSignalements.filter(s => s.id_resource === filters.id_resource);
    }
    
    if (filters.id_member) {
      filteredSignalements = filteredSignalements.filter(s => s.id_member === filters.id_member);
    }
    
    if (filters.dateDebut) {
      filteredSignalements = filteredSignalements.filter(s => 
        s.date_signalement >= filters.dateDebut!
      );
    }
    
    if (filters.dateFin) {
      filteredSignalements = filteredSignalements.filter(s => 
        s.date_signalement <= filters.dateFin!
      );
    }
    
    // Appliquer la recherche textuelle
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase().trim();
      filteredSignalements = filteredSignalements.filter(s => 
        s.motif.toLowerCase().includes(term) || 
        (s.description && s.description.toLowerCase().includes(term)) || 
        s.resource_title?.toLowerCase().includes(term) ||
        s.member_name?.toLowerCase().includes(term)
      );
    }
    
    return of(filteredSignalements);
  }

  /**
   * Met à jour le statut d'un signalement
   */
  updateSignalementStatus(id: number, statut: SignalementStatut): Observable<Signalement | undefined> {
    const index = this.signalements.findIndex(s => s.id_signalement === id);
    if (index !== -1) {
      this.signalements[index] = {
        ...this.signalements[index],
        statut
      };
      return of(this.signalements[index]);
    }
    return of(undefined);
  }

  /**
   * Ajoute un nouveau signalement
   */
  addSignalement(signalement: Omit<Signalement, 'id_signalement'>): Observable<Signalement> {
    const newId = Math.max(...this.signalements.map(s => s.id_signalement)) + 1;
    const newSignalement: Signalement = {
      ...signalement,
      id_signalement: newId
    };
    this.signalements.push(newSignalement);
    return of(newSignalement);
  }
} 