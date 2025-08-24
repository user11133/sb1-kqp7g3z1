import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop" alt="Tunisie Telecom" class="logo-img">
          <h1 class="logo-text">Tunisie Telecom</h1>
        </div>
        <div class="user-info">
          <span class="welcome-text">Bienvenue, Admin</span>
          <div class="user-avatar">
            <span>A</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, var(--tt-red) 0%, #c41e24 100%);
      color: white;
      padding: 16px 0;
      box-shadow: var(--shadow-lg);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .welcome-text {
      font-size: 14px;
      opacity: 0.9;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
  `]
})
export class HeaderComponent {}