import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffCardComponent } from '../staff-card/staff-card.component';
import { AddCampusPopupComponent } from '../add-campus-popup/add-campus-popup.component';

interface Campus {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  capacite: number;
  nbFormations: number;
  nbApprenants: number;
  image: string;
  coordonnees: {
    lat: number;
    lng: number;
  };
  staff: Staff[];
}

interface Staff {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  email: string;
  photo: string;
}

@Component({
  selector: 'app-campus',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffCardComponent, AddCampusPopupComponent],
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit {
  searchTerm: string = '';
  selectedPays: string = '';
  
  // Afficher ou masquer la popup d'ajout de campus
  showAddCampusPopup: boolean = false;
  
  // Liste des pays pour le filtre
  pays: string[] = ['France', 'Belgique', 'Suisse', 'Maroc', 'Sénégal'];
  
  // Campus sélectionné pour afficher les détails
  selectedCampus: Campus | null = null;
  
  // Données fictives pour les campus
  campus: Campus[] = [
    {
      id: 1,
      nom: 'Simplon Paris',
      adresse: '55 Rue de Vincennes',
      ville: 'Montreuil',
      codePostal: '93100',
      pays: 'France',
      telephone: '+33 1 48 57 75 80',
      email: 'contact.paris@simplon.co',
      capacite: 150,
      nbFormations: 8,
      nbApprenants: 120,
      image: 'assets/images/campus/paris.jpg',
      coordonnees: {
        lat: 48.8566,
        lng: 2.3522
      },
      staff: [
        {
          id: 1,
          nom: 'Dupont',
          prenom: 'Jean',
          poste: 'Directeur',
          email: 'jean.dupont@simplon.co',
          photo: 'assets/images/staff/jean-dupont.jpg'
        },
        {
          id: 2,
          nom: 'Martin',
          prenom: 'Sophie',
          poste: 'Responsable pédagogique',
          email: 'sophie.martin@simplon.co',
          photo: 'assets/images/staff/sophie-martin.jpg'
        }
      ]
    },
    {
      id: 2,
      nom: 'Simplon Lyon',
      adresse: '107 Rue de Marseille',
      ville: 'Lyon',
      codePostal: '69007',
      pays: 'France',
      telephone: '+33 4 28 29 19 19',
      email: 'contact.lyon@simplon.co',
      capacite: 100,
      nbFormations: 6,
      nbApprenants: 85,
      image: 'assets/images/campus/lyon.jpg',
      coordonnees: {
        lat: 45.7578,
        lng: 4.8320
      },
      staff: [
        {
          id: 3,
          nom: 'Dubois',
          prenom: 'Pierre',
          poste: 'Directeur',
          email: 'pierre.dubois@simplon.co',
          photo: 'assets/images/staff/pierre-dubois.jpg'
        }
      ]
    },
    {
      id: 3,
      nom: 'Simplon Dakar',
      adresse: 'Sacré Cœur 3',
      ville: 'Dakar',
      codePostal: '12500',
      pays: 'Sénégal',
      telephone: '+221 33 824 44 44',
      email: 'contact.dakar@simplon.co',
      capacite: 80,
      nbFormations: 4,
      nbApprenants: 65,
      image: 'assets/images/campus/dakar.jpg',
      coordonnees: {
        lat: 14.7167,
        lng: -17.4677
      },
      staff: [
        {
          id: 4,
          nom: 'Diop',
          prenom: 'Fatou',
          poste: 'Directrice',
          email: 'fatou.diop@simplon.co',
          photo: 'assets/images/staff/fatou-diop.jpg'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Filtrer les campus en fonction des critères de recherche
  get filteredCampus(): Campus[] {
    return this.campus.filter(campus => {
      // Filtre par terme de recherche
      const matchesSearch = this.searchTerm === '' || 
        campus.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campus.ville.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtre par pays
      const matchesPays = this.selectedPays === '' || campus.pays === this.selectedPays;
      
      return matchesSearch && matchesPays;
    });
  }

  // Sélectionner un campus pour afficher ses détails
  selectCampus(campus: Campus): void {
    this.selectedCampus = campus;
  }

  // Fermer les détails du campus
  closeCampusDetails(): void {
    this.selectedCampus = null;
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedPays = '';
  }

  // Ouvrir la popup d'ajout de campus
  openAddCampusPopup(): void {
    this.showAddCampusPopup = true;
  }

  // Fermer la popup d'ajout de campus
  closeAddCampusPopup(): void {
    this.showAddCampusPopup = false;
  }

  // Ajouter un nouveau campus
  addNewCampus(campus: any): void {
    // Générer un ID unique pour le nouveau campus
    const newId = Math.max(...this.campus.map(c => c.id)) + 1;
    
    // Ajouter les propriétés manquantes
    const newCampus = {
      ...campus,
      id: newId,
      nbFormations: 0,
      nbApprenants: 0,
      staff: []
    };
    
    // Ajouter le campus à la liste
    this.campus.push(newCampus);
    
    // Fermer la popup
    this.closeAddCampusPopup();
  }
} 