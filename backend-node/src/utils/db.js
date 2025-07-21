const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    throw err;
  }
};

module.exports = connectDB;