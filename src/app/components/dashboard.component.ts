import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { DashboardStats } from '../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>Tableau de Bord</h2>
        <p>Vue d'ensemble des services fibre optique</p>
      </div>

      <div class="stats-grid">
        <div class="card stats-card">
          <div class="stats-number" style="color: var(--tt-blue)">{{stats?.totalUsers || 0}}</div>
          <div class="stats-label">Total Utilisateurs</div>
        </div>
        <div class="card stats-card">
          <div class="stats-number" style="color: #059669">{{stats?.activeUsers || 0}}</div>
          <div class="stats-label">Utilisateurs Actifs</div>
        </div>
        <div class="card stats-card">
          <div class="stats-number" style="color: var(--tt-red)">{{stats?.totalOffers || 0}}</div>
          <div class="stats-label">Offres Disponibles</div>
        </div>
        <div class="card stats-card">
          <div class="stats-number" style="color: #d97706">{{stats?.revenue || 0}}€</div>
          <div class="stats-label">Revenus du Mois</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="card">
          <h3>Statistiques Récentes</h3>
          <div class="recent-stats">
            <div class="stat-item">
              <span class="stat-label">Nouvelles Inscriptions Aujourd'hui:</span>
              <span class="stat-value">{{stats?.newSubscriptionsToday || 0}}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Vitesse Moyenne:</span>
              <span class="stat-value">{{stats?.averageSpeed || 'N/A'}}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Actions Rapides</h3>
          <div class="quick-actions">
            <button class="btn btn-primary">Ajouter Utilisateur</button>
            <button class="btn btn-secondary">Nouvelle Offre</button>
            <button class="btn btn-primary">Générer Rapport</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h2 {
      font-size: 28px;
      font-weight: 700;
      color: var(--tt-dark-gray);
      margin-bottom: 8px;
    }

    .dashboard-header p {
      color: var(--tt-gray);
      font-size: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .recent-stats {
      padding-top: 16px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .stat-item:last-child {
      border-bottom: none;
    }

    .stat-label {
      font-weight: 500;
      color: var(--tt-dark-gray);
    }

    .stat-value {
      font-weight: 600;
      color: var(--tt-red);
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 16px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--tt-dark-gray);
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .charts-row {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.apiService.getDashboardStats().subscribe({
      next: (stats) => this.stats = stats,
      error: (error) => console.error('Error loading stats:', error)
    });
  }
}