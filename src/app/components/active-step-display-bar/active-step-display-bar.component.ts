import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

export interface StepConfig {
  path: string;
  label: string;
}

@Component({
  selector: 'app-active-step-display-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './active-step-display-bar.component.html',
  styleUrl: './active-step-display-bar.component.scss',
})
export class ActiveStepDisplayBarComponent implements OnInit {
  @Input() step = 1;
  @Input() steps: StepConfig[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/formations', label: 'Formations' },
    { path: '/promos', label: 'Promos' },
    { path: '/campus', label: 'Campus' },
    { path: '/apprenants', label: 'Apprenants' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // S'abonner aux événements de navigation pour mettre à jour l'étape active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateActiveStep(event.url);
    });

    // Définir l'étape active initiale
    this.updateActiveStep(this.router.url);
  }

  private updateActiveStep(url: string): void {
    // Trouver l'index de l'étape correspondant à l'URL actuelle
    const index = this.steps.findIndex(step => 
      url.includes(step.path.replace('/', ''))
    );
    
    if (index !== -1) {
      this.step = index + 1;
    }
  }

  navigateToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.router.navigate([this.steps[index].path.replace('/', '')]);
    }
  }

  getStepIndex(path: string): number {
    return this.steps.findIndex(step => step.path === path);
  }
}
