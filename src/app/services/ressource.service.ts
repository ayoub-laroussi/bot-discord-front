import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ressource, RessourceFilters } from '../models/ressource.model';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  // Données fictives pour simuler une API
  private ressources: Ressource[] = [
    {
      id: 1,
      titre: 'Introduction à Angular',
      description: 'Cours complet sur les bases d\'Angular',
      type: 'cours',
      url: 'https://example.com/angular-intro',
      dateCreation: new Date('2023-10-15'),
      auteur: 'Marie Dupont',
      categorie: 'Développement Web',
      tags: ['Angular', 'Frontend', 'TypeScript'],
      formation: 'Développeur Web',
      campus: 'Paris',
      promo: 'Promo 2023',
      estPublic: true,
      vues: 1250,
      telechargements: 450
    },
    {
      id: 2,
      titre: 'Bases de données SQL',
      description: 'Documentation sur les requêtes SQL avancées',
      type: 'document',
      url: 'https://example.com/sql-doc',
      dateCreation: new Date('2023-09-22'),
      auteur: 'Jean Martin',
      categorie: 'Base de données',
      tags: ['SQL', 'Database', 'Backend'],
      formation: 'Data Analyst',
      campus: 'Lyon',
      promo: 'Promo 2023',
      estPublic: true,
      vues: 890,
      telechargements: 320
    },
    {
      id: 3,
      titre: 'Tutoriel React Native',
      description: 'Vidéo explicative sur le développement mobile avec React Native',
      type: 'video',
      url: 'https://example.com/react-native-video',
      dateCreation: new Date('2023-11-05'),
      auteur: 'Sophie Leroux',
      categorie: 'Développement Mobile',
      tags: ['React Native', 'Mobile', 'JavaScript'],
      formation: 'Développeur Mobile',
      campus: 'Marseille',
      promo: 'Promo 2023',
      estPublic: true,
      vues: 1560,
      telechargements: 0
    },
    {
      id: 4,
      titre: 'Guide Git & GitHub',
      description: 'Documentation complète sur l\'utilisation de Git et GitHub',
      type: 'document',
      url: 'https://example.com/git-guide',
      dateCreation: new Date('2023-08-18'),
      auteur: 'Thomas Petit',
      categorie: 'DevOps',
      tags: ['Git', 'GitHub', 'Versioning'],
      formation: 'DevOps',
      campus: 'Lille',
      promo: 'Promo 2022',
      estPublic: true,
      vues: 2100,
      telechargements: 780
    },
    {
      id: 5,
      titre: 'API REST avec Node.js',
      description: 'Cours sur la création d\'API REST avec Node.js et Express',
      type: 'cours',
      url: 'https://example.com/nodejs-api',
      dateCreation: new Date('2023-12-01'),
      auteur: 'Lucas Moreau',
      categorie: 'Développement Web',
      tags: ['Node.js', 'API', 'Backend', 'Express'],
      formation: 'Développeur Web',
      campus: 'Paris',
      promo: 'Promo 2023',
      estPublic: false,
      vues: 650,
      telechargements: 210
    },
    {
      id: 6,
      titre: 'Cybersécurité pour débutants',
      description: 'Introduction aux concepts de base de la cybersécurité',
      type: 'cours',
      url: 'https://example.com/cybersecurity-basics',
      dateCreation: new Date('2023-07-12'),
      auteur: 'Emma Blanc',
      categorie: 'Sécurité',
      tags: ['Cybersécurité', 'Sécurité', 'Réseau'],
      formation: 'Expert Cybersécurité',
      campus: 'Bordeaux',
      promo: 'Promo 2022',
      estPublic: true,
      vues: 1850,
      telechargements: 620
    },
    {
      id: 7,
      titre: 'Tutoriel Docker',
      description: 'Vidéo sur l\'utilisation de Docker pour la conteneurisation',
      type: 'video',
      url: 'https://example.com/docker-tutorial',
      dateCreation: new Date('2023-10-28'),
      auteur: 'Pierre Dubois',
      categorie: 'DevOps',
      tags: ['Docker', 'Conteneurisation', 'DevOps'],
      formation: 'DevOps',
      campus: 'Lyon',
      promo: 'Promo 2023',
      estPublic: true,
      vues: 980,
      telechargements: 0
    },
    {
      id: 8,
      titre: 'Ressources Python Data Science',
      description: 'Collection de liens vers des ressources pour la data science avec Python',
      type: 'lien',
      url: 'https://example.com/python-data-science',
      dateCreation: new Date('2023-09-05'),
      auteur: 'Claire Martin',
      categorie: 'Data Science',
      tags: ['Python', 'Data Science', 'Machine Learning'],
      formation: 'Data Scientist',
      campus: 'Paris',
      promo: 'Promo 2023',
      estPublic: true,
      vues: 1420,
      telechargements: 0
    }
  ];

  constructor() { }

  /**
   * Récupère toutes les ressources
   */
  getRessources(): Observable<Ressource[]> {
    return of(this.ressources);
  }

  /**
   * Récupère une ressource par son ID
   */
  getRessourceById(id: number): Observable<Ressource | undefined> {
    const ressource = this.ressources.find(r => r.id === id);
    return of(ressource);
  }

  /**
   * Filtre les ressources selon les critères spécifiés
   */
  filterRessources(filters: RessourceFilters, searchTerm: string = ''): Observable<Ressource[]> {
    let filteredRessources = [...this.ressources];
    
    // Appliquer les filtres
    if (filters.type) {
      filteredRessources = filteredRessources.filter(r => r.type === filters.type);
    }
    
    if (filters.categorie) {
      filteredRessources = filteredRessources.filter(r => r.categorie === filters.categorie);
    }
    
    if (filters.formation) {
      filteredRessources = filteredRessources.filter(r => r.formation === filters.formation);
    }
    
    if (filters.campus) {
      filteredRessources = filteredRessources.filter(r => r.campus === filters.campus);
    }
    
    if (filters.promo) {
      filteredRessources = filteredRessources.filter(r => r.promo === filters.promo);
    }
    
    if (filters.estPublic !== undefined) {
      filteredRessources = filteredRessources.filter(r => r.estPublic === filters.estPublic);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredRessources = filteredRessources.filter(r => 
        filters.tags!.some(tag => r.tags.includes(tag))
      );
    }
    
    if (filters.dateDebut) {
      filteredRessources = filteredRessources.filter(r => 
        r.dateCreation >= filters.dateDebut!
      );
    }
    
    if (filters.dateFin) {
      filteredRessources = filteredRessources.filter(r => 
        r.dateCreation <= filters.dateFin!
      );
    }
    
    // Appliquer la recherche textuelle
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filteredRessources = filteredRessources.filter(r => 
        r.titre.toLowerCase().includes(term) || 
        r.description.toLowerCase().includes(term) || 
        r.auteur.toLowerCase().includes(term) ||
        r.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    return of(filteredRessources);
  }

  /**
   * Récupère les valeurs uniques pour les filtres
   */
  getFilterOptions(): Observable<{
    types: string[];
    categories: string[];
    formations: string[];
    campus: string[];
    promos: string[];
    tags: string[];
  }> {
    return of({
      types: [...new Set(this.ressources.map(r => r.type))],
      categories: [...new Set(this.ressources.map(r => r.categorie))],
      formations: [...new Set(this.ressources.map(r => r.formation).filter(Boolean) as string[])],
      campus: [...new Set(this.ressources.map(r => r.campus).filter(Boolean) as string[])],
      promos: [...new Set(this.ressources.map(r => r.promo).filter(Boolean) as string[])],
      tags: [...new Set(this.ressources.flatMap(r => r.tags))]
    });
  }

  /**
   * Incrémente le compteur de vues d'une ressource
   */
  incrementVues(id: number): Observable<boolean> {
    const index = this.ressources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.ressources[index].vues++;
      return of(true);
    }
    return of(false);
  }

  /**
   * Incrémente le compteur de téléchargements d'une ressource
   */
  incrementTelechargements(id: number): Observable<boolean> {
    const index = this.ressources.findIndex(r => r.id === id);
    if (index !== -1 && this.ressources[index].telechargements !== undefined) {
      this.ressources[index].telechargements!++;
      return of(true);
    }
    return of(false);
  }
} 