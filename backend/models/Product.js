import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
   {
      productType: {
         type: String,
         required: true,
      },
      productName: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
      },
      producer: {
         type: String,
         required: true,
      },
      sellerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      imgNames: {
         type: [String],
         default: [],
      },
   },
   {
      timestamps: true,
   }
);

export default mongoose.model("Product", ProductSchema);
