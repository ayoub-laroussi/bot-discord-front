import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { BehaviorSubject, Observable, filter } from 'rxjs';

export interface OnboardingStep {
  path: string;
  label: string;
  completed: boolean;
}

/**
 * Service pour gérer l'état du processus d'onboarding
 * et assurer la communication entre les composants
 */
@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  
  private steps: OnboardingStep[] = [
    { path: '/dashboard', label: 'Dashboard', completed: false },
    { path: '/formations', label: 'Formations', completed: false },
    { path: '/apprenants', label: 'Apprenants', completed: false },
    { path: '/promos', label: 'Promos', completed: false },
    { path: '/campus', label: 'Campus', completed: false }
  ];

  private currentStepIndex = new BehaviorSubject<number>(0);
  
  // Tableau pour suivre la complétion de chaque étape
  private stepsCompleted = new BehaviorSubject<boolean[]>(
    this.steps.map(step => step.completed)
  );

  constructor(private router: Router) {
    // Écouter les événements de navigation pour mettre à jour l'étape actuelle
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentStep(event.urlAfterRedirects);
    });

    // Initialiser l'étape actuelle basée sur l'URL au démarrage
    const currentUrl = this.router.url;
    if (currentUrl) {
      this.updateCurrentStep(currentUrl);
    }
  }

  /**
   * Met à jour l'étape actuelle basée sur l'URL
   */
  private updateCurrentStep(url: string): void {
    // Normaliser l'URL (enlever les paramètres de requête)
    const normalizedUrl = url.split('?')[0];
    
    // Trouver l'index de l'étape correspondant à l'URL
    const index = this.steps.findIndex(step => 
      normalizedUrl === step.path || normalizedUrl.startsWith(step.path + '/')
    );
    
    if (index !== -1) {
      this.currentStepIndex.next(index);
    }
  }

  /**
   * Récupère la liste des étapes d'onboarding
   */
  getSteps(): OnboardingStep[] {
    return this.steps.map((step, index) => ({
      ...step,
      completed: this.stepsCompleted.value[index]
    }));
  }

  /**
   * Récupère l'index de l'étape actuelle
   */
  getCurrentStepIndex(): Observable<number> {
    return this.currentStepIndex.asObservable();
  }

  /**
   * Récupère le statut de complétion des étapes
   */
  getStepsCompleted(): Observable<boolean[]> {
    return this.stepsCompleted.asObservable();
  }

  /**
   * Marque une étape comme complétée
   */
  completeStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      const updatedSteps = [...this.stepsCompleted.value];
      updatedSteps[index] = true;
      this.stepsCompleted.next(updatedSteps);
    }
  }

  /**
   * Navigue vers l'étape suivante
   */
  goToNextStep(): void {
    const currentIndex = this.currentStepIndex.value;
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < this.steps.length) {
      this.router.navigate([this.steps[nextIndex].path]);
    }
  }

  /**
   * Navigue vers l'étape précédente
   */
  goToPreviousStep(): void {
    const currentIndex = this.currentStepIndex.value;
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      this.router.navigate([this.steps[prevIndex].path]);
    }
  }

  /**
   * Navigue vers une étape spécifique
   */
  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.router.navigate([this.steps[index].path]);
    }
  }
} 