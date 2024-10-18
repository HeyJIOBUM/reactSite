import UserModel from "../models/User.js";

export default async (req, res, next) => {
   try {
      const user = await UserModel.findById(req.userId);

      if (user._doc.role == "admin") {
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
