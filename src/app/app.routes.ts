import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PromosComponent } from './components/promos/promos.component';
import { PromoDetailComponent } from './components/promo-detail/promo-detail.component';
import { RessourcesComponent } from './components/ressources/ressources.component';
import { SignalementsComponent } from './components/signalements/signalements.component';
import { CommentairesComponent } from './components/commentaires/commentaires.component';
import { LogsComponent } from './components/logs/logs.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'promos', component: PromosComponent },
  { path: 'promos/:id', component: PromoDetailComponent },
  { path: 'ressources', component: RessourcesComponent },
  { path: 'signalements', component: SignalementsComponent },
  { path: 'commentaires', component: CommentairesComponent },
  { path: 'logs', component: LogsComponent },
];
