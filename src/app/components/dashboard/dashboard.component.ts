/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { LearnerChartConfig } from '../../Helpers/LearnerChartConfig';
import { PromosChartConfig } from '../../Helpers/PromosChartConfig';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  /**
   * Configuration du graphique des promos
   * @see {@link PromosChartConfig}
   */
  private _promosChartConfig: any = PromosChartConfig.config;

  /**
   * Configuration du graphique des apprenants
   * @see {@link LearnerChartConfig}
   */
  private _apprenantsChartConfig: any = LearnerChartConfig.config;

  /**
   * Instance du graphique des promos
   */
  private _promosChart: any;

  /**
   * Instance du graphique des apprenants
   */
  private _apprenantsChart: any;

  /**
   * Données statistiques pour le dashboard
   */
  public dashboardStats = {
    totalPromos: 42,
    promosGrowth: 12,
    totalApprenants: 1234,
    apprenantsGrowth: 8,
    tauxReussite: 92,
    tauxReussiteGrowth: 3,
    tauxInsertion: 85,
    tauxInsertionGrowth: -2,
    promosEnCours: 24,
    apprenantsActifs: 820,
    tauxAssiduite: 95,
    satisfaction: 88
  };

  /**
   * Liste des promos récentes pour le tableau
   */
  public recentPromos = [
    {
      nom: 'Dev Web FS 2023',
      lieu: 'Paris',
      dateDebut: '15/09/2023',
      statut: 'En cours'
    },
    {
      nom: 'Data Analyst 2023',
      lieu: 'Lyon',
      dateDebut: '01/10/2023',
      statut: 'En cours'
    },
    {
      nom: 'DevOps 2023',
      lieu: 'Marseille',
      dateDebut: '15/10/2023',
      statut: 'À venir'
    },
    {
      nom: 'IA & ML 2023',
      lieu: 'Bordeaux',
      dateDebut: '01/11/2023',
      statut: 'À venir'
    }
  ];

  //#region ACCESSORS
  public get promosChartConfig(): any {
    return this._promosChartConfig;
  }

  public get apprenantsChartConfig(): any {
    return this._apprenantsChartConfig;
  }

  public get promosChart(): any {
    return this._promosChart;
  }

  public set promosChart(value: any) {
    this._promosChart = value;
  }

  public get apprenantsChart(): any {
    return this._apprenantsChart;
  }

  public set apprenantsChart(value: any) {
    this._apprenantsChart = value;
  }
  //#endregion

  /**
   * Initialise les graphiques lors de l'initialisation du composant
   */
  ngOnInit() {
    // Initialisation du graphique des promos
    this.promosChart = new Chart('promosChart', this.promosChartConfig);
    
    // Initialisation du graphique des apprenants
    this.apprenantsChart = new Chart(
      'apprenantsChart',
      this.apprenantsChartConfig
    );
  }

  /**
   * Change la période d'affichage des graphiques (année, mois, semaine)
   * @param period La période à afficher ('year', 'month', 'week')
   * @param chartType Le type de graphique à mettre à jour ('promos', 'apprenants')
   */
  changePeriod(period: string, chartType: string): void {
    // Logique pour changer la période d'affichage des graphiques
    console.log(`Changing ${chartType} chart period to ${period}`);
    
    // Ici, on pourrait mettre à jour les données des graphiques en fonction de la période
    // et rafraîchir les graphiques
  }
}
