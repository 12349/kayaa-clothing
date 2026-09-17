import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Pages
import { Home } from './routes/Home';
import { Shop } from './routes/Shop';
import { ProductDetail } from './routes/ProductDetail';
import { SizeGuidePage } from './routes/SizeGuidePage';
import { Bag } from './routes/Bag';
import { Checkout } from './routes/Checkout';
import { OrderConfirmation } from './routes/OrderConfirmation';
import { VerifyOrder } from './routes/VerifyOrder';
import { OrderReceipt } from './routes/OrderReceipt';
import { OrderWorksheet } from './routes/OrderWorksheet';
import { Admin } from './routes/Admin';
import { About } from './routes/About';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for regular customer pages
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Standalone Print-only Routes */}
              <Route path="/order/:id/receipt" element={<OrderReceipt />} />
              <Route path="/order/:id/worksheet" element={<OrderWorksheet />} />

              {/* Standard Layout Routes */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                }
              />
              <Route
                path="/shop"
                element={
                  <MainLayout>
                    <Shop />
                  </MainLayout>
                }
              />
              <Route
                path="/product/:slug"
                element={
                  <MainLayout>
                    <ProductDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/size-guide"
                element={
                  <MainLayout>
                    <SizeGuidePage />
                  </MainLayout>
                }
              />
              <Route
                path="/bag"
                element={
                  <MainLayout>
                    <Bag />
                  </MainLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <MainLayout>
                    <OrderConfirmation />
                  </MainLayout>
                }
              />
              <Route
                path="/verify"
                element={
                  <MainLayout>
                    <VerifyOrder />
                  </MainLayout>
                }
              />
              <Route
                path="/admin"
                element={
                  <MainLayout>
                    <Admin />
                  </MainLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <MainLayout>
                    <About />
                  </MainLayout>
                }
              />
              {/* 404 fallback to Home */}
              <Route
                path="*"
                element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
