import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnersTableComponent } from '../learners-table/learners-table.component';
import { EditLearnerPopupComponent } from '../edit-learner-popup/edit-learner-popup.component';
import { AddLearnersPopupComponent } from '../add-learners-popup/add-learners-popup.component';
import { OnboardingService } from '../../services/onboarding.service';

// Interface pour les apprenants de l'application
interface Apprenant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  promo: string;
  statut: string;
  progression: number;
}

// Interface pour le format ILearner utilisé par le composant AddLearnersPopup
interface ILearner {
  id: number | undefined;
  lastName: string;
  firstName: string;
  mail: string;
  phoneNumber: string;
  promoId: number | undefined;
}

@Component({
  selector: 'app-apprenants',
  standalone: true,
  imports: [
    CommonModule,
    LearnersTableComponent,
    EditLearnerPopupComponent,
    AddLearnersPopupComponent
  ],
  templateUrl: './apprenants.component.html',
  styleUrls: ['./apprenants.component.scss']
})
export class ApprenantsComponent implements OnInit {
  showAddLearnersPopup = false;
  showEditLearnerPopup = false;
  selectedLearner: any = null;

  // Données fictives pour les apprenants
  apprenants: Apprenant[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      promo: 'Dev Web 2023',
      statut: 'Actif',
      progression: 75
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@example.com',
      promo: 'Data Science 2023',
      statut: 'Actif',
      progression: 85
    },
    {
      id: 3,
      nom: 'Dubois',
      prenom: 'Pierre',
      email: 'pierre.dubois@example.com',
      promo: 'Dev Web 2023',
      statut: 'Inactif',
      progression: 45
    }
  ];

  constructor(private onboardingService: OnboardingService) { }

  ngOnInit(): void {
    // Marquer l'étape comme complétée quand l'utilisateur visite la page
    this.onboardingService.completeStep(2);
  }

  openAddLearnersPopup(): void {
    this.showAddLearnersPopup = true;
  }

  closeAddLearnersPopup(): void {
    this.showAddLearnersPopup = false;
  }

  openEditLearnerPopup(learner: any): void {
    this.selectedLearner = learner;
    this.showEditLearnerPopup = true;
  }

  closeEditLearnerPopup(): void {
    this.showEditLearnerPopup = false;
    this.selectedLearner = null;
  }

  handleLearnerEdit(learner: any): void {
    // Logique pour mettre à jour un apprenant
    const index = this.apprenants.findIndex(a => a.id === learner.id);
    if (index !== -1) {
      this.apprenants[index] = { ...learner };
    }
    this.closeEditLearnerPopup();
  }

  handleLearnerAdd(event: any): void {
    // Vérifier si nous avons reçu un tableau d'objets ILearner
    const learners = Array.isArray(event) ? event : [event];
    
    // Convertir les objets ILearner en apprenants
    const newApprenants = learners.map(learner => this.convertILearnerToApprenant(learner));
    
    // Ajouter les nouveaux apprenants à la liste
    this.apprenants = [...this.apprenants, ...newApprenants];
    
    // Fermer le popup
    this.closeAddLearnersPopup();
  }
  
  // Convertir un objet ILearner en objet Apprenant
  private convertILearnerToApprenant(learner: ILearner): Apprenant {
    const lastId = this.apprenants.length > 0 
      ? Math.max(...this.apprenants.map(a => a.id)) 
      : 0;
      
    return {
      id: learner.id || lastId + 1,
      nom: learner.lastName,
      prenom: learner.firstName,
      email: learner.mail,
      promo: learner.promoId ? `Promo ${learner.promoId}` : 'Non assigné',
      statut: 'Actif', // Valeur par défaut
      progression: 0 // Valeur par défaut
    };
  }

  getApprenantsActifs(): number {
    return this.apprenants.filter(a => a.statut === 'Actif').length;
  }

  getProgressionMoyenne(): number {
    if (this.apprenants.length === 0) {
      return 0;
    }
    const somme = this.apprenants.reduce((sum, a) => sum + a.progression, 0);
    return Math.round(somme / this.apprenants.length);
  }
} 