import express from 'express';
import { body, validationResult } from 'express-validator';

import jwt from 'jsonwebtoken';

import User from '../models/User.js'; 
import { auth } from '../middleware/auth.js';
import { VALIDATION_POLICIES, ERROR_MESSAGES } from '../utils/validationPolicies.js';
import { logger } from '../utils/logger.js';

const router = express.Router();


router.post('/register',
  [ 
    body('name')
      .trim()
      .isLength({ min: VALIDATION_POLICIES.NAME.MIN_LENGTH, max: VALIDATION_POLICIES.NAME.MAX_LENGTH })
      .matches(VALIDATION_POLICIES.NAME.PATTERN)
      .withMessage(ERROR_MESSAGES.NAME),
    body('email')
      .trim()
      .isEmail()
      .matches(VALIDATION_POLICIES.EMAIL.PATTERN)
      .isLength({ max: VALIDATION_POLICIES.EMAIL.MAX_LENGTH })
      .normalizeEmail() 
      .withMessage(ERROR_MESSAGES.EMAIL),
    body('password')
      .isLength({
        min: VALIDATION_POLICIES.PASSWORD.MIN_LENGTH,
        max: VALIDATION_POLICIES.PASSWORD.MAX_LENGTH
      })
      .matches(VALIDATION_POLICIES.PASSWORD.PATTERN)
      .withMessage(ERROR_MESSAGES.PASSWORD),
    body('phone')
      .matches(VALIDATION_POLICIES.PHONE.PATTERN)
      .withMessage(ERROR_MESSAGES.PHONE)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await logger.log('ERROR', 'Validation failed in register', { errors: errors.array() });
      return res.status(400).json({
        error: 'Error de validación',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    try {
      const { name, email, password, phone } = req.body;

      
      
      if (!name || !email || !password || !phone) {
         await logger.log('ERROR', 'Missing required fields in registration');
         return res.status(400).send({
           error: 'Todos los campos son requeridos',
           code: 'MISSING_FIELDS'
         });
      }

      
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        await logger.log('WARN', 'Registration attempt with existing email', { email });
        return res.status(409).send({
          error: 'El correo electrónico ya está registrado',
          code: 'EMAIL_EXISTS'
        });
      }

      
      
      const user = new User({
        name,
        email,
        password, 
        phone
      });

      
      const savedUser = await user.save();
      await logger.log('INFO', 'New user registered', { userId: savedUser._id, email });

      res.status(201).send({
        message: 'Usuario registrado exitosamente',
        code: 'REGISTRATION_SUCCESS',
        data: {
          userId: savedUser._id, 
          name: savedUser.name,
          email: savedUser.email
        }
      });
    } catch (error) {
       
       if (error.name === 'ValidationError') {
         await logger.log('ERROR', 'Mongoose validation failed during registration', { error: error.message });
         return res.status(400).json({
            error: 'Error de validación de base de datos',
            code: 'DB_VALIDATION_ERROR',
            details: error.message 
         });
       }
       
       if (error.code === 11000) {
            await logger.log('WARN', 'Duplicate key error during registration', { email: req.body.email });
            return res.status(409).json({ error: 'El correo electrónico ya está registrado', code: 'EMAIL_EXISTS' });
       }
       
      await logger.log('ERROR', 'Registration failed', { error: error.message, stack: error.stack });
      res.status(500).send({
        error: 'Error en el servidor durante el registro',
        code: 'SERVER_ERROR'
      });
    }
  }
);


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      await logger.log('WARN', 'Login attempt without credentials', { email });
      return res.status(400).send({
        error: 'Email y contraseña son requeridos',
        code: 'MISSING_CREDENTIALS'
      });
    }

    
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      await logger.log('WARN', 'Login attempt with non-existent user', { email });
      return res.status(401).send({
        error: 'Credenciales inválidas', 
        code: 'INVALID_CREDENTIALS'
        
      });
    }

    
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await logger.log('WARN', 'Failed login attempt - invalid password', { email });
      return res.status(401).send({
        error: 'Credenciales inválidas', 
        code: 'INVALID_CREDENTIALS'
        
      });
    }

    
    const payload = { userId: user._id, email: user.email }; 
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' } 
    );

    

    await logger.log('INFO', 'User logged in successfully', { userId: user._id });
    res.send({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    await logger.log('ERROR', 'Login error', { error: error.message, stack: error.stack });
    res.status(500).send({
      error: 'Error en el servidor durante el login',
      code: 'SERVER_ERROR'
    });
  }
});


router.get('/profile', auth, async (req, res) => {
  
  
   const userProfile = {
       id: req.user._id,
       name: req.user.name,
       email: req.user.email,
       phone: req.user.phone,
       createdAt: req.user.createdAt,
       updatedAt: req.user.updatedAt
   }
  await logger.log('INFO', 'Profile accessed', { userId: userProfile.id });
  res.send(userProfile);
});


router.post('/validate-token', async (req, res) => {
  try {
    const token = req.body.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      await logger.log('WARN', 'Token validation attempt without token');
      return res.status(400).send({
        valid: false,
        error: 'Token no proporcionado',
        code: 'NO_TOKEN'
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(decoded.userId); 

    if (!user) {
      await logger.log('WARN', 'Token validation with invalid user ID', { userId: decoded.userId });
      return res.status(401).send({
        valid: false,
        error: 'Token inválido (usuario no encontrado)',
        code: 'INVALID_TOKEN_USER'
      });
    }

    
    await logger.log('INFO', 'Token validated successfully', { userId: user._id });
    res.send({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    await logger.log('ERROR', 'Token validation failed', { error: error.message, tokenProvided: !!(req.body.token || req.header('Authorization')) });
    res.status(401).send({
      valid: false,
      error: 'Token inválido o expirado',
      code: 'INVALID_OR_EXPIRED_TOKEN'
    });
  }
});

export default router;