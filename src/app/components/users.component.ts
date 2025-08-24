import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <div class="users-header">
        <h2>Gestion des Utilisateurs</h2>
        <button class="btn btn-primary" (click)="showAddForm = true">
          + Nouvel Utilisateur
        </button>
      </div>

      <div class="search-section">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Rechercher par nom, email ou téléphone..."
          [(ngModel)]="searchTerm"
          (input)="filterUsers()"
        >
      </div>

      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Nom Complet</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Gouvernorat</th>
              <th>Statut</th>
              <th>Date d'Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>{{user.firstName}} {{user.lastName}}</td>
              <td>{{user.email}}</td>
              <td>{{user.phone}}</td>
              <td>{{user.governorate}}</td>
              <td>
                <span [class]="'status-' + user.status">{{getStatusText(user.status)}}</span>
              </td>
              <td>{{formatDate(user.registrationDate)}}</td>
              <td>
                <button class="btn-action edit" (click)="editUser(user)" title="Modifier">✏️</button>
                <button class="btn-action delete" (click)="deleteUser(user.id)" title="Supprimer">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showAddForm" class="modal-overlay" (click)="closeModal($event)">
        <div class="modal-content">
          <h3>{{isEditing ? 'Modifier' : 'Ajouter'}} Utilisateur</h3>
          <form (ngSubmit)="saveUser()" #userForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="currentUser.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="currentUser.lastName" name="lastName" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="currentUser.email" name="email" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Téléphone</label>
                <input type="tel" [(ngModel)]="currentUser.phone" name="phone" required>
              </div>
              <div class="form-group">
                <label>Gouvernorat</label>
                <select [(ngModel)]="currentUser.governorate" name="governorate" required>
                  <option value="">Sélectionner...</option>
                  <option value="Tunis">Tunis</option>
                  <option value="Ariana">Ariana</option>
                  <option value="Ben Arous">Ben Arous</option>
                  <option value="Manouba">Manouba</option>
                  <option value="Nabeul">Nabeul</option>
                  <option value="Zaghouan">Zaghouan</option>
                  <option value="Bizerte">Bizerte</option>
                  <option value="Béja">Béja</option>
                  <option value="Jendouba">Jendouba</option>
                  <option value="Kef">Kef</option>
                  <option value="Siliana">Siliana</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Monastir">Monastir</option>
                  <option value="Mahdia">Mahdia</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Kairouan">Kairouan</option>
                  <option value="Kasserine">Kasserine</option>
                  <option value="Sidi Bouzid">Sidi Bouzid</option>
                  <option value="Gabès">Gabès</option>
                  <option value="Mednine">Mednine</option>
                  <option value="Tataouine">Tataouine</option>
                  <option value="Gafsa">Gafsa</option>
                  <option value="Tozeur">Tozeur</option>
                  <option value="Kebili">Kebili</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>Ville</label>
              <input type="text" [(ngModel)]="currentUser.city" name="city" required>
            </div>
            
            <div class="form-group">
              <label>Adresse</label>
              <textarea [(ngModel)]="currentUser.address" name="address" required></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelEdit()">Annuler</button>
              <button type="submit" class="btn btn-primary">{{isEditing ? 'Modifier' : 'Ajouter'}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 24px;
    }

    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .users-header h2 {
      font-size: 28px;
      font-weight: 700;
      color: var(--tt-dark-gray);
    }

    .search-section {
      margin-bottom: 24px;
    }

    .btn-action {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 8px;
      margin: 0 2px;
      border-radius: 4px;
      font-size: 16px;
      transition: background-color 0.2s ease;
    }

    .btn-action:hover {
      background-color: #f1f5f9;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: var(--border-radius);
      padding: 32px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }

    .modal-content h3 {
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 600;
      color: var(--tt-dark-gray);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      color: var(--tt-dark-gray);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e2e8f0;
      border-radius: var(--border-radius);
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--tt-red);
      box-shadow: 0 0 0 3px rgba(227, 30, 36, 0.1);
    }

    .form-group textarea {
      height: 80px;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .users-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        padding: 24px 16px;
      }
      
      .table {
        font-size: 14px;
      }
      
      .table th,
      .table td {
        padding: 8px;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  showAddForm = false;
  isEditing = false;
  currentUser: Partial<User> = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.includes(term)
    );
  }

  editUser(user: User) {
    this.currentUser = { ...user };
    this.isEditing = true;
    this.showAddForm = true;
  }

  deleteUser(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }

  saveUser() {
    if (this.isEditing && this.currentUser.id) {
      this.apiService.updateUser(this.currentUser.id, this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEdit();
        },
        error: (error) => console.error('Error updating user:', error)
      });
    } else {
      this.apiService.createUser(this.currentUser).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEdit();
        },
        error: (error) => console.error('Error creating user:', error)
      });
    }
  }

  cancelEdit() {
    this.showAddForm = false;
    this.isEditing = false;
    this.currentUser = {};
  }

  closeModal(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cancelEdit();
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Actif',
      'inactive': 'Inactif',
      'suspended': 'Suspendu'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}