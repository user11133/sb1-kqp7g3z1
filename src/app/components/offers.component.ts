import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Offer } from '../models/user.model';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="offers-container">
      <div class="offers-header">
        <h2>Gestion des Offres Fibre</h2>
        <button class="btn btn-primary" (click)="showAddForm = true">
          + Nouvelle Offre
        </button>
      </div>

      <div class="offers-grid">
        <div *ngFor="let offer of offers" class="offer-card">
          <div class="offer-header">
            <h3>{{offer.name}}</h3>
            <div class="offer-status" [class.active]="offer.isActive" [class.inactive]="!offer.isActive">
              {{offer.isActive ? 'Active' : 'Inactive'}}
            </div>
          </div>
          
          <div class="offer-details">
            <div class="speed">
              <span class="speed-value">{{offer.speed}}</span>
              <span class="speed-label">Vitesse</span>
            </div>
            
            <div class="price">
              <span class="price-value">{{offer.price}}€</span>
              <span class="price-label">par mois</span>
            </div>
          </div>
          
          <div class="offer-description">
            {{offer.description}}
          </div>
          
          <div class="offer-features">
            <div *ngFor="let feature of offer.features" class="feature">
              ✓ {{feature}}
            </div>
          </div>
          
          <div class="offer-actions">
            <button class="btn btn-secondary" (click)="editOffer(offer)">Modifier</button>
            <button class="btn btn-primary" (click)="deleteOffer(offer.id)">Supprimer</button>
          </div>
        </div>
      </div>

      <div *ngIf="showAddForm" class="modal-overlay" (click)="closeModal($event)">
        <div class="modal-content">
          <h3>{{isEditing ? 'Modifier' : 'Ajouter'}} Offre</h3>
          <form (ngSubmit)="saveOffer()" #offerForm="ngForm">
            <div class="form-group">
              <label>Nom de l'Offre</label>
              <input type="text" [(ngModel)]="currentOffer.name" name="name" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Vitesse</label>
                <input type="text" [(ngModel)]="currentOffer.speed" name="speed" placeholder="ex: 100 Mbps" required>
              </div>
              <div class="form-group">
                <label>Prix (€/mois)</label>
                <input type="number" [(ngModel)]="currentOffer.price" name="price" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="currentOffer.type" name="type" required>
                <option value="fiber">Fibre Optique</option>
                <option value="adsl">ADSL</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="currentOffer.description" name="description" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Fonctionnalités (une par ligne)</label>
              <textarea [(ngModel)]="featuresText" name="features" placeholder="Internet illimité&#10;WiFi gratuit&#10;Installation incluse"></textarea>
            </div>
            
            <div class="form-group">
              <label>
                <input type="checkbox" [(ngModel)]="currentOffer.isActive" name="isActive">
                Offre active
              </label>
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
    .offers-container {
      padding: 24px;
    }

    .offers-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .offers-header h2 {
      font-size: 28px;
      font-weight: 700;
      color: var(--tt-dark-gray);
    }

    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .offer-card {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      padding: 24px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .offer-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .offer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .offer-header h3 {
      font-size: 20px;
      font-weight: 600;
      color: var(--tt-dark-gray);
      margin: 0;
    }

    .offer-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .offer-status.active {
      background-color: #d1fae5;
      color: #059669;
    }

    .offer-status.inactive {
      background-color: #fee2e2;
      color: #dc2626;
    }

    .offer-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 16px;
      background-color: #f8fafc;
      border-radius: 8px;
    }

    .speed, .price {
      text-align: center;
    }

    .speed-value, .price-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: var(--tt-red);
    }

    .speed-label, .price-label {
      font-size: 12px;
      color: var(--tt-gray);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .offer-description {
      color: var(--tt-gray);
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .offer-features {
      margin-bottom: 24px;
    }

    .feature {
      padding: 6px 0;
      color: var(--tt-dark-gray);
      font-size: 14px;
    }

    .offer-actions {
      display: flex;
      gap: 12px;
    }

    .offer-actions .btn {
      flex: 1;
      text-align: center;
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

    .form-group input[type="checkbox"] {
      width: auto;
      margin-right: 8px;
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
      .offers-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .offers-grid {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        padding: 24px 16px;
      }
    }
  `]
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];
  showAddForm = false;
  isEditing = false;
  currentOffer: Partial<Offer> = {};
  featuresText = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadOffers();
  }

  loadOffers() {
    this.apiService.getOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
      },
      error: (error) => console.error('Error loading offers:', error)
    });
  }

  editOffer(offer: Offer) {
    this.currentOffer = { ...offer };
    this.featuresText = offer.features.join('\n');
    this.isEditing = true;
    this.showAddForm = true;
  }

  deleteOffer(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre?')) {
      this.apiService.deleteOffer(id).subscribe({
        next: () => {
          this.loadOffers();
        },
        error: (error) => console.error('Error deleting offer:', error)
      });
    }
  }

  saveOffer() {
    // Convert features text to array
    this.currentOffer.features = this.featuresText.split('\n').filter(f => f.trim());

    if (this.isEditing && this.currentOffer.id) {
      this.apiService.updateOffer(this.currentOffer.id, this.currentOffer).subscribe({
        next: () => {
          this.loadOffers();
          this.cancelEdit();
        },
        error: (error) => console.error('Error updating offer:', error)
      });
    } else {
      this.apiService.createOffer(this.currentOffer).subscribe({
        next: () => {
          this.loadOffers();
          this.cancelEdit();
        },
        error: (error) => console.error('Error creating offer:', error)
      });
    }
  }

  cancelEdit() {
    this.showAddForm = false;
    this.isEditing = false;
    this.currentOffer = {};
    this.featuresText = '';
  }

  closeModal(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cancelEdit();
    }
  }
}