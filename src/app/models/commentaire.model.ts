export interface Commentaire {
  id_commentaire: number;
  contenu: string;
  date_creation: Date;
  date_modification?: Date;
  id_resource: number;
  id_member: number;
  
  // Propriétés étendues pour l'affichage
  resource_title?: string;
  member_name?: string;
  likes?: number;
  dislikes?: number;
}

export type CommentaireFilters = {
  id_resource?: number;
  id_member?: number;
  dateDebut?: Date;
  dateFin?: Date;
  searchTerm?: string;
}; 