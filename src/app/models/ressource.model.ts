export interface Ressource {
  id_resource: number;
  title: string;
  description: string;
  content_url: string;
  created_at: Date;
  updated_at: Date;
  visibility_id: number;
  member_id: number;
  category_id: number;
  
  // Propriétés étendues pour l'affichage (non présentes dans le MPD mais utiles pour l'UI)
  author?: string; // Nom du membre associé à member_id
  category?: string; // Nom de la catégorie associée à category_id
  tags?: string[]; // Tags associés à la ressource
  views?: number; // Nombre de vues (calculé à partir de la table Reports)
}

export interface Tag {
  id_tag: number;
  tag_name: string;
}

export interface Category {
  id_category: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  parent_id?: number;
}

export interface Visibility {
  id_visibility: number;
  name: string; // public, private, etc.
}

export type RessourceFilters = {
  category_id?: number;
  member_id?: number;
  visibility_id?: number;
  tags?: number[];
  dateDebut?: Date;
  dateFin?: Date;
  searchTerm?: string;
}; 