import { body } from "express-validator";

export const loginValidation = [
   body("userName", "Неверный логин").isString(),
   body("password", "Пароль должен быть минимум 5 символов").isLength({
      min: 5,
   }),
];

export const registerValidation = [
   body("userName", "Укажите имя").isString().isLength({
      min: 4,
   }),
   body("email", "Неверный формат почты").isEmail(),
   body("password", "Пароль должен содержать минимум 5 символов").isLength({
      min: 5,
   }),
];

export const productValidation = [
   body("productType", "Введите тип товара").isString(),
   body("productName", "Введите название товара").isString(),
   body("description", "Введите описание товара").isString(),
   body("price", "Неверная цена").isNumeric(),
   body("producer", "Неверная страна производства").isString(),
   body("imgNames").optional().isArray(),
];
