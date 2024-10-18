import UserModel from "../models/User.js";

export default async (req, res, next) => {
   try {
      const user = await UserModel.findById(req.params.userId);
      if (!user) {
         return res.status(404).json({
            message: "Пользователь не найден",
         });
      }

      if (req.params.userId == req.userId) {
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
