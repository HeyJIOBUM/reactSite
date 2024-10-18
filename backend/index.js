import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";

import {
   handleValidator,
   checkAuth,
   isProductOwner,
   isAccountOwner,
   isAdmin,
   isSeller,
   registerValidation,
   loginValidation,
   productValidation,
} from "./middleware/index.js";

import { UserController, ProductController } from "./controllers/index.js";

mongoose
   .connect(
      "mongodb+srv://kirillnichinger:1111@cluster.ep9sjub.mongodb.net/?retryWrites=true&w=majority"
   )
   .then(() => console.log("DB ok"))
   .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
   destination: (re, file, cb) => {
      if (!fs.existsSync("static")) {
         fs.mkdirSync("static");
      }
      cb(null, "static");
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/static", express.static("static"));

app.post("/upload", checkAuth, isSeller, upload.single("image"), (req, res) => {
   res.json({
      url: "/static/" + req.file.originalname,
   });
});

app.post("/user/login", loginValidation, handleValidator, UserController.login);
app.post(
   "/user/register",
   registerValidation,
   handleValidator,
   UserController.register
);
app.get("/user/me", checkAuth, UserController.getMe);
app.get("/user/basket/:userId", UserController.getSellerBasket);
app.get("/user/basket", checkAuth, UserController.getBasket);
app.get("/user", checkAuth, isAdmin, UserController.getAll);
app.patch("/user/:userId", checkAuth, isAdmin, UserController.userLevelUp);
app.patch(
   "/user/basket/:userId",
   checkAuth,
   isAccountOwner,
   UserController.update
);
app.delete("/user/:userId", checkAuth, isAdmin, UserController.remove);

app.post(
   "/product",
   checkAuth,
   isSeller,
   productValidation,
   handleValidator,
   ProductController.create
);
app.get("/product/:productId", ProductController.getOne);
app.get("/product", ProductController.getAll);
app.delete(
   "/product/:productId",
   checkAuth,
   isSeller,
   isProductOwner,
   ProductController.remove
);
app.patch(
   "/product/:productId",
   checkAuth,
   isSeller,
   isProductOwner,
   productValidation,
   handleValidator,
   ProductController.update
);

app.listen(8000, (err) => {
   if (err) {
      return console.log(err);
   }
   console.log("Server OK");
});
