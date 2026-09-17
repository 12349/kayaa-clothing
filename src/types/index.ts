export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Category = 
  | 'anarkali' 
  | 'lehenga' 
  | 'saree-blouse' 
  | 'kurta-set' 
  | 'co-ord' 
  | 'dupatta';

export type MotifType = 'buti' | 'jaal' | 'bandhani' | 'leheriya' | 'stripe';

export interface ProductArt {
  h1: string;        // primary hue / ground
  h2: string;        // motif / accent hue
  motif: MotifType;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  story: string; // A sentence about the fabric or the technique
  fabric: string;
  care: string;
  colourName: string;
  priceInr: number;
  salePriceInr?: number;
  art: ProductArt;
  images: string[]; // data-URLs when uploaded; empty in the demo
  sizeStock: Record<Size, number>;
  madeToMeasure: boolean;
  madeToMeasurePremiumInr: number;
  readyLeadDays: number; // dispatch time for an in-stock size
  customLeadDays: number; // dispatch time for made-to-measure
  capacityPerWeek: number; // custom slots per week
  status: 'live' | 'draft' | 'archived';
}

export interface MeasurementProfile {
  profileName?: string;
  unit: 'in' | 'cm';
  bust: number;
  waist: number;
  hips: number;
  height: number;
  shoulder?: number;
  blouseSleeveLength?: number;
  lehengaWaistToFloor?: number;
  fallAndPico?: boolean;
  petticoatNeeded?: boolean;
  blousePadding?: boolean;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  slug: string;
  fabric: string;
  art: ProductArt;
  size: Size | 'made-to-measure';
  measurements?: MeasurementProfile;
  customNote?: string;
  quantity: number;
  unitPriceInr: number;
  m2mSurchargeInr: number;
  lineTotalInr: number;
}

export type OrderStatus = 
  | 'new'
  | 'payment_confirmed'
  | 'cutting'
  | 'stitching'
  | 'finishing'
  | 'dispatched'
  | 'delivered';

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface ShippingAddress {
  fullName: string;
  phone: string; // WhatsApp number with country code
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string; // KY-YYMM-XXXX
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: ShippingAddress;
  occasion?: string;
  neededByDate?: string;
  fitConcerns?: string;
  referralSource: 'instagram_post' | 'instagram_dm' | 'friend_family' | 'google' | 'other';
  referralDetails?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'cod_pending';
  subtotalInr: number;
  m2mSurchargeTotalInr: number;
  shippingInr: number;
  gstPlaceholderInr: number;
  grandTotalInr: number;
  paidAmountInr: number;
  dispatchByDate: string;
  estimatedDeliveryDate: string;
  reviewSubmitted?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  orderId: string;
  customerName: string;
  sizeOrdered: string;
  rating: number; // 1-5
  fitVerdict: 'too_tight' | 'perfect' | 'too_loose';
  fitAreaNotes?: string;
  comment: string;
  createdAt: string;
  photoDataUrl?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  lifetimeValueInr: number;
  savedProfiles: MeasurementProfile[];
  fitFeedbackFlags: Array<{ orderId: string; note: string; date: string }>;
}

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'AED' | 'CAD' | 'AUD';
