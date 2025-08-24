export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  governorate: string;
  city: string;
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  currentOffer?: Offer;
}

export interface Offer {
  id: string;
  name: string;
  speed: string;
  price: number;
  type: 'fiber' | 'adsl';
  description: string;
  features: string[];
  isActive: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOffers: number;
  revenue: number;
  newSubscriptionsToday: number;
  averageSpeed: string;
}