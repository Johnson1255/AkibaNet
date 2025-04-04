import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { VALIDATION_POLICIES, ERROR_MESSAGES } from '../utils/validationPolicies.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [VALIDATION_POLICIES.NAME.MIN_LENGTH, ERROR_MESSAGES.NAME],
    maxlength: [VALIDATION_POLICIES.NAME.MAX_LENGTH, ERROR_MESSAGES.NAME],
    match: [VALIDATION_POLICIES.NAME.PATTERN, ERROR_MESSAGES.NAME]
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es requerido'],
    unique: true, 
    trim: true,
    lowercase: true,
    maxlength: [VALIDATION_POLICIES.EMAIL.MAX_LENGTH, ERROR_MESSAGES.EMAIL],
    match: [VALIDATION_POLICIES.EMAIL.PATTERN, ERROR_MESSAGES.EMAIL]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [VALIDATION_POLICIES.PASSWORD.MIN_LENGTH, ERROR_MESSAGES.PASSWORD]
    
    
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    match: [VALIDATION_POLICIES.PHONE.PATTERN, ERROR_MESSAGES.PHONE]
  },
  
  
}, {
  timestamps: true 
});


userSchema.pre('save', async function (next) {
  
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(8); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); 
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
   return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;