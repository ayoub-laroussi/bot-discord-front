import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  section?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentRoute: string = '';
  currentYear: number = new Date().getFullYear();
  
  // Sections de navigation
  navSections = ['Onboarding', 'Community', 'Feedback'];
  
  // Liste des éléments de navigation
  navItems: NavItem[] = [
    {
      path: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-th-large',
      section: 'Onboarding'
    },
    {
      path: 'formations',
      label: 'Formations',
      icon: 'fas fa-book',
      section: 'Onboarding'
    },
    {
      path: 'promos',
      label: 'Promos',
      icon: 'fas fa-users',
      section: 'Onboarding'
    },
    {
      path: 'campus',
      label: 'Campus',
      icon: 'fas fa-building',
      section: 'Onboarding'
    },
    {
      path: 'apprenants',
      label: 'Apprenants',
      icon: 'fas fa-user-graduate',
      section: 'Onboarding'
    },
    {
      path: 'logs',
      label: 'Logs',
      icon: 'fas fa-chart-line',
      section: 'Community'
    },
    {
      path: 'moderation',
      label: 'Modération',
      icon: 'fas fa-shield-alt',
      section: 'Community'
    },
    {
      path: 'commentaires',
      label: 'Commentaires',
      icon: 'fa-regular fa-comment',
      section: 'Community'
    },
    {
      path: 'ressources',
      label: 'Ressources',
      icon: 'fa-regular fa-folder',
      section: 'Community'
    },
    {
      path: 'signalements',
      label: 'Signalements',
      icon: 'fa-regular fa-flag',
      section: 'Community'
    },
    {
      path: 'sondage',
      label: 'Sondage',
      icon: 'fa-regular fa-envelope',
      section: 'Feedback'
    }
  ];

  // Informations de l'utilisateur connecté
  userInfo = {
    name: 'Admin Simplon',
    role: 'Administrateur'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suivre les changements de route pour mettre à jour la route active
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  // Méthode pour filtrer les éléments par section
  getItemsBySection(section: string): NavItem[] {
    return this.navItems.filter(item => item.section === section);
  }

  // Méthode pour la déconnexion
  logout(): void {
    // Logique de déconnexion à implémenter
    console.log('Déconnexion...');
    // Redirection vers la page de connexion
    this.router.navigate(['/login']);
  }
}
