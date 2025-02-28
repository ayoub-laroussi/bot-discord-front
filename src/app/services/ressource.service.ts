import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ressource, RessourceFilters, Tag, Category, Visibility } from '../models/ressource.model';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  // Données fictives pour simuler une API
  private visibilities: Visibility[] = [
    { id_visibility: 1, name: 'Public' },
    { id_visibility: 2, name: 'Private' },
    { id_visibility: 3, name: 'Members Only' }
  ];

  private categories: Category[] = [
    { 
      id_category: 1, 
      name: 'Développement Web', 
      created_at: new Date('2023-01-15'), 
      updated_at: new Date('2023-01-15') 
    },
    { 
      id_category: 2, 
      name: 'Base de données', 
      created_at: new Date('2023-01-20'), 
      updated_at: new Date('2023-01-20') 
    },
    { 
      id_category: 3, 
      name: 'Développement Mobile', 
      created_at: new Date('2023-02-05'), 
      updated_at: new Date('2023-02-05') 
    },
    { 
      id_category: 4, 
      name: 'DevOps', 
      created_at: new Date('2023-02-10'), 
      updated_at: new Date('2023-02-10') 
    },
    { 
      id_category: 5, 
      name: 'Sécurité', 
      created_at: new Date('2023-03-01'), 
      updated_at: new Date('2023-03-01') 
    },
    { 
      id_category: 6, 
      name: 'Data Science', 
      created_at: new Date('2023-03-15'), 
      updated_at: new Date('2023-03-15') 
    }
  ];

  private tags: Tag[] = [
    { id_tag: 1, tag_name: 'Angular' },
    { id_tag: 2, tag_name: 'Frontend' },
    { id_tag: 3, tag_name: 'TypeScript' },
    { id_tag: 4, tag_name: 'SQL' },
    { id_tag: 5, tag_name: 'Database' },
    { id_tag: 6, tag_name: 'Backend' },
    { id_tag: 7, tag_name: 'React Native' },
    { id_tag: 8, tag_name: 'Mobile' },
    { id_tag: 9, tag_name: 'JavaScript' },
    { id_tag: 10, tag_name: 'Git' },
    { id_tag: 11, tag_name: 'GitHub' },
    { id_tag: 12, tag_name: 'Versioning' },
    { id_tag: 13, tag_name: 'Node.js' },
    { id_tag: 14, tag_name: 'API' },
    { id_tag: 15, tag_name: 'Express' },
    { id_tag: 16, tag_name: 'Cybersécurité' },
    { id_tag: 17, tag_name: 'Réseau' },
    { id_tag: 18, tag_name: 'Docker' },
    { id_tag: 19, tag_name: 'Conteneurisation' },
    { id_tag: 20, tag_name: 'Python' },
    { id_tag: 21, tag_name: 'Machine Learning' }
  ];

  // Table de liaison ressource-tag
  private resourceTags: { resource_id: number, tag_id: number }[] = [
    { resource_id: 1, tag_id: 1 },
    { resource_id: 1, tag_id: 2 },
    { resource_id: 1, tag_id: 3 },
    { resource_id: 2, tag_id: 4 },
    { resource_id: 2, tag_id: 5 },
    { resource_id: 2, tag_id: 6 },
    { resource_id: 3, tag_id: 7 },
    { resource_id: 3, tag_id: 8 },
    { resource_id: 3, tag_id: 9 },
    { resource_id: 4, tag_id: 10 },
    { resource_id: 4, tag_id: 11 },
    { resource_id: 4, tag_id: 12 },
    { resource_id: 5, tag_id: 13 },
    { resource_id: 5, tag_id: 14 },
    { resource_id: 5, tag_id: 15 },
    { resource_id: 5, tag_id: 6 },
    { resource_id: 6, tag_id: 16 },
    { resource_id: 6, tag_id: 17 },
    { resource_id: 7, tag_id: 18 },
    { resource_id: 7, tag_id: 19 },
    { resource_id: 8, tag_id: 20 },
    { resource_id: 8, tag_id: 21 },
    { resource_id: 8, tag_id: 6 }
  ];

  // Données des membres (simplifiées)
  private members: { id: number, name: string }[] = [
    { id: 1, name: 'Marie Dupont' },
    { id: 2, name: 'Jean Martin' },
    { id: 3, name: 'Sophie Leroux' },
    { id: 4, name: 'Thomas Petit' },
    { id: 5, name: 'Lucas Moreau' },
    { id: 6, name: 'Emma Blanc' },
    { id: 7, name: 'Pierre Dubois' },
    { id: 8, name: 'Claire Martin' }
  ];

  // Données des vues (simplifiées)
  private views: { resource_id: number, count: number }[] = [
    { resource_id: 1, count: 1250 },
    { resource_id: 2, count: 890 },
    { resource_id: 3, count: 1560 },
    { resource_id: 4, count: 2100 },
    { resource_id: 5, count: 650 },
    { resource_id: 6, count: 1850 },
    { resource_id: 7, count: 980 },
    { resource_id: 8, count: 1420 }
  ];

  private ressources: Ressource[] = [
    {
      id_resource: 1,
      title: 'Introduction à Angular',
      description: 'Cours complet sur les bases d\'Angular',
      content_url: 'https://example.com/angular-intro',
      created_at: new Date('2023-10-15'),
      updated_at: new Date('2023-10-15'),
      visibility_id: 1, // Public
      member_id: 1, // Marie Dupont
      category_id: 1, // Développement Web
      author: 'Marie Dupont',
      category: 'Développement Web',
      tags: ['Angular', 'Frontend', 'TypeScript'],
      views: 1250
    },
    {
      id_resource: 2,
      title: 'Bases de données SQL',
      description: 'Documentation sur les requêtes SQL avancées',
      content_url: 'https://example.com/sql-doc',
      created_at: new Date('2023-09-22'),
      updated_at: new Date('2023-09-22'),
      visibility_id: 1, // Public
      member_id: 2, // Jean Martin
      category_id: 2, // Base de données
      author: 'Jean Martin',
      category: 'Base de données',
      tags: ['SQL', 'Database', 'Backend'],
      views: 890
    },
    {
      id_resource: 3,
      title: 'Tutoriel React Native',
      description: 'Vidéo explicative sur le développement mobile avec React Native',
      content_url: 'https://example.com/react-native-video',
      created_at: new Date('2023-11-05'),
      updated_at: new Date('2023-11-05'),
      visibility_id: 1, // Public
      member_id: 3, // Sophie Leroux
      category_id: 3, // Développement Mobile
      author: 'Sophie Leroux',
      category: 'Développement Mobile',
      tags: ['React Native', 'Mobile', 'JavaScript'],
      views: 1560
    },
    {
      id_resource: 4,
      title: 'Guide Git & GitHub',
      description: 'Documentation complète sur l\'utilisation de Git et GitHub',
      content_url: 'https://example.com/git-guide',
      created_at: new Date('2023-08-18'),
      updated_at: new Date('2023-08-18'),
      visibility_id: 1, // Public
      member_id: 4, // Thomas Petit
      category_id: 4, // DevOps
      author: 'Thomas Petit',
      category: 'DevOps',
      tags: ['Git', 'GitHub', 'Versioning'],
      views: 2100
    },
    {
      id_resource: 5,
      title: 'API REST avec Node.js',
      description: 'Cours sur la création d\'API REST avec Node.js et Express',
      content_url: 'https://example.com/nodejs-api',
      created_at: new Date('2023-12-01'),
      updated_at: new Date('2023-12-01'),
      visibility_id: 2, // Private
      member_id: 5, // Lucas Moreau
      category_id: 1, // Développement Web
      author: 'Lucas Moreau',
      category: 'Développement Web',
      tags: ['Node.js', 'API', 'Backend', 'Express'],
      views: 650
    },
    {
      id_resource: 6,
      title: 'Cybersécurité pour débutants',
      description: 'Introduction aux concepts de base de la cybersécurité',
      content_url: 'https://example.com/cybersecurity-basics',
      created_at: new Date('2023-07-12'),
      updated_at: new Date('2023-07-12'),
      visibility_id: 1, // Public
      member_id: 6, // Emma Blanc
      category_id: 5, // Sécurité
      author: 'Emma Blanc',
      category: 'Sécurité',
      tags: ['Cybersécurité', 'Sécurité', 'Réseau'],
      views: 1850
    },
    {
      id_resource: 7,
      title: 'Tutoriel Docker',
      description: 'Vidéo sur l\'utilisation de Docker pour la conteneurisation',
      content_url: 'https://example.com/docker-tutorial',
      created_at: new Date('2023-10-28'),
      updated_at: new Date('2023-10-28'),
      visibility_id: 1, // Public
      member_id: 7, // Pierre Dubois
      category_id: 4, // DevOps
      author: 'Pierre Dubois',
      category: 'DevOps',
      tags: ['Docker', 'Conteneurisation', 'DevOps'],
      views: 980
    },
    {
      id_resource: 8,
      title: 'Ressources Python Data Science',
      description: 'Collection de liens vers des ressources pour la data science avec Python',
      content_url: 'https://example.com/python-data-science',
      created_at: new Date('2023-09-05'),
      updated_at: new Date('2023-09-05'),
      visibility_id: 1, // Public
      member_id: 8, // Claire Martin
      category_id: 6, // Data Science
      author: 'Claire Martin',
      category: 'Data Science',
      tags: ['Python', 'Data Science', 'Machine Learning'],
      views: 1420
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
    const ressource = this.ressources.find(r => r.id_resource === id);
    return of(ressource);
  }

  /**
   * Récupère toutes les catégories
   */
  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  /**
   * Récupère tous les tags
   */
  getTags(): Observable<Tag[]> {
    return of(this.tags);
  }

  /**
   * Récupère toutes les visibilités
   */
  getVisibilities(): Observable<Visibility[]> {
    return of(this.visibilities);
  }

  /**
   * Filtre les ressources selon les critères spécifiés
   */
  filterRessources(filters: RessourceFilters): Observable<Ressource[]> {
    let filteredRessources = [...this.ressources];
    
    // Appliquer les filtres
    if (filters.category_id) {
      filteredRessources = filteredRessources.filter(r => r.category_id === filters.category_id);
    }
    
    if (filters.member_id) {
      filteredRessources = filteredRessources.filter(r => r.member_id === filters.member_id);
    }
    
    if (filters.visibility_id) {
      filteredRessources = filteredRessources.filter(r => r.visibility_id === filters.visibility_id);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredRessources = filteredRessources.filter(r => {
        // Trouver tous les tag_id associés à cette ressource
        const resourceTagIds = this.resourceTags
          .filter(rt => rt.resource_id === r.id_resource)
          .map(rt => rt.tag_id);
        
        // Vérifier si au moins un des tags recherchés est présent
        return filters.tags!.some(tagId => resourceTagIds.includes(tagId));
      });
    }
    
    if (filters.dateDebut) {
      filteredRessources = filteredRessources.filter(r => 
        r.created_at >= filters.dateDebut!
      );
    }
    
    if (filters.dateFin) {
      filteredRessources = filteredRessources.filter(r => 
        r.created_at <= filters.dateFin!
      );
    }
    
    // Appliquer la recherche textuelle
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase().trim();
      filteredRessources = filteredRessources.filter(r => 
        r.title.toLowerCase().includes(term) || 
        r.description.toLowerCase().includes(term) || 
        r.author?.toLowerCase().includes(term) ||
        r.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    return of(filteredRessources);
  }

  /**
   * Récupère les valeurs uniques pour les filtres
   */
  getFilterOptions(): Observable<{
    categories: Category[];
    tags: Tag[];
    visibilities: Visibility[];
    members: { id: number, name: string }[];
  }> {
    return of({
      categories: this.categories,
      tags: this.tags,
      visibilities: this.visibilities,
      members: this.members
    });
  }

  /**
   * Incrémente le compteur de vues d'une ressource
   */
  incrementViews(id: number): Observable<boolean> {
    const viewIndex = this.views.findIndex(v => v.resource_id === id);
    if (viewIndex !== -1) {
      this.views[viewIndex].count++;
      
      // Mettre à jour la propriété views dans l'objet ressource
      const resourceIndex = this.ressources.findIndex(r => r.id_resource === id);
      if (resourceIndex !== -1) {
        this.ressources[resourceIndex].views = this.views[viewIndex].count;
      }
      
      return of(true);
    }
    return of(false);
  }
} 