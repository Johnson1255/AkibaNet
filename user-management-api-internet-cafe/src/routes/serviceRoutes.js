import express from 'express';
import Service from '../models/Service.js'; 
import { logger } from '../utils/logger.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const services = await Service.find(); 
    res.json(services);
  } catch (error) {
    await logger.log('ERROR', 'Error getting services', { error: error.message });
    res.status(500).json({
      error: 'Error al obtener servicios',
      code: 'SERVER_ERROR'
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const allServices = await Service.find(); // Obtener todos los servicios

    // Inicializar el objeto para categorizar
    // Asegúrate que las claves coincidan con las esperadas por ServicesByCategory
    const categorizedServices = {
      gaming: [],
      working: [],
      thinking: [],
      // Añade otras categorías si existen en tu modelo/frontend type
    };

    // Agrupar los servicios
    allServices.forEach(service => {
      // Asumiendo que el modelo Service tiene un campo 'category'
      // y que sus valores coinciden con las claves de 'categorizedServices'
      const category = service.category; // ej: 'gaming', 'working', etc.

      if (category && categorizedServices.hasOwnProperty(category)) {
         // Mapea el documento Mongoose al tipo ApiService esperado por el frontend
         // Es importante asegurar que la estructura coincida
         const frontendService = {
             id: service._id.toString(), // Usa _id como id para el frontend
             name: service.name,
             description: service.description,
             price: service.price,
             available: service.available, // Asegúrate que estos campos existan
             stock: service.stock,
             specifications: service.specifications,
             category: service.category,
             // ...otros campos si ApiService los requiere
         };
        categorizedServices[category].push(frontendService);
      } else {
        // Opcional: Loguear servicios con categoría desconocida o faltante
        logger.log('WARN', `Service with _id ${service._id} has invalid or missing category: ${category}`);
      }
    });

    res.json(categorizedServices); // Devolver el objeto categorizado

  } catch (error) {
    await logger.log('ERROR', 'Error getting categorized services', { error: error.message });
    res.status(500).json({
      error: 'Error al obtener servicios categorizados',
      code: 'SERVER_ERROR'
    });
  }
});


router.get('/:serviceId', async (req, res) => {
  try {
    const service = await Service.findOne({ serviceId: req.params.serviceId });
    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado',
        code: 'SERVICE_NOT_FOUND'
      });
    }
    res.json(service);
  } catch (error) {
    await logger.log('ERROR', 'Error getting service', { error: error.message });
    res.status(500).json({
      error: 'Error al obtener el servicio',
      code: 'SERVER_ERROR'
    });
  }
});

export default router;
