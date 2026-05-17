export interface RestaurantTenant {
  id: number;
  name: string;
  slug: string;
  ownerName: string;
  phone: string;
  city: string;
  address?: string;
  plan: string;
  billingCycle: string;
  subscriptionStatus: string;
  isActive: boolean;
  createdAt: string;
}
