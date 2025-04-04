import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
      ref: "Service",
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["gaming", "working", "thinking"],
    },
    specifications: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);
serviceSchema.index({ serviceId: 1, name: 1 });
const Service = mongoose.model("Service", serviceSchema);

export default Service;
