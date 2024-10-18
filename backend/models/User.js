import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
   {
      userName: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      passwordHash: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         required: true,
      },
      basket: {
         type: [mongoose.Schema.Types.ObjectId],
         ref: "Product",
         default: [],
      },
   },
   {
      timestamps: true,
   }
);

export default mongoose.model("User", UserSchema);
