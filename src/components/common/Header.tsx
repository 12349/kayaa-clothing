import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND_CONFIG } from '../../config/brand';
import { CurrencyCode } from '../../types';
import {
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  Scissors,
  KeyRound,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currencies: CurrencyCode[] = ['INR', 'USD', 'GBP', 'AED', 'CAD', 'AUD'];

  const navLinks = [
    { label: 'Catalogue', path: '/shop' },
    { label: 'Size & Made-to-Measure', path: '/size-guide' },
    { label: 'Studio Story', path: '/about' },
    { label: 'Verify Order', path: '/verify' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-kora/95 dark:bg-kora-dark/95 backdrop-blur-md border-b border-chalk-border dark:border-chalk-dark">
      {/* Top micro-banner: Canonical contact confirmation */}
      <div className="bg-jamun dark:bg-jamun-dark text-kora py-1.5 px-4 text-[11px] md:text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-panna-light animate-pulse" />
            <span>Official Atelier WhatsApp:</span>
            <strong className="font-mono tracking-wider text-chalk">
              {BRAND_CONFIG.officialWhatsAppNumber}
            </strong>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-kora-silk/80">
            <span>Dispatched from New Delhi</span>
            <span>·</span>
            <Link to="/verify" className="underline hover:text-kora">
              Verify Official Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="group flex flex-col items-start focus-visible:ring-2 focus-visible:ring-jamun rounded"
            aria-label="Kayaa Clothing Home"
          >
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-jamun dark:text-kora leading-none">
              KAYAA
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-gulab dark:text-gulab-light font-semibold -mt-0.5">
              Atelier & Couture
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 ml-4" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide transition-colors py-1 relative ${
                    isActive
                      ? 'text-jamun dark:text-kora font-semibold'
                      : 'text-jamun/75 dark:text-kora/75 hover:text-jamun dark:hover:text-kora'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gulab" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Currency, Dark Toggle, Admin, Bag, Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Currency Switcher */}
          <div className="relative">
            <label htmlFor="currency-select" className="sr-only">
              Select Currency
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-chalk-subtle dark:bg-chalk-dark text-jamun dark:text-kora text-xs font-semibold px-2.5 py-1.5 rounded border border-chalk-border dark:border-chalk-dark focus-visible:ring-1 focus-visible:ring-jamun cursor-pointer"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr} ({BRAND_CONFIG.currencies[curr].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-chalk dark:hover:bg-chalk-dark text-jamun dark:text-kora transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin link */}
          <Link
            to="/admin"
            className="hidden sm:inline-flex p-2 rounded hover:bg-chalk dark:hover:bg-chalk-dark text-jamun/60 dark:text-kora/60 hover:text-jamun dark:hover:text-kora transition-colors"
            title="Studio Owner Admin Panel"
            aria-label="Studio Owner Admin Panel"
          >
            <KeyRound className="w-4 h-4" />
          </Link>

          {/* Bag button */}
          <Link
            to="/bag"
            className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-jamun dark:bg-chalk text-kora dark:text-jamun rounded hover:bg-jamun-light dark:hover:bg-chalk-subtle transition-colors"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">Bag</span>
            {itemCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-gulab text-white -ml-0.5">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-jamun dark:text-kora"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-chalk-border dark:border-chalk-dark bg-kora dark:bg-kora-dark px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium py-2 border-b border-chalk dark:border-chalk-dark text-jamun dark:text-kora"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium py-2 text-jamun/60 dark:text-kora/60 flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Studio Owner Admin</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
