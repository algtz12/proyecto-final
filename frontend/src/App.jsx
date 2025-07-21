import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/sales/Cart';
import Checkout from './components/sales/Checkout';
import ReportBuilder from './components/reports/ReportBuilder';
import UserManager from './components/admin/UserManager';
import ProductManager from './components/admin/ProductManager';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                
                <Route path="/profile" element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                } />
                
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                
                <Route path="/cart" element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                } />
                
                <Route path="/checkout" element={
                  <PrivateRoute allowedRoles={['usuario', 'vendedor']}>
                    <Checkout />
                  </PrivateRoute>
                } />
                
                <Route path="/reports" element={
                  <PrivateRoute allowedRoles={['consultor', 'administrador']}>
                    <ReportBuilder />
                  </PrivateRoute>
                } />
                
                <Route path="/admin/users" element={
                  <PrivateRoute allowedRoles={['administrador']}>
                    <UserManager />
                  </PrivateRoute>
                } />
                
                <Route path="/admin/products" element={
                  <PrivateRoute allowedRoles={['administrador']}>
                    <ProductManager />
                  </PrivateRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;