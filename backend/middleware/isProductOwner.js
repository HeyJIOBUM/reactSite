import ProductModel from "../models/Product.js";

export default async (req, res, next) => {
   try {
      const product = await ProductModel.findById(req.params.productId);
      if (!product) {
         return res.status(404).json({
            message: "Товар не найден",
         });
      }

      if (product._doc.sellerId == req.userId) {
         next();
      } else {
         return res.status(403).json({
            message: "Доступ запрещён",
         });
      }
   } catch (err) {
      console.log(err);
      res.status(403).json({
         message: "Доступ запрещён",
      });
   }
};
