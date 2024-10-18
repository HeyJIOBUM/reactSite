import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";
import ProductModel from "../models/Product.js";

const getJwt = (id) => {
   return jwt.sign(
      {
         _id: id,
      },
      "1111",
      {
         expiresIn: "30d",
      }
   );
};

const createFilter = (query) => {
   if (!query) return {};
   let filter = {};
   if (query.productType) {
      filter.productType = new RegExp(query.productType, "i");
   }
   if (query.productName) {
      filter.productName = new RegExp(query.productName, "i");
   }
   if (query.producer) {
      filter.producer = new RegExp(query.producer, "i");
   }
   if (query.price) {
      filter.price = {
         $lte: query.price.max ? parseInt(query.price.max) : 99999999,
         $gte: query.price.min ? parseInt(query.price.min) : 0,
      };
   }
   return filter;
};

export const register = async (req, res) => {
   try {
      const filter = {
         $or: [{ userName: req.body.userName }, { email: req.body.email }],
      };
      const sameRegParams = await UserModel.findOne(filter);
      if (sameRegParams) {
         return res.status(400).json({
            message: "Этот логин или пароль уже используется",
         });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const doc = new UserModel({
         userName: req.body.userName,
         email: req.body.email,
         passwordHash: hash,
         role: "user",
      });

      const user = await doc.save();

      const token = getJwt(user._id);

      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось зарегистрироваться",
      });
   }
};

export const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ userName: req.body.userName });

      if (!user) {
         return res.status(400).json({
            message: "Неверный логин или пароль",
         });
      }

      const isValidPass = await bcrypt.compare(
         req.body.password,
         user._doc.passwordHash
      );

      if (!isValidPass) {
         return res.status(400).json({
            message: "Неверный логин или пароль",
         });
      }

      const token = getJwt(user._id);

      const { passwordHash, ...userData } = user._doc;

      res.json({
         ...userData,
         token,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось войти в аккаунт",
      });
   }
};

export const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId);

      if (!user) {
         return res.status(404).json({
            message: "Пользователь не найден",
         });
      }

      const { passwordHash, ...userData } = user._doc;

      res.json(userData);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось получить данные о себе",
      });
   }
};

export const getBasket = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId);
      const filter = createFilter(req.query);
      if (user.role == "seller") {
         const basket = await ProductModel.find({
            ...filter,
            sellerId: req.userId,
         }).sort(
            req.query.sorting == "ascending"
               ? {
                    price: 1,
                 }
               : {
                    price: -1,
                 }
         );

         return res.json({ basket: basket, role: user._doc.role });
      } else if (user.role == "user") {
         const basket = await ProductModel.find(filter).sort(
            req.query.sorting == "ascending"
               ? {
                    price: 1,
                 }
               : {
                    price: -1,
                 }
         );

         const retBasket = basket.filter((product) =>
            user.basket.includes(product._id)
         );

         return res.json({ basket: retBasket, role: user._doc.role });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Нет доступа",
      });
   }
};

export const getSellerBasket = async (req, res) => {
   try {
      const user = await UserModel.findById(req.params.userId);

      var filter = createFilter(req.query);

      const basket = await ProductModel.find({
         ...filter,
         sellerId: req.params.userId,
      }).sort(
         req.query.sorting == "ascending"
            ? {
                 price: 1,
              }
            : {
                 price: -1,
              }
      );

      res.json({ basket: basket, role: user._doc.role });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Нет доступа",
      });
   }
};

export const update = async (req, res) => {
   try {
      const productId = req.body.productId;
      const user = await UserModel.findOne({
         _id: req.userId,
      });

      if (user.role == "seller" && user.basket.includes(productId)) {
         await UserModel.updateOne(
            {
               _id: req.userId,
            },
            { $pull: { basket: productId } }
         );
         await ProductModel.findByIdAndDelete(productId);
      }

      if (user.role == "user") {
         if (user.basket.includes(productId)) {
            await UserModel.updateOne(
               {
                  _id: req.userId,
               },
               { $pull: { basket: productId } }
            );
         } else {
            await UserModel.updateOne(
               {
                  _id: req.userId,
               },
               { $addToSet: { basket: productId } }
            );
         }
      }

      res.json({
         success: true,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось обновить корзину",
      });
   }
};

export const getAll = async (req, res) => {
   try {
      const users = await UserModel.find();
      // .populate("basket").exec();
      res.json(users);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось получить пользователей",
      });
   }
};

export const remove = async (req, res) => {
   try {
      const data = await UserModel.findOne({
         _id: req.params.userId,
      });
      if (data.role === "admin") {
         return res.json({
            message: "Нельзя удалить админа",
         });
      }
      if (data.role === "seller") {
         data.basket.forEach(async (element) => {
            await ProductModel.deleteOne({ _id: element });
         });
      }
      await UserModel.deleteOne({ _id: req.params.userId });
      res.json({
         message: "success",
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось удалить пользователя",
      });
   }
};

export const userLevelUp = async (req, res) => {
   try {
      const user = await UserModel.findById(req.params.userId);
      if (user.role == "admin") {
         return res.status(500).json({
            message: "Нельзя изменить тип этого пользователья",
         });
      }
      await UserModel.updateOne(
         {
            _id: req.params.userId,
         },
         { role: user.role == "user" ? "seller" : "user", basket: [] }
      );
      res.json({
         success: true,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось изменить тип полльзователя",
      });
   }
};
