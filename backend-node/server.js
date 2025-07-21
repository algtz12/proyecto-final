require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/utils/db');

const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor Node corriendo en puerto ${PORT}`);
      console.log(`Base de datos: ${process.env.MONGODB_URI}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });