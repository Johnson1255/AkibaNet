import express from 'express';
import Room from '../models/Room.js'; 
import { auth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        console.log(rooms);
        res.send(rooms);
    } catch (error) {
        await logger.log('ERROR', 'Error al obtener las habitaciones', { error: error.message });
        res.status(500).send({
            error: 'Error en el servidor al obtener las habitaciones',
            code: 'SERVER_ERROR'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findOne({ id: req.params.id });
        if (!room) {
            await logger.log('WARN', 'Habitación no encontrada', { roomId: req.params.id });
            return res.status(404).send({
                error: 'Habitación no encontrada',
                code: 'ROOM_NOT_FOUND'
            });
        }
        res.send(room);
    } catch (error) {
        await logger.log('ERROR', 'Error al obtener la habitación', { error: error.message });
        res.status(500).send({
            error: 'Error en el servidor al obtener la habitación',
            code: 'SERVER_ERROR'
        });
    }
}
);


router.post('/', auth, async (req, res) => {
    try {
        const { name, capacity, hourlyRate, minHours, maxHours, category, equipment, images } = req.body;
        if (!name || !capacity || !hourlyRate || !minHours || !maxHours || !category) {
            await logger.log('ERROR', 'Faltan campos requeridos para crear la habitación');
            return res.status(400).send({
                error: 'Todos los campos son requeridos',
                code: 'MISSING_FIELDS'
            });
        }

        const newRoom = new Room({
            name,
            capacity,
            hourlyRate,
            minHours,
            maxHours,
            category,
            equipment,
            images
        });

        const savedRoom = await newRoom.save();
        await logger.log('INFO', 'Habitación creada exitosamente', { roomId: savedRoom._id });
        res.status(201).send({
            message: 'Habitación creada correctamente',
            code: 'ROOM_CREATED',
            data: { roomId: savedRoom._id }
        });
    } catch (error) {
        await logger.log('ERROR', 'Error al crear la habitación', { error: error.message });
        res.status(500).send({
            error: 'Error en el servidor durante la creación de la habitación',
            code: 'SERVER_ERROR'
        });
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRoom) {
            await logger.log('WARN', 'Habitación no encontrada para actualizar', { roomId: req.params.id });
            return res.status(404).send({
                error: 'Habitación no encontrada',
                code: 'ROOM_NOT_FOUND'
            });
        }
        await logger.log('INFO', 'Habitación actualizada', { roomId: updatedRoom._id });
        res.send({
            message: 'Habitación actualizada correctamente',
            code: 'ROOM_UPDATED',
            data: updatedRoom
        });
    } catch (error) {
        await logger.log('ERROR', 'Error al actualizar la habitación', { error: error.message });
        res.status(500).send({
            error: 'Error en el servidor durante la actualización de la habitación',
            code: 'SERVER_ERROR'
        });
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            await logger.log('WARN', 'Habitación no encontrada para eliminar', { roomId: req.params.id });
            return res.status(404).send({
                error: 'Habitación no encontrada',
                code: 'ROOM_NOT_FOUND'
            });
        }
        await logger.log('INFO', 'Habitación eliminada', { roomId: deletedRoom._id });
        res.send({
            message: 'Habitación eliminada correctamente',
            code: 'ROOM_DELETED'
        });
    } catch (error) {
        await logger.log('ERROR', 'Error al eliminar la habitación', { error: error.message });
        res.status(500).send({
            error: 'Error en el servidor durante la eliminación de la habitación',
            code: 'SERVER_ERROR'
        });
    }
});

export default router;