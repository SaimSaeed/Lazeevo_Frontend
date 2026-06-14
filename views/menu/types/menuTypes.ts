export interface Category {
  id: number;
  name: string;
  code?: string;
  emoji?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  item_count: number;
  createdAt: string;
}

export interface MenuItemVariant {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
}

export interface MenuItemTopping {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  code?: string;
  description?: string;
  price: number;
  costPrice?: number;
  isAvailable: boolean;
  isKitchenItem: boolean;
  isTaxable: boolean;
  image?: string;
  maxToppings: number;
  variants: MenuItemVariant[];
  toppings: MenuItemTopping[];
  createdAt: string;
}
