
export enum UserRole {
  CONSUMER = 'CONSUMER',
  VENDOR = 'VENDOR'
}




export interface PricePoint {
  date: string;
  price: number;
}

export interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  specialty: string; // Changed from location
  price: number;
  stock: number; // in kg
  isHot?: boolean;
  listingName?: string; // optional vendor-specific display name for a crop listing
}

export interface Crop {
  id: string;
  name: string;
  category: 'Vegetable' | 'Fruit' | 'Spice' | 'Root' | 'Organic';
  currentPrice: number;
  change24h: number;
  history: PricePoint[];
  vendors: Vendor[];
  demand: 'High' | 'Medium' | 'Low';
  icon: string;
  weightPerUnit: number; // kg per single unit (e.g. 0.1kg per onion)
}

export interface BudgetListItem {
  cropId: string;
  quantity: number; // Number of units
}
