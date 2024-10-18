import { configureStore } from "@reduxjs/toolkit";
import { productsReducer } from "./slices/products";
import { usersReducer } from "./slices/users";
import { basketReducer } from "./slices/basket";
import { adminReducer } from "./slices/admin";

const store = configureStore({
   reducer: {
      products: productsReducer,
      users: usersReducer,
      basket: basketReducer,
      admin: adminReducer,
   },
});

export default store;
