import React from "react";
import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { NavBar } from "./components";
import {
   AddProduct,
   Admin,
   Basket,
   Catalog,
   Login,
   Product,
   Register,
} from "./pages";
import { fetchGetMe, selectGetData } from "./redux/slices/users";

function App() {
   const dispath = useDispatch();
   const userData = useSelector(selectGetData);

   React.useEffect(() => {
      dispath(fetchGetMe());
   }, []);

   return (
      <>
         <NavBar />
         <Container maxWidth="lg">
            <Routes>
               <Route path="/" element={<Catalog />}></Route>
               <Route
                  path="/product-add"
                  element={<AddProduct addProduct />}
               ></Route>
               <Route
                  path="/product/edit/:productId"
                  element={<AddProduct editProduct />}
               ></Route>
               <Route path="/admin" element={<Admin />}></Route>
               <Route
                  exact
                  path="/basket/:userId"
                  element={<Basket isSellerBasket />}
               ></Route>
               <Route exact path="/basket" element={<Basket />}></Route>
               <Route path="/login" element={<Login />}></Route>
               <Route path="/product/:productId" element={<Product />}></Route>
               <Route path="/register" element={<Register />}></Route>
            </Routes>
         </Container>
      </>
   );
}

export default App;
