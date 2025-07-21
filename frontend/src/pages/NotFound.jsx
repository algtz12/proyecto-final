import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-9xl font-extrabold text-gray-900">
            404
          </h2>
          <p className="mt-4 text-2xl text-gray-600">
            Página no encontrada
          </p>
          <p className="mt-2 text-gray-500">
            Lo sentimos, la página que estás buscando no existe.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;