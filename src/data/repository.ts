import { Product, Order, Review, CustomerProfile, OrderStatus, Category, Size } from '../types';
import { SEED_PRODUCTS, SEED_ORDERS, SEED_REVIEWS, SEED_CUSTOMERS } from './seed';

const STORAGE_KEYS = {
  PRODUCTS: 'kayaa_products_v3',
  ORDERS: 'kayaa_orders_v3',
  REVIEWS: 'kayaa_reviews_v3',
  CUSTOMERS: 'kayaa_customers_v3',
  SAVED_MEASUREMENTS: 'kayaa_user_measurements_v3',
  INITIALIZED: 'kayaa_initialized_v3',
};

// Seed localStorage if not present
function initializeStorage(): void {
  if (typeof window === 'undefined') return;
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Ensure init executes
initializeStorage();

// Simulate network latency (20-60ms) for realistic async semantics
const delay = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: safe JSON parsing
function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setStoredItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// ----------------------------------------------------
// PRODUCT REPOSITORY FUNCTIONS
// ----------------------------------------------------

export async function listProducts(filter?: {
  category?: Category | 'all';
  inStockOnly?: boolean;
  madeToMeasureOnly?: boolean;
  search?: string;
}): Promise<Product[]> {
  await delay();
  initializeStorage();
  let products = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);

  if (!filter) return products;

  if (filter.category && filter.category !== 'all') {
    products = products.filter((p) => p.category === filter.category);
  }

  if (filter.madeToMeasureOnly) {
    products = products.filter((p) => p.madeToMeasure);
  }

  if (filter.inStockOnly) {
    products = products.filter((p) => {
      const totalStock = Object.values(p.sizeStock).reduce((a, b) => a + b, 0);
      return totalStock > 0 || p.madeToMeasure;
    });
  }

  if (filter.search) {
    const query = filter.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.fabric.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay();
  initializeStorage();
  const products = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  return products.find((p) => p.slug === slug) || null;
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay();
  initializeStorage();
  const products = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  await delay();
  initializeStorage();
  const products = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  const existingIdx = products.findIndex((p) => p.id === product.id);

  if (existingIdx >= 0) {
    products[existingIdx] = product;
  } else {
    products.unshift(product);
  }

  setStoredItem(STORAGE_KEYS.PRODUCTS, products);
  return product;
}

// ----------------------------------------------------
// ORDER REPOSITORY FUNCTIONS
// ----------------------------------------------------

export async function listOrders(): Promise<Order[]> {
  await delay();
  initializeStorage();
  const orders = getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  // Sort descending by creation date
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrder(id: string): Promise<Order | null> {
  await delay();
  initializeStorage();
  const orders = getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  const normalizedId = id.trim().toUpperCase();
  return orders.find((o) => o.id.toUpperCase() === normalizedId) || null;
}

export async function createOrder(orderInput: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  await delay();
  initializeStorage();
  const orders = getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  const products = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);

  // Generate canonical human-readable Order Number: KY-YYMM-XXXX
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(orders.length + 45).padStart(4, '0');
  const newId = `KY-${yy}${mm}-${seq}`;

  const newOrder: Order = {
    ...orderInput,
    id: newId,
    createdAt: now.toISOString(),
  };

  // Decrement per-size stock for standard-size items
  orderInput.items.forEach((item) => {
    if (item.size !== 'made-to-measure') {
      const prodIdx = products.findIndex((p) => p.id === item.productId);
      if (prodIdx >= 0) {
        const prod = products[prodIdx];
        const currentQty = prod.sizeStock[item.size as Size] || 0;
        prod.sizeStock[item.size as Size] = Math.max(0, currentQty - item.quantity);
        products[prodIdx] = prod;
      }
    }
  });

  setStoredItem(STORAGE_KEYS.PRODUCTS, products);

  // Save new order
  orders.unshift(newOrder);
  setStoredItem(STORAGE_KEYS.ORDERS, orders);

  // Update or record customer profile
  const customers = getStoredItem<CustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS);
  const custPhone = orderInput.customer.phone.trim();
  const existingCustIdx = customers.findIndex((c) => c.phone.trim() === custPhone);

  if (existingCustIdx >= 0) {
    const cust = customers[existingCustIdx];
    cust.totalOrders += 1;
    cust.lifetimeValueInr += orderInput.grandTotalInr;
    customers[existingCustIdx] = cust;
  } else {
    customers.push({
      id: `cust-${Date.now()}`,
      name: orderInput.customer.fullName,
      phone: orderInput.customer.phone,
      email: orderInput.customer.email,
      totalOrders: 1,
      lifetimeValueInr: orderInput.grandTotalInr,
      savedProfiles: [],
      fitFeedbackFlags: [],
    });
  }
  setStoredItem(STORAGE_KEYS.CUSTOMERS, customers);

  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  await delay();
  initializeStorage();
  const orders = getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  const normalizedId = id.trim().toUpperCase();
  const orderIdx = orders.findIndex((o) => o.id.toUpperCase() === normalizedId);

  if (orderIdx === -1) {
    throw new Error(`Order ${id} not found.`);
  }

  const updatedOrder: Order = {
    ...orders[orderIdx],
    status,
  };
  orders[orderIdx] = updatedOrder;
  setStoredItem(STORAGE_KEYS.ORDERS, orders);
  return updatedOrder;
}

// ----------------------------------------------------
// VERIFICATION ROUTE FUNCTION
// ----------------------------------------------------

export async function verifyOrder(orderId: string): Promise<{
  valid: boolean;
  order?: Order;
  message: string;
}> {
  await delay();
  initializeStorage();
  const order = await getOrder(orderId);

  if (!order) {
    return {
      valid: false,
      message: `No official order with ID "${orderId}" exists in Kayaa Clothing's official studio ledger. If someone gave you this number on Instagram comments or WhatsApp claiming to be Kayaa, it is fraudulent. Do not transfer funds.`,
    };
  }

  return {
    valid: true,
    order,
    message: `Official Kayaa Clothing Order Verified. Issued for ${order.customer.fullName} on ${new Date(order.createdAt).toLocaleDateString()}.`,
  };
}

// ----------------------------------------------------
// REVIEW & FIT FEEDBACK REPOSITORY FUNCTIONS
// ----------------------------------------------------

export async function listReviews(productId?: string): Promise<Review[]> {
  await delay();
  initializeStorage();
  const reviews = getStoredItem<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  if (productId) {
    return reviews.filter((r) => r.productId === productId);
  }
  return reviews;
}

export async function saveReview(
  productId: string,
  reviewInput: Omit<Review, 'id' | 'createdAt' | 'productId'>
): Promise<Review> {
  await delay();
  initializeStorage();
  const reviews = getStoredItem<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  const newReview: Review = {
    ...reviewInput,
    id: `rev-${Date.now()}`,
    productId,
    createdAt: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  setStoredItem(STORAGE_KEYS.REVIEWS, reviews);

  // Mark order as review submitted
  const orders = getStoredItem<Order[]>(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  const orderIdx = orders.findIndex((o) => o.id === reviewInput.orderId);
  if (orderIdx >= 0) {
    orders[orderIdx].reviewSubmitted = true;
    setStoredItem(STORAGE_KEYS.ORDERS, orders);

    // If fit verdict was too_tight or too_loose, flag the customer profile!
    if (reviewInput.fitVerdict !== 'perfect' && reviewInput.fitAreaNotes) {
      const customers = getStoredItem<CustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS);
      const custPhone = orders[orderIdx].customer.phone.trim();
      const custIdx = customers.findIndex((c) => c.phone.trim() === custPhone);
      if (custIdx >= 0) {
        customers[custIdx].fitFeedbackFlags.push({
          orderId: reviewInput.orderId,
          note: `Fit issue (${reviewInput.fitVerdict.replace('_', ' ')}): ${reviewInput.fitAreaNotes}`,
          date: new Date().toISOString().slice(0, 10),
        });
        setStoredItem(STORAGE_KEYS.CUSTOMERS, customers);
      }
    }
  }

  return newReview;
}

// ----------------------------------------------------
// CUSTOMER & CAPACITY FUNCTIONS
// ----------------------------------------------------

export async function listCustomers(): Promise<CustomerProfile[]> {
  await delay();
  initializeStorage();
  return getStoredItem<CustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS);
}

export async function saveCustomerProfile(profile: CustomerProfile): Promise<CustomerProfile> {
  await delay();
  initializeStorage();
  const customers = getStoredItem<CustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS);
  const idx = customers.findIndex((c) => c.id === profile.id);
  if (idx >= 0) {
    customers[idx] = profile;
  } else {
    customers.push(profile);
  }
  setStoredItem(STORAGE_KEYS.CUSTOMERS, customers);
  return profile;
}

// Reset data to seeds
export async function resetToSeedData(): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
}
