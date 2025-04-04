import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      ref: "Product",
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["beverage", "other", "snack"],
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

export default Product;
