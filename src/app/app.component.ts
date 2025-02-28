import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PromosComponent } from './components/promos/promos.component';
import { CommentairesComponent } from './components/commentaires/commentaires.component';
import { LogsComponent } from './components/logs/logs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, NavbarComponent, PromosComponent, CommentairesComponent, LogsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dashboard-simplon';
}
