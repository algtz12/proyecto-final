import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sistema de Ventas</h3>
            <p className="text-gray-300">
              Plataforma integral para gestión de productos, ventas y reportes.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Inicio</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-white">Productos</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">Acerca de</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <p className="text-gray-300">
              Email: info@sistemaventas.com<br />
              Teléfono: (55) 1234-5678<br />
              Dirección: Av. Insurgentes 123, CDMX
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sistema de Ventas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;