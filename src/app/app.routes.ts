import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PromosComponent } from './components/promos/promos.component';
import { PromoDetailComponent } from './components/promo-detail/promo-detail.component';
import { RessourcesComponent } from './components/ressources/ressources.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'promos', component: PromosComponent },
  { path: 'promos/:id', component: PromoDetailComponent },
  { path: 'ressources', component: RessourcesComponent },
];
