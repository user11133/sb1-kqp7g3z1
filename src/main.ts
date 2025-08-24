import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './app/components/header.component';
import { SidebarComponent } from './app/components/sidebar.component';
import { DashboardComponent } from './app/components/dashboard.component';
import { UsersComponent } from './app/components/users.component';
import { OffersComponent } from './app/components/offers.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    UsersComponent,
    OffersComponent
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
      
      <div class="main-layout">
        <app-sidebar #sidebar></app-sidebar>
        
        <main class="content">
          <app-dashboard *ngIf="sidebar.activeTab === 'dashboard'"></app-dashboard>
          <app-users *ngIf="sidebar.activeTab === 'users'"></app-users>
          <app-offers *ngIf="sidebar.activeTab === 'offers'"></app-offers>
          
          <div *ngIf="sidebar.activeTab === 'reports'" class="placeholder">
            <div class="card">
              <h2>Rapports</h2>
              <p>Module de rapports en cours de développement...</p>
            </div>
          </div>
          
          <div *ngIf="sidebar.activeTab === 'settings'" class="placeholder">
            <div class="card">
              <h2>Paramètres</h2>
              <p>Module de paramètres en cours de développement...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8fafc;
    }

    .main-layout {
      display: flex;
    }

    .content {
      flex: 1;
      min-height: calc(100vh - 72px);
      background-color: #f8fafc;
    }

    .placeholder {
      padding: 24px;
    }

    .placeholder .card {
      text-align: center;
      padding: 48px 24px;
    }

    .placeholder h2 {
      font-size: 24px;
      font-weight: 600;
      color: var(--tt-dark-gray);
      margin-bottom: 16px;
    }

    .placeholder p {
      color: var(--tt-gray);
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .main-layout {
        flex-direction: column;
      }
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});