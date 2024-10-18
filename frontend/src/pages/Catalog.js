import React, { useState } from "react";

import { ProductSearch, ProductCard } from "../components";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/products";

const Catalog = () => {
   const dispatch = useDispatch();
   const [searchParams, setCatalogParams] = useState({});
   const { products } = useSelector((state) => state);

   const isProductLoading = products.status === "loading";

   React.useEffect(() => {
      dispatch(fetchProducts({ searchParams: searchParams }));
   }, [searchParams]);

   return (
      <div
         style={{
            display: "flex",
            alignSelf: "baseline",
            paddingBottom: "20px",
         }}
      >
         <Grid container spacing={1}>
            <Grid container item xs={12} spacing={3}>
               {(isProductLoading ? [...Array(0)] : products.items).map(
                  (product) =>
                     isProductLoading ? (
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
                              producer={product.producer}
                              createdAt={product.createdAt}
                              isCatalog
                           ></ProductCard>
                        </Grid>
                     )
               )}
            </Grid>
         </Grid>
         <ProductSearch setCatalogParams={setCatalogParams} catalog />
      </div>
   );
};

export default Catalog;
