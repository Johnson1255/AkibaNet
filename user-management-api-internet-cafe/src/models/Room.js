import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false }); 

const roomSchema = new mongoose.Schema({
   
  id: { 
     type: String,
     required: true,
     
  },
  category: {
    type: String,
    required: true,
    enum: ['gaming', 'thinking', 'working'] 
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'occupied', 'maintenance'], 
    default: 'available'
  },
  minHours: {
    type: Number,
    required: true,
    min: 1
  },
  maxHours: {
    type: Number,
    required: true,
    min: 1,
    validate: { 
        validator: function(value) {
          return value >= this.minHours;
        },
        message: 'El máximo de horas debe ser mayor o igual al mínimo'
      }
  },
  equipment: [equipmentSchema], 
  images: [{ type: String }] 
}, {
  timestamps: true
});


roomSchema.index({ category: 1, status: 1, hourlyRate: 1, capacity: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;