// crear_vendedor.js
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = "ecommerce_db";
const collectionName = "users";

async function crearUsuarioVendedor() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection(collectionName);

    const passwordPlano = "vendedor123"; // Cambia la contraseña si quieres
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlano, salt);

    const nuevoUsuario = {
      username: "vendedor_ejemplo",
      email: "vendedor@mail.com",
      passwordHash: passwordHash,
      rol: "vendedor",
      fechaCreacion: new Date(),
      ultimoAcceso: new Date(),
      activo: true,
      metadata: {
        nombreCompleto: "Vendedor Ejemplo",
        telefono: "+521234567890",
        direccion: {
          calle: "Sucursal Principal",
          ciudad: "Ciudad Venta",
          codigoPostal: "54321"
        },
        preferencias: {
          newsletter: true,
          temaOscuro: false
        }
      }
    };

    const result = await users.insertOne(nuevoUsuario);
    console.log("✅ Usuario vendedor insertado con ID:", result.insertedId);

    // Opcional: generar token para el vendedor
    const token = jwt.sign(
      {
        userId: result.insertedId,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("🔐 Token generado:");
    console.log(token);

  } catch (err) {
    console.error("❌ Error al crear usuario vendedor:", err);
  } finally {
    await client.close();
  }
}

crearUsuarioVendedor();
