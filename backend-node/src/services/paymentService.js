const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Crear intención de pago con Stripe
exports.createStripePayment = async (amount, currency, metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent;
  } catch (err) {
    console.error('Error en Stripe:', err);
    throw new Error('Error al procesar el pago con Stripe');
  }
};

// Crear pago con PayPal
exports.createPayPalPayment = async (amount, currency, metadata = {}) => {
  // Implementación real con PayPal SDK
  return {
    id: `paypal_${Date.now()}`,
    status: 'created',
    amount,
    currency
  };
};