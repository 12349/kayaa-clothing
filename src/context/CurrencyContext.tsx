import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode } from '../types';
import { BRAND_CONFIG } from '../config/brand';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInr: number) => string;
  symbol: string;
  isForeignCurrency: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kayaa_currency');
      if (saved && saved in BRAND_CONFIG.currencies) {
        return saved as CurrencyCode;
      }
    }
    return 'INR';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('kayaa_currency', code);
  };

  const currencyConfig = BRAND_CONFIG.currencies[currency];

  const formatPrice = (amountInr: number): string => {
    const converted = amountInr * currencyConfig.rateFromInr;
    
    // Always use standard Intl.NumberFormat
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amountInr);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        symbol: currencyConfig.symbol,
        isForeignCurrency: currency !== 'INR',
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
