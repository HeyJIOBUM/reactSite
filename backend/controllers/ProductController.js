import ProductModel from "../models/Product.js";
import UserModel from "../models/User.js";
import fs from "fs";
import fsExtra from "fs-extra";

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

export const getAll = async (req, res) => {
   try {
      let filter = createFilter(req.query);
      const products = await ProductModel.find(filter).sort(
         req.query.sorting == "ascending"
            ? {
                 price: 1,
              }
            : {
                 price: -1,
              }
      );
      res.json(products);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось получить товары",
      });
   }
};

export const getOne = async (req, res) => {
   try {
      const data = await ProductModel.findById(req.params.productId);
      if (!data) {
         return res.status(404).json({
            message: "Товар не найден",
         });
      }
      res.json(data);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось получить товар",
      });
   }
};

export const remove = async (req, res) => {
   try {
      await ProductModel.deleteOne({ _id: req.params.productId });
      await deleteFolder("static/" + req.params.productId);
      res.json({
         message: "success",
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось удалить товар",
      });
   }
};

export const update = async (req, res) => {
   try {
      const productId = req.params.productId;
      await ProductModel.updateOne(
         {
            _id: productId,
         },
         {
            productType: req.body.productType,
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            producer: req.body.producer,
         }
      );
      res.json({
         success: true,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось обновить товар",
      });
   }
};

export const create = async (req, res) => {
   try {
      const record = new ProductModel({
         productType: req.body.productType,
         productName: req.body.productName,
         description: req.body.description,
         price: req.body.price,
         producer: req.body.producer,
         sellerId: req.userId,
      });

      const product = await record.save();

      await UserModel.updateOne(
         {
            _id: req.userId,
         },
         {
            $addToSet: {
               basket: product._id,
            },
         }
      );

      res.json(product);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: "Не удалось создать товар",
      });
   }
};

const getFilesInFolder = async function (folderPath) {
   return new Promise((resolve, reject) => {
      fs.readdirSync(folderPath, (err, files) => {
         if (err) {
            reject(err);
         } else {
            resolve(files);
         }
      });
   });
};

const deleteFolder = async function (folderPath) {
   return new Promise((resolve, reject) => {
      fsExtra.remove(folderPath, (err) => {
         if (err) {
            reject(err);
         } else {
            resolve();
         }
      });
   });
};

const deleteFile = async function (filePath) {
   return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
         if (err) {
            reject(err);
         } else {
            resolve();
         }
      });
   });
};

const moveFile = async function (sourcePath, destinationPath) {
   return new Promise((resolve, reject) => {
      fs.rename(sourcePath, destinationPath, (err) => {
         if (err) {
            reject(err);
         } else {
            resolve();
         }
      });
   });
};
