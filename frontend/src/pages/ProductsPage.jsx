import React from 'react';
import ProductList from '../components/products/ProductList';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
        {isAdmin && (
          <Link 
            to="/admin/products"
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
          >
            Gestionar Productos
          </Link>
        )}
      </div>
      
      <ProductList />
    </div>
  );
};

export default ProductsPage;