export enum UserRole {
  CONSUMER = 'CONSUMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN'
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
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  customPhoto?: string; // custom uploaded photo mapping
  customPhotoStatus?: 'pending' | 'approved' | 'rejected';
  openTime?: string;
  closeTime?: string;
}

export interface Crop {
  id: string;
  name: string;
  category: 'Vegetable' | 'Fruit' | 'Spice' | 'Root';
  currentPrice: number;
  change7d: number;
  history: PricePoint[];
  vendors: Vendor[];
  demand: 'High' | 'Medium' | 'Low';
  icon: string;
  weightPerUnit: number; // kg per single unit (e.g. 0.1kg per onion)
  lastUpdated?: string; // ISO timestamp of last price change
}

export interface BudgetListItem {
  cropId: string;
  quantity: number; // Number of units or kg depending on unit
  unit: 'qty' | 'kg'; // Whether quantity represents units or kilograms
}

export interface SystemAlert {
  id: string;
  type: 'OPPORTUNITY' | 'PERFORMANCE' | 'SECURITY' | 'HEALTH' | 'COMMUNITY';
  message: string;
  suggestion: string;
  timestamp: string;
  actionLabel?: string;
}

export interface UserRecord {
  name?: string;
  email: string;
  password?: string; // Only used for seeded mock users; Supabase handles real auth
  role: UserRole;
  status: 'active' | 'pending' | 'banned';
  isVerified?: boolean;
  verificationStatus?: 'none' | 'pending_review' | 'verified' | 'rejected'; // document review lifecycle
  verificationRequestedAt?: string;
  verificationSubmittedAt?: string; // ISO timestamp of when documents were submitted for review
  verificationDocs?: string[]; // base64 data URLs of uploaded documents (JPEG/PNG/PDF)
  verificationRejectedReason?: string; // reason given by admin when rejecting documents
  shopName?: string;         // Custom vendor shop/store name
  specialty?: string;        // e.g. "Organic Fruits", "Farm-fresh Vegetables"
  shopDescription?: string;  // Short bio / tagline
  shopLocation?: string;     // Market stall or address
  openTime?: string;
  closeTime?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  active: boolean;
  duration?: number; // in seconds
}

export interface Complaint {
  id: string;
  from: string;        // email of complainant
  fromRole: UserRole;
  targetUser?: string;  // email of target (optional)
  subject: string;
  message: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  timestamp: string;
  adminNote?: string;
}
