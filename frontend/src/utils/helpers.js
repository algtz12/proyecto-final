// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

// Formatear fecha
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-MX', options);
};

// Validar email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Calcular total con impuestos
export const calculateTotalWithTaxes = (subtotal) => {
  const taxes = subtotal * 0.16; // 16% IVA
  return subtotal + taxes;
};