import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="sidebar">
      <ul class="nav-list">
        <li class="nav-item" [class.active]="activeTab === 'dashboard'" (click)="setActiveTab('dashboard')">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Dashboard</span>
        </li>
        <li class="nav-item" [class.active]="activeTab === 'users'" (click)="setActiveTab('users')">
          <span class="nav-icon">👥</span>
          <span class="nav-text">Utilisateurs</span>
        </li>
        <li class="nav-item" [class.active]="activeTab === 'offers'" (click)="setActiveTab('offers')">
          <span class="nav-icon">📦</span>
          <span class="nav-text">Offres Fibre</span>
        </li>
        <li class="nav-item" [class.active]="activeTab === 'reports'" (click)="setActiveTab('reports')">
          <span class="nav-icon">📈</span>
          <span class="nav-text">Rapports</span>
        </li>
        <li class="nav-item" [class.active]="activeTab === 'settings'" (click)="setActiveTab('settings')">
          <span class="nav-icon">⚙️</span>
          <span class="nav-text">Paramètres</span>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: white;
      border-right: 1px solid #e2e8f0;
      padding: 24px 0;
      height: calc(100vh - 72px);
      position: sticky;
      top: 72px;
      overflow-y: auto;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background-color: #f8fafc;
      border-left-color: #e2e8f0;
    }

    .nav-item.active {
      background-color: #fef2f2;
      border-left-color: var(--tt-red);
      color: var(--tt-red);
    }

    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
    }

    .nav-text {
      font-weight: 500;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 200px;
      }
      
      .nav-item {
        padding: 12px 16px;
      }
      
      .nav-text {
        font-size: 13px;
      }
    }
  `]
})
export class SidebarComponent {
  activeTab = 'dashboard';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}