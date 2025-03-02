import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Formation {
  id?: number;
  titre: string;
  description: string;
  duree: number;
  niveau: string;
  technos: string[];
  image: string;
  popularite: number;
}

@Component({
  selector: 'app-add-formation-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-formation-popup.component.html',
  styleUrls: ['./add-formation-popup.component.scss']
})
export class AddFormationPopupComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() addFormation = new EventEmitter<Formation>();

  formation: Formation = {
    titre: '',
    description: '',
    duree: 6,
    niveau: 'Débutant',
    technos: [],
    image: 'assets/images/formations/default.jpg',
    popularite: 4.0
  };

  niveaux: string[] = ['Débutant', 'Intermédiaire', 'Avancé'];
  technoInput: string = '';
  
  // Suggestions de technologies
  technoSuggestions: string[] = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js',
    'Node.js', 'Express', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django',
    'Flask', 'Ruby', 'Rails', 'Java', 'Spring', 'C#', '.NET', 'SQL', 'MongoDB',
    'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Git', 'GitHub', 'GitLab', 'CI/CD', 'TDD', 'Agile', 'Scrum', 'Kanban',
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  closePopup(): void {
    this.close.emit();
  }

  addTechno(): void {
    if (this.technoInput.trim() !== '' && !this.formation.technos.includes(this.technoInput.trim())) {
      this.formation.technos.push(this.technoInput.trim());
      this.technoInput = '';
    }
  }

  removeTechno(techno: string): void {
    this.formation.technos = this.formation.technos.filter(t => t !== techno);
  }

  selectTechnoSuggestion(techno: string): void {
    if (!this.formation.technos.includes(techno)) {
      this.formation.technos.push(techno);
    }
    this.technoInput = '';
  }

  get filteredTechnoSuggestions(): string[] {
    if (!this.technoInput.trim()) return [];
    
    return this.technoSuggestions.filter(
      techno => techno.toLowerCase().includes(this.technoInput.toLowerCase()) && 
                !this.formation.technos.includes(techno)
    ).slice(0, 5); // Limiter à 5 suggestions
  }

  submitFormation(): void {
    if (this.isFormValid()) {
      this.addFormation.emit({...this.formation});
      this.closePopup();
    }
  }

  isFormValid(): boolean {
    return this.formation.titre.trim() !== '' && 
           this.formation.description.trim() !== '' && 
           this.formation.duree > 0 &&
           this.formation.technos.length > 0;
  }
} 