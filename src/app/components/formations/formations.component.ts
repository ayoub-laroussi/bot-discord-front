import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddFormationPopupComponent } from '../add-formation-popup/add-formation-popup.component';
import { OnboardingHeaderComponent } from '../onboarding-header/onboarding-header.component';
import { OnboardingService } from '../../services/onboarding.service';

interface Formation {
  id: number;
  titre: string;
  description: string;
  duree: number; // en mois
  niveau: string;
  technos: string[];
  image: string;
  popularite: number; // sur 5
}

@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [CommonModule, FormsModule, AddFormationPopupComponent, OnboardingHeaderComponent],
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss']
})
export class FormationsComponent implements OnInit {
  searchTerm: string = '';
  selectedNiveau: string = '';
  showAddFormationPopup: boolean = false;
  
  niveaux: string[] = ['Débutant', 'Intermédiaire', 'Avancé'];
  
  // Données fictives pour les formations
  formations: Formation[] = [
    {
      id: 1,
      titre: 'Développeur Web',
      description: 'Formation complète pour devenir développeur web full-stack.',
      duree: 6,
      niveau: 'Débutant',
      technos: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      image: 'assets/images/formations/dev-web.jpg',
      popularite: 4.5
    },
    {
      id: 2,
      titre: 'Data Scientist',
      description: 'Maîtrisez l\'analyse de données et le machine learning.',
      duree: 9,
      niveau: 'Avancé',
      technos: ['Python', 'R', 'SQL', 'TensorFlow', 'Pandas'],
      image: 'assets/images/formations/data-science.jpg',
      popularite: 4.8
    },
    {
      id: 3,
      titre: 'Développeur Mobile',
      description: 'Créez des applications mobiles pour iOS et Android.',
      duree: 7,
      niveau: 'Intermédiaire',
      technos: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
      image: 'assets/images/formations/dev-mobile.jpg',
      popularite: 4.2
    },
    {
      id: 4,
      titre: 'DevOps',
      description: 'Automatisez le déploiement et la gestion des infrastructures.',
      duree: 8,
      niveau: 'Avancé',
      technos: ['Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'AWS'],
      image: 'assets/images/formations/devops.jpg',
      popularite: 4.6
    },
    {
      id: 5,
      titre: 'UX/UI Design',
      description: 'Concevez des interfaces utilisateur intuitives et esthétiques.',
      duree: 5,
      niveau: 'Débutant',
      technos: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop'],
      image: 'assets/images/formations/ux-ui.jpg',
      popularite: 4.3
    }
  ];

  // Statistiques calculées
  get totalFormations(): number {
    return this.formations.length;
  }

  get dureeMoyenne(): number {
    return this.formations.length > 0 
      ? Math.round(this.formations.reduce((sum, f) => sum + f.duree, 0) / this.formations.length) 
      : 0;
  }

  get populariteMoyenne(): number {
    return this.formations.length > 0 
      ? parseFloat((this.formations.reduce((sum, f) => sum + f.popularite, 0) / this.formations.length).toFixed(1)) 
      : 0;
  }

  constructor(private onboardingService: OnboardingService) { }

  ngOnInit(): void {
    // Marquer cette étape comme complétée lorsque l'utilisateur visite la page
    this.onboardingService.completeStep(1); // Formations est la 2ème étape (index 1)
  }

  // Filtrer les formations en fonction des critères de recherche
  get filteredFormations(): Formation[] {
    return this.formations.filter(formation => {
      // Filtre par terme de recherche
      const matchesSearch = this.searchTerm === '' || 
        formation.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        formation.technos.some(tech => tech.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Filtre par niveau
      const matchesNiveau = this.selectedNiveau === '' || formation.niveau === this.selectedNiveau;
      
      return matchesSearch && matchesNiveau;
    });
  }

  // Générer un tableau d'étoiles pour l'affichage de la popularité
  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return [
      ...Array(fullStars).fill(1),
      ...(hasHalfStar ? [0.5] : []),
      ...Array(emptyStars).fill(0)
    ];
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedNiveau = '';
  }

  // Ouvrir le popup d'ajout de formation
  openAddFormationPopup(): void {
    this.showAddFormationPopup = true;
  }

  // Fermer le popup d'ajout de formation
  closeAddFormationPopup(): void {
    this.showAddFormationPopup = false;
  }

  // Ajouter une nouvelle formation
  handleAddFormation(formation: Partial<Formation>): void {
    // Générer un nouvel ID pour la formation
    const newFormation: Formation = {
      id: this.formations.length > 0 ? Math.max(...this.formations.map(f => f.id)) + 1 : 1,
      titre: formation.titre || '',
      description: formation.description || '',
      duree: formation.duree || 0,
      niveau: formation.niveau || '',
      technos: formation.technos || [],
      image: formation.image || '',
      popularite: formation.popularite || 0
    };
    
    this.formations.push(newFormation);
    this.closeAddFormationPopup();
  }

  // Supprimer une formation
  deleteFormation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formations = this.formations.filter(f => f.id !== id);
    }
  }
} 