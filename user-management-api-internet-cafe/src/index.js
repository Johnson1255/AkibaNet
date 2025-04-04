// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // <--- Importar
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import productRoutes from './routes/productRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

// Conectar a MongoDB ANTES de configurar las rutas y el servidor
connectDB(); // <--- Llamar a la función de conexión

const app = express();
const port = process.env.PORT || 3000;

// --- Resto de tu configuración de CORS y middleware ---
// Configuración de CORS
const corsOptions = {
  origin: true, // O sé más específico según tus necesidades
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Añadido PATCH
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Rutas ---
app.use('/api/users', userRoutes);
app.use('/health', healthRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/requests', requestRoutes);

app.get("/", (_req, res) => {
  res.send(
    "<h1>API de AkibaNet</h1><p>Para acceder a los endpoints de la API, utiliza la ruta /api/</p>"
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});