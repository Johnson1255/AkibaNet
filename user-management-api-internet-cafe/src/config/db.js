// src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js'; // Asumiendo que quieres usar tu logger

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const message = `MongoDB Connected: ${conn.connection.host}`;
    console.log(message); // Log a consola siempre
    await logger.log('INFO', message); // Log a archivo
  } catch (error) {
    const errorMessage = `Error connecting to MongoDB: ${error.message}`;
    console.error(errorMessage);
    await logger.log('ERROR', errorMessage, { error });
    process.exit(1); // Salir del proceso con fallo si no se puede conectar
  }
};

export default connectDB;