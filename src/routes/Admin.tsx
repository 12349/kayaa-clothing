import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  listOrders,
  listProducts,
  listCustomers,
  updateOrderStatus,
  saveProduct,
  resetToSeedData,
} from '../data/repository';
import { Order, Product, CustomerProfile, OrderStatus, Category, Size } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { useCurrency } from '../context/CurrencyContext';
import {
  KeyRound,
  LayoutDashboard,
  Kanban,
  Package,
  Calendar,
  Users,
  Settings,
  Printer,
  FileText,
  MessageCircle,
  ExternalLink,
  Plus,
  Edit2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Scissors,
  X,
  RefreshCw,
} from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const Admin: React.FC = () => {
  const { formatPrice } = useCurrency();

  // Authentication state (Demo PIN)
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('kayaa_admin_auth') === 'true';
  });
  const [pinError, setPinError] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<
    'orders' | 'pieces' | 'calendar' | 'customers' | 'dashboard' | 'settings'
  >('orders');

  // Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer / Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddCaption, setQuickAddCaption] = useState('');
  const [quickAddName, setQuickAddName] = useState('');
  const [quickAddCategory, setQuickAddCategory] = useState<Category>('anarkali');
  const [quickAddPrice, setQuickAddPrice] = useState('14500');
  const [quickAddFabric, setQuickAddFabric] = useState('Pure Chanderi Silk');
  const [quickAddStock, setQuickAddStock] = useState<Record<Size, number>>({
    XS: 1, S: 2, M: 2, L: 1, XL: 0, XXL: 0
  });

  const loadData = async () => {
    setLoading(true);
    const [ords, prods, custs] = await Promise.all([
      listOrders(),
      listProducts(),
      listCustomers(),
    ]);
    setOrders(ords);
    setProducts(prods);
    setCustomers(custs);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === BRAND_CONFIG.adminPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('kayaa_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. The prototype demo PIN is 1984.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = await updateOrderStatus(orderId, newStatus);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    if (selectedOrder && selectedOrder.id === updated.id) {
      setSelectedOrder(updated);
    }
  };

  // Quick Add from Instagram flow
  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: (quickAddName || 'new-studio-piece').toLowerCase().replace(/\s+/g, '-'),
      name: quickAddName || 'Artisan Silk Ensemble',
      category: quickAddCategory,
      description: quickAddCaption || 'Hand-cut artisan piece crafted in our New Delhi studio.',
      story: 'Handcrafted from pure natural dye handloom silks.',
      fabric: quickAddFabric,
      care: 'Dry clean only. Muslin wrap storage.',
      colourName: 'Atelier Signature Indigo & Raw Kora',
      priceInr: parseFloat(quickAddPrice) || 12000,
      art: { h1: '#26142A', h2: '#E8D5B5', motif: 'buti' },
      images: [],
      sizeStock: quickAddStock,
      madeToMeasure: true,
      madeToMeasurePremiumInr: 1500,
      readyLeadDays: 3,
      customLeadDays: 14,
      capacityPerWeek: 4,
      status: 'live',
    };

    await saveProduct(newProd);
    setProducts((prev) => [newProd, ...prev]);
    setIsQuickAddOpen(false);
    setQuickAddCaption('');
    setQuickAddName('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-jamun-surface border-2 border-chalk-border dark:border-chalk-dark rounded-lg p-8 shadow-atelier space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-jamun dark:bg-kora text-kora dark:text-jamun flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-jamun dark:text-kora">
              Kayaa Studio Owner Gate
            </h1>
            <p className="text-xs text-jamun/70 dark:text-kora/70">
              Demo Access PIN: <strong className="font-mono text-gulab">1984</strong>
            </p>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded text-[11px] text-amber-900 dark:text-amber-200">
            <strong>Demo Protection Notice:</strong> This PIN gate is demo-grade for prototype review only and does not replace production enterprise authentication.
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-pin-input" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                Enter 4-Digit Owner PIN
              </label>
              <input
                id="admin-pin-input"
                type="password"
                maxLength={4}
                autoFocus
                placeholder="1984"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full p-3 text-center text-xl tracking-widest font-mono rounded bg-chalk-subtle dark:bg-chalk-dark border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora"
              />
              {pinError && <p className="text-xs text-rose-600 mt-1">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-jamun dark:bg-kora text-kora dark:text-jamun font-bold text-xs uppercase tracking-widest rounded hover:bg-jamun-light"
            >
              Unlock Studio Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const kanbanColumns: { status: OrderStatus; label: string }[] = [
    { status: 'new', label: 'New Orders' },
    { status: 'payment_confirmed', label: 'Payment Confirmed' },
    { status: 'cutting', label: 'Cutting Table' },
    { status: 'stitching', label: 'Stitching' },
    { status: 'finishing', label: 'Finishing / Gota' },
    { status: 'dispatched', label: 'Dispatched' },
    { status: 'delivered', label: 'Delivered' },
  ];

  // Helper for card urgency color (amber within 2 days, red if overdue)
  const getUrgencyClasses = (dispatchByIso: string, status: OrderStatus) => {
    if (status === 'dispatched' || status === 'delivered') return 'border-chalk-border dark:border-chalk-dark';
    const now = new Date().getTime();
    const target = new Date(dispatchByIso).getTime();
    const diffDays = (target - now) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'; // Overdue!
    if (diffDays <= 2) return 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'; // Urgent!
    return 'border-chalk-border dark:border-chalk-dark';
  };

  return (
    <div className="min-h-screen bg-kora dark:bg-kora-dark pb-24">
      {/* Top Admin Navigation Header */}
      <header className="bg-jamun text-kora border-b border-white/10 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold">KAYAA ATELIER PANEL</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-kora-silk/80">
              Demo Studio OS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                await resetToSeedData();
                await loadData();
              }}
              title="Reset orders & inventory back to seed values"
              className="text-xs text-kora-silk/70 hover:text-kora flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Seeds</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('kayaa_admin_auth');
                setIsAuthenticated(false);
              }}
              className="text-xs text-rose-300 hover:text-rose-100"
            >
              Lock Panel
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'orders', label: 'Orders Board', icon: Kanban },
            { id: 'pieces', label: 'Pieces & Quick-Add', icon: Package },
            { id: 'calendar', label: 'Capacity Calendar', icon: Calendar },
            { id: 'customers', label: 'Customer CRM & Fits', icon: Users },
            { id: 'dashboard', label: 'Analytics', icon: LayoutDashboard },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-gulab text-kora font-bold bg-white/5'
                    : 'border-transparent text-kora-silk/60 hover:text-kora'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================================ */}
        {/* TAB 1: KANBAN ORDERS BOARD */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-jamun dark:text-kora">
                  Orders Pipeline & Cutting Schedule
                </h2>
                <p className="text-xs text-jamun/70 dark:text-kora/70">
                  Move cards across stages. Cards turn <span className="text-amber-600 font-bold">amber</span> within 2 days of promised dispatch and <span className="text-rose-600 font-bold">red</span> when overdue.
                </p>
              </div>

              <div className="text-xs font-mono text-jamun/60 dark:text-kora/60">
                Total Active Orders: {orders.length}
              </div>
            </div>

            {/* Kanban Columns Overflow Row */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 overflow-x-auto pb-4 items-start">
              {kanbanColumns.map((col) => {
                const colOrders = orders.filter((o) => o.status === col.status);
                return (
                  <div
                    key={col.status}
                    className="bg-chalk-subtle/80 dark:bg-chalk-dark/40 border border-chalk-border dark:border-chalk-dark rounded-lg p-2.5 min-w-[200px]"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="font-mono text-xs font-bold text-jamun dark:text-kora uppercase tracking-tight">
                        {col.label}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-jamun dark:bg-chalk text-kora dark:text-jamun text-[11px] font-mono flex items-center justify-center">
                        {colOrders.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {colOrders.map((ord) => {
                        const urgencyClass = getUrgencyClasses(ord.dispatchByDate, ord.status);
                        const hasM2M = ord.items.some((i) => i.size === 'made-to-measure');

                        return (
                          <div
                            key={ord.id}
                            onClick={() => setSelectedOrder(ord)}
                            className={`p-3 bg-white dark:bg-jamun-surface rounded border-2 cursor-pointer shadow-sm hover:shadow transition-all space-y-2 ${urgencyClass}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs text-panna dark:text-panna-light">
                                {ord.id}
                              </span>
                              {hasM2M && (
                                <span className="text-[9px] uppercase font-bold text-gulab flex items-center gap-0.5">
                                  <Scissors className="w-2.5 h-2.5" />
                                  M2M
                                </span>
                              )}
                            </div>

                            <div>
                              <strong className="text-xs block text-jamun dark:text-kora leading-snug line-clamp-1">
                                {ord.customer.fullName}
                              </strong>
                              <span className="text-[10px] text-jamun/60 dark:text-kora/60 line-clamp-1">
                                {ord.items.map((i) => i.productName).join(', ')}
                              </span>
                            </div>

                            <div className="text-[10px] pt-1 border-t border-chalk-border/50 flex items-center justify-between">
                              <span className="text-jamun/60 dark:text-kora/60">Dispatch Due:</span>
                              <strong className="font-mono">
                                {new Date(ord.dispatchByDate).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </strong>
                            </div>

                            {/* Move stage buttons */}
                            <div className="pt-1 flex justify-between gap-1 text-[10px]">
                              {kanbanColumns.findIndex((c) => c.status === ord.status) > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currIdx = kanbanColumns.findIndex((c) => c.status === ord.status);
                                    handleStatusChange(ord.id, kanbanColumns[currIdx - 1].status);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-chalk text-jamun text-[9px]"
                                >
                                  ← Back
                                </button>
                              )}
                              {kanbanColumns.findIndex((c) => c.status === ord.status) < kanbanColumns.length - 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currIdx = kanbanColumns.findIndex((c) => c.status === ord.status);
                                    handleStatusChange(ord.id, kanbanColumns[currIdx + 1].status);
                                  }}
                                  className="ml-auto px-2 py-0.5 rounded bg-jamun dark:bg-kora text-kora dark:text-jamun text-[9px] font-semibold"
                                >
                                  Advance →
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: PIECES CATALOGUE & <60s INSTAGRAM QUICK-ADD */}
        {/* ============================================================ */}
        {activeTab === 'pieces' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-jamun dark:text-kora">
                  Atelier Pieces & Inventory
                </h2>
                <p className="text-xs text-jamun/70 dark:text-kora/70">
                  Update per-size stock counts, lead days, and weekly bespoke capacities directly in the ledger.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram Quick-Add (&lt;60s)</span>
                </button>
              </div>
            </div>

            {/* Pieces Table */}
            <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg overflow-hidden shadow-atelier">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-chalk-subtle dark:bg-chalk-dark font-mono uppercase text-[10px] tracking-wider text-jamun dark:text-kora border-b border-chalk-border dark:border-chalk-dark">
                      <th className="py-3 px-4 font-bold">Piece & Fabric</th>
                      <th className="py-3 px-4 font-bold">Category</th>
                      <th className="py-3 px-4 font-bold">Price</th>
                      <th className="py-3 px-4 font-bold">Per-Size Stock (XS - XXL)</th>
                      <th className="py-3 px-4 font-bold">Lead Days</th>
                      <th className="py-3 px-4 font-bold">M2M Cap/Wk</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-chalk-border/50 dark:divide-chalk-dark">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-chalk/20 dark:hover:bg-chalk-dark/20">
                        <td className="py-3 px-4">
                          <strong className="text-jamun dark:text-kora text-sm block">{prod.name}</strong>
                          <span className="text-[11px] text-jamun/60 dark:text-kora/60">{prod.fabric}</span>
                        </td>
                        <td className="py-3 px-4 capitalize font-semibold">{prod.category}</td>
                        <td className="py-3 px-4 font-mono font-bold">{formatPrice(prod.priceInr)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1.5 font-mono text-[11px]">
                            {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as Size[]).map((sz) => (
                              <span
                                key={sz}
                                className={`px-1.5 py-0.5 rounded ${
                                  prod.sizeStock[sz] > 0
                                    ? 'bg-chalk dark:bg-jamun font-bold'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 line-through'
                                }`}
                              >
                                {sz}:{prod.sizeStock[sz]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          Ready: {prod.readyLeadDays}d / M2M: {prod.customLeadDays}d
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {prod.capacityPerWeek} / wk
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-panna-pale/40 text-panna uppercase">
                            {prod.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CAPACITY CALENDAR */}
        {/* ============================================================ */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-jamun dark:text-kora">
                Workbench Capacity Calendar
              </h2>
              <p className="text-xs text-jamun/70 dark:text-kora/70">
                Weekly bespoke cutting slots committed vs. studio capacity. Ensures she never overbooks wedding deliveries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { week: 'Week 1 (Sep 14 - Sep 20)', booked: 3, capacity: 5, status: 'Open' },
                { week: 'Week 2 (Sep 21 - Sep 27)', booked: 4, capacity: 5, status: 'Nearly Full' },
                { week: 'Week 3 (Sep 28 - Oct 04)', booked: 5, capacity: 5, status: 'Booked Full' },
                { week: 'Week 4 (Oct 05 - Oct 11)', booked: 1, capacity: 5, status: 'Open' },
              ].map((w, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-5 space-y-3 shadow-atelier"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-sm">{w.week}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        w.booked >= w.capacity
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-panna-pale text-panna'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-jamun/70 dark:text-kora/70">
                      <span>Bespoke Pieces Due:</span>
                      <strong className="font-mono text-sm">{w.booked} / {w.capacity}</strong>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-chalk dark:bg-chalk-dark overflow-hidden">
                      <div
                        className={`h-full ${
                          w.booked >= w.capacity ? 'bg-rose-600' : 'bg-gulab'
                        }`}
                        style={{ width: `${(w.booked / w.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-jamun/60 dark:text-kora/60">
                    {w.booked >= w.capacity
                      ? 'New orders assign to next week dispatch window.'
                      : `${w.capacity - w.booked} custom tailoring slots remaining.`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CUSTOMERS & FIT FEEDBACK FLAGS (CLOSED LOOP) */}
        {/* ============================================================ */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-jamun dark:text-kora">
                Customer Ledger & Saved Fit Profiles
              </h2>
              <p className="text-xs text-jamun/70 dark:text-kora/70">
                Fit feedback directly flags customer profiles here so Kayaa adjusts subsequent pattern cuts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customers.map((cust) => (
                <div
                  key={cust.id}
                  className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-5 space-y-4 shadow-atelier"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-base text-jamun dark:text-kora">
                        {cust.name}
                      </h3>
                      <p className="text-xs font-mono text-jamun/60 dark:text-kora/60">
                        {cust.phone} · {cust.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-xs text-panna block">
                        {formatPrice(cust.lifetimeValueInr)}
                      </span>
                      <span className="text-[10px] text-jamun/60">
                        {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </div>
                  </div>

                  {/* CRITICAL FEATURE: Fit Feedback Flags Loop */}
                  {cust.fitFeedbackFlags.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>TAILOR FIT ALERT FROM PREVIOUS ORDER:</span>
                      </div>
                      {cust.fitFeedbackFlags.map((flag, idx) => (
                        <p key={idx} className="text-[11px] text-amber-800 dark:text-amber-300">
                          &bull; <strong>{flag.note}</strong> (Reported {flag.date})
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Saved Measurement Specs */}
                  {cust.savedProfiles.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-chalk-border/50 text-xs">
                      <span className="font-semibold text-[11px] uppercase tracking-wider text-neutral-500 block">
                        Saved Atelier Specs:
                      </span>
                      {cust.savedProfiles.map((prof, idx) => (
                        <div key={idx} className="p-2 bg-chalk-subtle dark:bg-chalk-dark/60 rounded text-[11px] font-mono">
                          <strong>{prof.profileName}:</strong> Bust: {prof.bust}&quot; | Waist: {prof.waist}&quot; | Hips: {prof.hips}&quot;
                          {prof.notes && <span className="block text-jamun/60 italic font-sans">{prof.notes}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: DASHBOARD ANALYTICS */}
        {/* ============================================================ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-jamun dark:text-kora">
              Studio Performance Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-lg bg-white dark:bg-jamun-surface border border-chalk-border shadow-atelier">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-jamun/60 block">
                  Studio Revenue (This Month)
                </span>
                <span className="font-display font-bold text-2xl text-jamun dark:text-kora mt-1 block">
                  {formatPrice(orders.reduce((sum, o) => sum + o.grandTotalInr, 0))}
                </span>
                <span className="text-[10px] text-panna font-semibold mt-1 block">+18% vs previous month</span>
              </div>

              <div className="p-5 rounded-lg bg-white dark:bg-jamun-surface border border-chalk-border shadow-atelier">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-jamun/60 block">
                  Active Orders
                </span>
                <span className="font-display font-bold text-2xl text-jamun dark:text-kora mt-1 block">
                  {orders.filter((o) => o.status !== 'delivered').length}
                </span>
                <span className="text-[10px] text-jamun/60 mt-1 block">Currently on cutting / stitching tables</span>
              </div>

              <div className="p-5 rounded-lg bg-white dark:bg-jamun-surface border border-chalk-border shadow-atelier">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-jamun/60 block">
                  Diaspora Orders (Overseas)
                </span>
                <span className="font-display font-bold text-2xl text-jamun dark:text-kora mt-1 block">
                  33.3%
                </span>
                <span className="text-[10px] text-jamun/60 mt-1 block">UK, US, UAE & Australia clients</span>
              </div>

              <div className="p-5 rounded-lg bg-white dark:bg-jamun-surface border border-chalk-border shadow-atelier">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-jamun/60 block">
                  Top Conversion Channel
                </span>
                <span className="font-display font-bold text-2xl text-jamun dark:text-kora mt-1 block">
                  Instagram Reels
                </span>
                <span className="text-[10px] text-jamun/60 mt-1 block">67% attributed discovery</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: BRAND SETTINGS */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white dark:bg-jamun-surface p-6 rounded-lg border border-chalk-border shadow-atelier space-y-4 text-xs">
            <h2 className="font-display font-bold text-xl text-jamun dark:text-kora">
              Studio Configuration & Contacts
            </h2>
            <div className="space-y-3 pt-2">
              <div>
                <label className="block font-semibold mb-1">Official WhatsApp Number:</label>
                <input
                  type="text"
                  disabled
                  value={BRAND_CONFIG.officialWhatsAppNumber}
                  className="w-full p-2 bg-chalk-subtle rounded border font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Instagram Handle:</label>
                <input
                  type="text"
                  disabled
                  value={BRAND_CONFIG.instagramHandle}
                  className="w-full p-2 bg-chalk-subtle rounded border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Studio Address:</label>
                <textarea
                  disabled
                  rows={2}
                  value={BRAND_CONFIG.studioAddress}
                  className="w-full p-2 bg-chalk-subtle rounded border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">GSTIN Placeholder:</label>
                <input
                  type="text"
                  disabled
                  value={BRAND_CONFIG.gstinPlaceholder}
                  className="w-full p-2 bg-chalk-subtle rounded border font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* DRAWER: ORDER DETAILS & WHATSAPP ACTION */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-jamun-surface h-full overflow-y-auto p-6 space-y-6 shadow-2xl border-l border-chalk-border">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">OFFICIAL SLIP</span>
                <h3 className="font-display font-bold text-xl text-jamun dark:text-kora">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded hover:bg-chalk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="text-xs space-y-1">
              <strong className="block text-sm">{selectedOrder.customer.fullName}</strong>
              <p>{selectedOrder.customer.addressLine1}, {selectedOrder.customer.city}, {selectedOrder.customer.country}</p>
              <p className="font-mono">WhatsApp: {selectedOrder.customer.phone}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedOrder.customer.fullName}, this is Kayaa from Kayaa Clothing. Your order ${selectedOrder.id} is currently at status: ${selectedOrder.status.replace('_', ' ')}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-panna text-white rounded text-xs font-semibold flex items-center justify-center gap-2 hover:bg-panna-emerald"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Status Update to Customer</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={`/order/${selectedOrder.id}/receipt`}
                  target="_blank"
                  className="py-2 px-3 border border-chalk-border rounded text-center text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-chalk"
                >
                  <Printer className="w-3.5 h-3.5 text-gulab" />
                  <span>Print Packing Slip</span>
                </Link>

                <Link
                  to={`/order/${selectedOrder.id}/worksheet`}
                  target="_blank"
                  className="py-2 px-3 border border-chalk-border rounded text-center text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-chalk"
                >
                  <FileText className="w-3.5 h-3.5 text-gulab" />
                  <span>Print Worksheet</span>
                </Link>
              </div>
            </div>

            {/* Items & Tailor Measurements */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-display font-semibold text-sm">Pieces in Order</h4>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="p-3 bg-chalk-subtle dark:bg-chalk-dark rounded text-xs space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>{it.productName}</span>
                    <span>{formatPrice(it.lineTotalInr)}</span>
                  </div>
                  <span className="text-[11px] block text-neutral-600">
                    Cut: {it.size === 'made-to-measure' ? 'Made-to-Measure Bespoke' : `Size ${it.size}`}
                  </span>
                  {it.measurements && (
                    <div className="p-2 bg-white dark:bg-jamun rounded border text-[10px] font-mono grid grid-cols-3 gap-1">
                      <span>Bust: {it.measurements.bust}{it.measurements.unit}</span>
                      <span>Waist: {it.measurements.waist}{it.measurements.unit}</span>
                      <span>Hips: {it.measurements.hips}{it.measurements.unit}</span>
                      <span>Height: {it.measurements.height}{it.measurements.unit}</span>
                      {it.measurements.blouseSleeveLength && <span>Sleeve: {it.measurements.blouseSleeveLength}{it.measurements.unit}</span>}
                      {it.measurements.lehengaWaistToFloor && <span>Floor: {it.measurements.lehengaWaistToFloor}{it.measurements.unit}</span>}
                    </div>
                  )}
                  {it.customNote && (
                    <p className="text-[11px] italic text-gulab-dark">
                      Note: &ldquo;{it.customNote}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: INSTAGRAM QUICK-ADD */}
      {/* ============================================================ */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-jamun-surface rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl border border-chalk-border">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-5 h-5 text-pink-600" />
                <h3 className="font-display font-bold text-lg text-jamun dark:text-kora">
                  Publish Piece from Instagram (&lt;60s)
                </h3>
              </div>
              <button onClick={() => setIsQuickAddOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Piece Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Jamun Angrakha Set"
                  value={quickAddName}
                  onChange={(e) => setQuickAddName(e.target.value)}
                  className="w-full p-2 rounded border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={quickAddCategory}
                    onChange={(e) => setQuickAddCategory(e.target.value as any)}
                    className="w-full p-2 rounded border"
                  >
                    <option value="anarkali">Anarkali</option>
                    <option value="lehenga">Lehenga</option>
                    <option value="saree-blouse">Saree & Blouse</option>
                    <option value="kurta-set">Kurta Set</option>
                    <option value="co-ord">Co-Ord</option>
                    <option value="dupatta">Dupatta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={quickAddPrice}
                    onChange={(e) => setQuickAddPrice(e.target.value)}
                    className="w-full p-2 rounded border"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Fabric & Provenance</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handloom Bagru Dabu Chanderi Silk"
                  value={quickAddFabric}
                  onChange={(e) => setQuickAddFabric(e.target.value)}
                  className="w-full p-2 rounded border"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Paste Instagram Caption</label>
                <textarea
                  rows={3}
                  placeholder="Paste caption directly from your latest reel..."
                  value={quickAddCaption}
                  onChange={(e) => setQuickAddCaption(e.target.value)}
                  className="w-full p-2 rounded border"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-jamun dark:bg-kora text-kora dark:text-jamun font-bold uppercase tracking-wider rounded"
              >
                Publish Live to Storefront
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
