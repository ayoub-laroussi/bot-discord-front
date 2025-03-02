import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveStepDisplayBarComponent, StepConfig } from '../active-step-display-bar/active-step-display-bar.component';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-onboarding-header',
  standalone: true,
  imports: [CommonModule, ActiveStepDisplayBarComponent],
  template: `
    <div class="onboarding-header bg-white p-4 rounded-lg shadow-sm mb-6">
      <h2 class="text-xl font-semibold text-center mb-4">Processus d'onboarding</h2>
      <app-active-step-display-bar 
        [step]="currentStep"
        [steps]="stepConfigs">
      </app-active-step-display-bar>
      
      <div class="flex justify-between mt-6">
        <button 
          *ngIf="currentStep > 1"
          (click)="previousStep()"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
          <i class="fas fa-arrow-left mr-2"></i>
          Précédent
        </button>
        <div *ngIf="currentStep === 1"></div> <!-- Placeholder pour l'alignement -->
        
        <button 
          *ngIf="currentStep < totalSteps"
          (click)="nextStep()"
          class="px-4 py-2 bg-[#E40046] text-white rounded-md hover:bg-[#c8003e]">
          Suivant
          <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-header {
      border-left: 4px solid #E40046;
    }
  `]
})
export class OnboardingHeaderComponent implements OnInit {
  currentStep: number = 1;
  totalSteps: number = 5;
  
  stepConfigs: StepConfig[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/formations', label: 'Formations' },
    { path: '/promos', label: 'Promos' },
    { path: '/campus', label: 'Campus' },
    { path: '/apprenants', label: 'Apprenants' }
  ];

  constructor(private onboardingService: OnboardingService) {}

  ngOnInit(): void {
    // S'abonner aux changements d'étape
    this.onboardingService.getCurrentStepIndex().subscribe(index => {
      this.currentStep = index + 1;
    });
  }

  nextStep(): void {
    this.onboardingService.goToNextStep();
  }

  previousStep(): void {
    this.onboardingService.goToPreviousStep();
  }
} 