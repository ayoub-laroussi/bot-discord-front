export interface Signalement {
  id_signalement: number;
  motif: string;
  description?: string;
  date_signalement: Date;
  statut: SignalementStatut;
  id_resource: number;
  id_member: number;
  
  // Propriétés étendues pour l'affichage
  resource_title?: string;
  member_name?: string;
}

export enum SignalementStatut {
  EnAttente = 'en_attente',
  Traite = 'traite',
  Rejete = 'rejete'
}

export type SignalementFilters = {
  statut?: SignalementStatut;
  id_resource?: number;
  id_member?: number;
  dateDebut?: Date;
  dateFin?: Date;
  searchTerm?: string;
}; 