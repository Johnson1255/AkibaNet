import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    
  },
  itemType: { 
    type: String,
    required: true,
    enum: ['Product', 'Service']
  },
  name: { type: String, required: true }, 
  price: { type: Number, required: true }, 
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId, 
    
    required: true,
    ref: 'Room' 
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    required: true
  },
  duration: { 
    type: Number,
    required: true,
    min: 1
  },
  endTime: {
    type: Date,
    required: true
  },
  services: [itemSchema],
  products: [itemSchema],
  basePrice: { type: Number, required: true }, 
  servicesTotal: { type: Number, default: 0 },
  productsTotal: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true }
  
}, {
  timestamps: true
});


bookingSchema.pre('validate', function(next) {
  if (this.startTime && this.duration) {
    this.endTime = new Date(this.startTime.getTime() + this.duration * 3600000);
  }
  
  this.servicesTotal = this.services.reduce((sum, s) => sum + s.price * s.quantity, 0);
  this.productsTotal = this.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  if (this.basePrice !== undefined) {
     this.totalPrice = this.basePrice + this.servicesTotal + this.productsTotal;
  }
  next();
});


bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ roomId: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;