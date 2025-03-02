import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Campus {
  id?: number;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  capacite: number;
  image: string;
  coordonnees: {
    lat: number;
    lng: number;
  };
}

@Component({
  selector: 'app-add-campus-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-campus-popup.component.html',
  styleUrls: ['./add-campus-popup.component.scss']
})
export class AddCampusPopupComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() addCampus = new EventEmitter<Campus>();

  campus: Campus = {
    nom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
    telephone: '',
    email: '',
    capacite: 50,
    image: 'assets/images/campus/default.jpg',
    coordonnees: {
      lat: 48.8566,
      lng: 2.3522
    }
  };

  // Liste des pays disponibles pour la sélection
  pays: string[] = ['France', 'Belgique', 'Suisse', 'Maroc', 'Sénégal', 'Côte d\'Ivoire', 'Canada'];

  constructor() { }

  ngOnInit(): void {
  }

  closePopup(): void {
    this.close.emit();
  }

  submitCampus(): void {
    if (this.isFormValid()) {
      // Émettre une copie du campus pour éviter les références
      this.addCampus.emit({...this.campus});
      this.closePopup();
    }
  }

  isFormValid(): boolean {
    return this.campus.nom.trim() !== '' && 
           this.campus.adresse.trim() !== '' && 
           this.campus.ville.trim() !== '' &&
           this.campus.codePostal.trim() !== '' &&
           this.campus.pays.trim() !== '' &&
           this.campus.telephone.trim() !== '' &&
           this.campus.email.trim() !== '' &&
           this.campus.capacite > 0;
  }

  // Utilitaire pour formater le numéro de téléphone
  formatTelephone(event: any): void {
    const value = event.target.value.replace(/\D/g, '');
    
    // Format simple pour tous les pays (ajuster selon les besoins)
    if (value.length > 0) {
      this.campus.telephone = value.replace(/(\d{2})/g, '$1 ').trim();
    } else {
      this.campus.telephone = '';
    }
  }
}
