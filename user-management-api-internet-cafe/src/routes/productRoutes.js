import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Product from '../models/Product.js'; 
import { auth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.maxPrice) {
      filters.price = { $lte: parseFloat(req.query.maxPrice) };
    }
    if (req.query.minPrice) {
      filters.price = { ...filters.price, $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.inStock === 'true') {
      filters.stock = { $gt: 0 };
    }

    const products = await Product.find(filters); 
    res.json(products);
  } catch (error) {
    await logger.log('ERROR', 'Error getting products', { error: error.message });
    res.status(500).json({
      error: 'Error al obtener productos',
      code: 'SERVER_ERROR'
    });
  }
});


router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    res.json(product);
  } catch (error) {
    await logger.log('ERROR', 'Error getting product', { error: error.message });
    res.status(500).json({
      error: 'Error al obtener el producto',
      code: 'SERVER_ERROR'
    });
  }
});


router.post('/', auth, [
  body('productId').notEmpty().withMessage('El productId es requerido'),
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('description').notEmpty().withMessage('La descripción es requerida'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('category').isIn(['snack', 'beverage', 'other']).withMessage('Categoría inválida'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número positivo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const product = new Product(req.body); 
    const savedProduct = await product.save(); 
    await logger.log('INFO', 'Product created', { productId: savedProduct._id });
    res.status(201).json(savedProduct);
  } catch (error) {
    await logger.log('ERROR', 'Error creating product', { error: error.message });
    res.status(500).json({
      error: 'Error al crear el producto',
      code: 'SERVER_ERROR'
    });
  }
});

export default router;
