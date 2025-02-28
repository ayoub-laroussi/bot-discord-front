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
  useful_votes?: number; // Nombre de votes utiles
  useless_votes?: number; // Nombre de votes inutiles
  reports?: number; // Nombre de signalements
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
  icon?: string; // Icône FontAwesome pour la catégorie
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