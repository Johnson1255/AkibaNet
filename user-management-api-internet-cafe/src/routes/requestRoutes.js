import express from "express";
import { body, validationResult } from "express-validator";
import Request from "../models/Request.js"; 
import { auth } from "../middleware/auth.js";
import { logger } from "../utils/logger.js";
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   POST /requests
 * @desc    Crear una nueva request
 */
router.post(
  "/",
  auth,
  [
    body("description").trim().notEmpty().withMessage("La descripción es obligatoria"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await logger.log("ERROR", "Validation failed in requests", { errors: errors.array() });
      return res.status(400).json({
        error: "Error de validación",
        code: "VALIDATION_ERROR",
        details: errors.array()
      });
    }

    try {
      const { description } = req.body;
      const user_id = req.user.id; 

      const newRequest = new Request({
        user_id: mongoose.Types.ObjectId(user_id),
        description,
      });

      const savedRequest = await newRequest.save();
      await logger.log("INFO", "New request created", { requestId: savedRequest._id, user_id });

      res.status(201).json({
        message: "Request creada exitosamente",
        code: "REQUEST_SUCCESS",
        data: { requestId: savedRequest._id, user_id, description },
      });
    } catch (error) {
      await logger.log("ERROR", "Request creation failed", { error: error.message });
      res.status(500).json({
        error: "Error en el servidor",
        code: "SERVER_ERROR",
      });
    }
  }
);

/**
 * @route   GET /requests
 * @desc    Obtener todas las requests
 */
router.get("/", auth, async (req, res) => {
  try {
    const requests = await Request.find().populate('user_id', 'name email'); 
    res.json({ requests });
  } catch (error) {
    await logger.log("ERROR", "Failed to fetch requests", { error: error.message });
    res.status(500).json({
      error: "Error en el servidor",
      code: "SERVER_ERROR",
    });
  }
});


export default router;
