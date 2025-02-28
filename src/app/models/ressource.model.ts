export interface Ressource {
  id: number;
  titre: string;
  description: string;
  type: 'document' | 'video' | 'lien' | 'cours' | 'autre';
  url: string;
  dateCreation: Date;
  auteur: string;
  categorie: string;
  tags: string[];
  formation?: string;
  campus?: string;
  promo?: string;
  estPublic: boolean;
  vues: number;
  telechargements?: number;
}

export type RessourceFilters = {
  type?: string;
  categorie?: string;
  formation?: string;
  campus?: string;
  promo?: string;
  estPublic?: boolean;
  tags?: string[];
  dateDebut?: Date;
  dateFin?: Date;
}; 