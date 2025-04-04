import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js'; 
import Room from '../models/Room.js';
import { auth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();


router.post('/create', auth, async (req, res) => {
    try {
        const { roomId, startTime, duration, services, products, basePrice } = req.body;
        const userId = req.user.id;

        if (!roomId || !startTime || !duration || !basePrice) {
            await logger.log('ERROR', 'Faltan campos requeridos en la creación de reserva');
            return res.status(400).send({
                error: 'Todos los campos son requeridos',
                code: 'MISSING_FIELDS'
            });
        }

        // Validar que roomId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            await logger.log('ERROR', 'ID de habitación inválido. roomId:', { roomId });
            return res.status(400).send({
                error: 'ID de habitación inválido',
                code: 'INVALID_ROOM_ID'
            });
        }

        const roomObjectId = new mongoose.Types.ObjectId(roomId);
        const checkIn = new Date(startTime);
        const checkOut = new Date(checkIn.getTime() + duration * 3600000);

        const conflict = await Booking.findOne({
            roomId: roomObjectId,
            $or: [
                { startTime: { $gte: checkIn, $lt: checkOut } },
                { endTime: { $gt: checkIn, $lte: checkOut } }
            ]
        });
        
        if (conflict) {
            await logger.log('WARN', 'Conflicto de reserva detectado', { roomId });
            return res.status(409).send({
                error: 'El cuarto no está disponible en el rango seleccionado',
                code: 'NO_AVAILABILITY'
            });
        }

        const booking = new Booking({
            userId: userId,
            roomId: roomObjectId,
            startTime: checkIn,
            duration,
            endTime: checkOut,
            services,
            products,
            basePrice
        });

        const savedBooking = await booking.save();
        await logger.log('INFO', 'Reserva creada exitosamente', { bookingId: savedBooking._id });

        res.status(201).send({
            message: 'Reserva creada exitosamente',
            code: 'BOOKING_CREATED',
            data: { bookingId: savedBooking._id }
        });
    } catch (error) {
        console.error('--- DETAILED BOOKING CREATION ERROR ---');
        console.error(error); // Imprime el objeto de error completo
        console.error('---------------------------------------');
        
        // Mejorar el mensaje de error para el cliente
        const errorMessage = error.name === 'CastError' 
            ? 'Formato de ID inválido'
            : 'Error en el servidor durante la creación de la reserva';
            
        await logger.log('ERROR', 'Error al crear la reserva', { error: error.message });
        res.status(500).send({
            error: errorMessage,
            code: error.name === 'CastError' ? 'INVALID_ID_FORMAT' : 'SERVER_ERROR'
        });
    }
});


router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            await logger.log('WARN', 'Reserva no encontrada', { bookingId: req.params.id });
            return res.status(404).send({
                error: 'Reserva no encontrada',
                code: 'BOOKING_NOT_FOUND'
            });
        }
        res.send(booking);
    } catch (error) {
        await logger.log('ERROR', 'Error al obtener la reserva', { error: error.message });
        res.status(500).send({
            error: 'Error en el servidor al obtener la reserva',
            code: 'SERVER_ERROR'
        });
    }
});


router.get('/user/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.find({ userId: mongoose.Types.ObjectId(userId) });
        res.send(bookings);
    } catch (error) {
        await logger.log('ERROR', 'Error al obtener las reservas del usuario', { error: error.message });
        res.status(500).send({
            error: 'Error en el servidor al obtener las reservas del usuario',
            code: 'SERVER_ERROR'
        });
    }
});

export default router;