import { CurrencyCode, Size } from '../types';

export const BRAND_CONFIG = {
  name: 'Kayaa Clothing',
  founder: 'Kayaa',
  tagline: 'Hand-Cut & Stitched Indian Couture from Our Studio',
  officialWhatsAppNumber: '+91 98201 54321',
  officialWhatsAppDigits: '919820154321',
  instagramHandle: '@kayaaclothingofficial',
  instagramUrl: 'https://instagram.com/kayaaclothingofficial',
  studioAddress: 'Studio 4, Chintamani Weaver Enclave, Shahpur Jat, New Delhi 110049, India',
  gstinPlaceholder: '07AABCK1234F1Z5',
  adminPin: '1984',
  
  // Anti-fraud direct statement in her authentic voice
  antiFraudStatement: `Please beware: fraudsters frequently pose as Kayaa by replying to comments on my Instagram posts with fake WhatsApp numbers asking for advance GPay or PhonePe transfers. I will never message you first from an unknown number demanding payment. Every genuine order is issued an official Kayaa Order ID (KY-YYMM-XXXX) directly on this site and can be verified anytime.`,
  
  // Currencies and fixed demo conversion rates (base: INR)
  currencies: {
    INR: { symbol: '₹', name: 'Indian Rupee', rateFromInr: 1 },
    USD: { symbol: '$', name: 'US Dollar', rateFromInr: 0.012 },
    GBP: { symbol: '£', name: 'British Pound', rateFromInr: 0.0094 },
    AED: { symbol: 'AED', name: 'UAE Dirham', rateFromInr: 0.044 },
    CAD: { symbol: 'CA$', name: 'Canadian Dollar', rateFromInr: 0.016 },
    AUD: { symbol: 'A$', name: 'Australian Dollar', rateFromInr: 0.018 },
  } as Record<CurrencyCode, { symbol: string; name: string; rateFromInr: number }>,

  // Shipping Zones & Transit Estimates
  shippingZones: {
    IN: {
      name: 'India',
      transitMinDays: 2,
      transitMaxDays: 4,
      costInr: 0, // Complimentary domestic shipping
      codEligible: true,
      maxCodM2mThresholdInr: 4000,
    },
    AE: {
      name: 'United Arab Emirates & Gulf',
      transitMinDays: 4,
      transitMaxDays: 7,
      costInr: 1800,
      codEligible: false,
    },
    US: {
      name: 'United States',
      transitMinDays: 7,
      transitMaxDays: 12,
      costInr: 2500,
      codEligible: false,
    },
    GB: {
      name: 'United Kingdom',
      transitMinDays: 7,
      transitMaxDays: 12,
      costInr: 2200,
      codEligible: false,
    },
    CA: {
      name: 'Canada',
      transitMinDays: 7,
      transitMaxDays: 12,
      costInr: 2600,
      codEligible: false,
    },
    AU: {
      name: 'Australia',
      transitMinDays: 7,
      transitMaxDays: 12,
      costInr: 2700,
      codEligible: false,
    },
    ROW: {
      name: 'Rest of World',
      transitMinDays: 8,
      transitMaxDays: 14,
      costInr: 3000,
      codEligible: false,
    }
  },

  // Standard Atelier Size Chart (in inches)
  sizeChartInches: {
    XS: { bust: 32, waist: 26, hips: 36, shoulder: 13.5, sleeveLength: 17, garmentLength: 46 },
    S:  { bust: 34, waist: 28, hips: 38, shoulder: 14.0, sleeveLength: 17.5, garmentLength: 46 },
    M:  { bust: 36, waist: 30, hips: 40, shoulder: 14.5, sleeveLength: 18, garmentLength: 47 },
    L:  { bust: 38, waist: 32, hips: 42, shoulder: 15.0, sleeveLength: 18.5, garmentLength: 47 },
    XL: { bust: 40, waist: 34, hips: 44, shoulder: 15.5, sleeveLength: 19, garmentLength: 48 },
    XXL:{ bust: 43, waist: 37, hips: 47, shoulder: 16.0, sleeveLength: 19.5, garmentLength: 48 },
  } as Record<Size, { bust: number; waist: number; hips: number; shoulder: number; sleeveLength: number; garmentLength: number }>,
};

// Helper to convert inches to cm (rounded to 1 decimal)
export function inToCm(val: number): number {
  return Math.round(val * 2.54 * 10) / 10;
}

// Generate prefilled WhatsApp deep link
export function getWhatsAppOrderLink(orderId: string, summary?: string): string {
  const text = summary 
    ? `Hello Kayaa, I have placed order ${orderId} on your official site (${summary}). Please confirm my order details.`
    : `Hello Kayaa, I have an inquiry about order ${orderId}.`;
  return `https://wa.me/${BRAND_CONFIG.officialWhatsAppDigits}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppInquiryLink(productName?: string): string {
  const text = productName
    ? `Hello Kayaa, I am admiring the ${productName} on your site. Could you guide me on custom measurements?`
    : `Hello Kayaa, I would like to inquire about a custom order from your studio.`;
  return `https://wa.me/${BRAND_CONFIG.officialWhatsAppDigits}?text=${encodeURIComponent(text)}`;
}
