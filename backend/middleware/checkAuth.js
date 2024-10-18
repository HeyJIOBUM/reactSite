import jwt from "jsonwebtoken";

export default (req, res, next) => {
   const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

   if (token) {
      try {
         const decoded = jwt.verify(token, "1111");
         req.userId = decoded._id;

         return next();
      } catch (e) {
         return res.status(401).json({
            message: "Необходимо войти в аккаунт",
         });
      }
   } else {
      return res.status(401).json({
         message: "Необходимо войти в аккаунт",
      });
   }
};
