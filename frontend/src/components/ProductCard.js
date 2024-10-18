import React from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";

import {
   Card,
   CardMedia,
   CardContent,
   Typography,
   Button,
   IconButton,
} from "@mui/material";

import styles from "./ProductCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { fetchGetMe } from "../redux/slices/users";

const ProductCard = ({
   _id,
   productType,
   productName,
   description,
   price,
   producer,
   sellerId,
   imgNames,
   createdAt,
   isFullProduct,
   isBasket,
   isCatalog,
   isSellerBasket,
}) => {
   const userData = useSelector((state) => state.users.userData);

   let role = "";
   let userId = "";
   let userBasket = "";
   if (userData) {
      role = userData.role;
      userId = userData._id;
      userBasket = userData.basket;
   }
   const navigate = useNavigate();
   const dispatch = useDispatch();

   return (
      <>
         {isFullProduct ? (
            <Card sx={{ display: "flex" }}>
               <CardMedia
                  component="img"
                  sx={{ width: 300 }}
                  // image={imgNames[0]}
                  image="/logo512.png"
                  alt="Product Image"
               />
               <CardContent
                  sx={{
                     display: "flex",
                     alignItems: "flex-start",
                     flexDirection: "column",
                     justifyContent: "space-between",
                  }}
               >
                  <Typography variant="h6" gutterBottom>
                     {productType}
                  </Typography>
                  <Typography variant="h3" gutterBottom>
                     {productName}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                     {description}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                     {createdAt}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                     {price}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                     {producer}
                  </Typography>
                  {sellerId == userId && (
                     <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                           navigate("/product/edit/" + _id);
                        }}
                     >
                        Изменить товар
                     </Button>
                  )}
                  {role === "user" && (
                     <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                           await axios
                              .patch("/user/basket/" + userId, {
                                 productId: _id,
                              })
                              .then(() => dispatch(fetchGetMe()))
                              .catch((err) => console.log(err));
                        }}
                     >
                        {userBasket.includes(_id) ? (
                           <>Удалить из корзины</>
                        ) : (
                           <>Добавить в корзину</>
                        )}
                     </Button>
                  )}
               </CardContent>
            </Card>
         ) : (
            <Card className={styles.card}>
               <CardMedia
                  component="img"
                  // image={imgNames[0]}
                  height="140"
                  image="/logo512.png"
               />
               <CardContent className={styles.cardContent}>
                  <div>
                     <Typography variant="body1" component="div">
                        {productType + " - " + producer}
                     </Typography>
                     <Typography variant="h6" color="text.secondary">
                        <Link className={styles.link} to={"/product/" + _id}>
                           {productName}
                        </Link>
                     </Typography>
                     <Typography variant="h6" color="text.secondary">
                        {price}
                     </Typography>
                  </div>
                  {role === "user" && (
                     <IconButton
                        edge="end"
                        aria-label="add"
                        onClick={async () => {
                           console.log(_id);
                           await axios
                              .patch("/user/basket/" + userId, {
                                 productId: _id,
                              })
                              .then((res) => window.location.reload())
                              .catch((err) => console.log(err));
                        }}
                     >
                        {userData.basket.includes(_id) ? (
                           <DeleteIcon />
                        ) : (
                           <AddIcon />
                        )}
                     </IconButton>
                  )}
                  {sellerId == userId && (
                     <div
                        styles={{
                           display: "flex",
                           flexDirection: "row",
                        }}
                     >
                        <IconButton
                           edge="end"
                           aria-label="delete"
                           onClick={async () => {
                              console.log(_id);
                              await axios
                                 .patch("/user/basket/" + userId, {
                                    productId: _id,
                                 })
                                 .then(()=>window.location.reload())
                                 .catch((err) => console.log(err));
                           }}
                        >
                           <DeleteIcon />
                        </IconButton>
                        <IconButton
                           edge="end"
                           aria-label="edit"
                           onClick={() => {
                              navigate("/product/edit/" + _id);
                           }}
                        >
                           <EditIcon />
                        </IconButton>
                     </div>
                  )}
               </CardContent>
            </Card>
         )}
      </>
   );
};

export default ProductCard;
