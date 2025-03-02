import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { IPerson } from '../../Interfaces/IPerson';

// Interface pour représenter un membre du personnel dans le composant Campus
interface Staff {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  email: string;
  photo: string;
}

@Component({
  selector: 'app-staff-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './staff-card.component.html',
  styleUrl: './staff-card.component.scss',
})
export class StaffCardComponent {
  @Input() person: IPerson | Staff | null = null;
  @Input() role = '';
  
  get displayName(): string {
    if (!this.person) return '';
    
    // Si c'est un objet Staff
    if ('nom' in this.person && 'prenom' in this.person) {
      return `${this.person.prenom} ${this.person.nom}`;
    }
    
    // Si c'est un objet IPerson
    return this.person.name;
  }
  
  get profileImage(): string {
    if (!this.person) return '';
    
    // Si c'est un objet Staff
    if ('photo' in this.person) {
      return this.person.photo;
    }
    
    // Si c'est un objet IPerson
    return this.person.profilePictureUrl;
  }
  
  get staffRole(): string {
    if (!this.person) return this.role;
    
    // Si c'est un objet Staff avec un poste
    if ('poste' in this.person) {
      return this.person.poste;
    }
    
    // Sinon, utiliser le rôle fourni
    return this.role;
  }
}
