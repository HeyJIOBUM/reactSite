import React, { useState } from "react";
import { ProductSearch, ProductCard } from "../components";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetBasket, fetchGetSellerBasket } from "../redux/slices/basket";
import { useNavigate, useParams } from "react-router-dom";

const Basket = ({ isSellerBasket }) => {
   const navigate = useNavigate();
   const { userId } = useParams();
   const dispatch = useDispatch();
   const userData = useSelector((state) => state.users.userData);
   const [searchParams, setBasketParams] = useState({});

   const { basket } = useSelector((state) => state);

   let role = "";
   if (userData) {
      role = userData.role;
   }

   const isBasketLoading = basket.status === "loading";

   React.useEffect(() => {
      if (isSellerBasket) {
         dispatch(
            fetchGetSellerBasket({ _id: userId, searchParams: searchParams })
         );
      } else {
         dispatch(fetchGetBasket({ searchParams: searchParams }));
      }
   }, [searchParams]);

   if (!isSellerBasket && !role) {
      navigate("/");
   }

   return (
      <>
         <div
            style={{
               display: "flex",
               alignSelf: "baseline",
               paddingBottom: "20px",
            }}
         >
            <Grid container spacing={1}>
               <Grid container item xs={12} spacing={3}>
                  {(isBasketLoading ? [...Array(0)] : basket.items).map(
                     (product, index) =>
                        isBasketLoading ? (
                           <></>
                        ) : (
                           <Grid item xs={4} key={product._id}>
                              <ProductCard
                                 _id={product._id}
                                 productType={product.productType}
                                 productName={product.productName}
                                 description={product.description}
                                 price={product.price}
                                 sellerId={product.sellerId}
                                 imgNames={product.imgNames}
                                 createdAt={product.createdAt}
                                 producer={product.producer}
                                 isBasket
                                 isSellerBasket={isSellerBasket}
                              ></ProductCard>
                           </Grid>
                        )
                  )}
               </Grid>
            </Grid>
            <ProductSearch setBasketParams={setBasketParams} basket />
         </div>
      </>
   );
};

export default Basket;
