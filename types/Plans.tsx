export interface Plan {
  id: number;
  name: string;
  displayName: string;
  description: string;
  trialDays: number;
  limits: {
    cashiers: number | "Unlimited";
    kitchenStaff: number | "Unlimited";
    menuItems: number | "Unlimited";
    categories: number | "Unlimited";
  };
  features: {
    deliveryTracking: boolean;
    fullDashboard: boolean;
    reports: boolean;
    inventory: boolean;
    multipleReceipts: boolean;
  };
  pricing: {
    monthly: number;
    halfYearly: number;
    yearly: number;
  };
}