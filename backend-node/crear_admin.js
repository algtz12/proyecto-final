// crear_admin.js
require('dotenv').config(); // para usar variables del archivo .env

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = "ecommerce_db";
const collectionName = "users";

async function crearUsuarioAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection(collectionName);

    // 1. Datos del usuario
    const passwordPlano = "admin123"; // Cambia si quieres
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlano, salt);

    const nuevoUsuario = {
      username: "admin_ejemplo",
      email: "admin@mail.com",
      passwordHash: passwordHash,
      rol: "administrador",
      fechaCreacion: new Date(),
      ultimoAcceso: new Date(),
      activo: true,
      metadata: {
        nombreCompleto: "Administrador Ejemplo",
        telefono: "+5200000000",
        direccion: {
          calle: "Oficinas centrales",
          ciudad: "Ciudad Admin",
          codigoPostal: "00000"
        },
        preferencias: {
          newsletter: false,
          temaOscuro: true
        }
      }
    };

    // 2. Insertar el usuario
    const result = await users.insertOne(nuevoUsuario);
    console.log("✅ Usuario administrador insertado con ID:", result.insertedId);

    // 3. Generar token
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
    console.error("❌ Error al crear usuario:", err);
  } finally {
    await client.close();
  }
}

crearUsuarioAdmin();
