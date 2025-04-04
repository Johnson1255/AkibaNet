import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

requestSchema.index({ user_id: 1, date: 1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;
