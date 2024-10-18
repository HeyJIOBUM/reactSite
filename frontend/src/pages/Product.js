import React, { createFactory } from "react";
import { ProductCard } from "../components";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { selectGetData } from "../redux/slices/users";
const img = ["logo512.png"];

const Product = () => {
   const dispatch = useDispatch();
   const userData = useSelector(selectGetData);

   let role = "";
   if (userData) {
      role = userData.role;
   }

   const { productId } = useParams();
   const [data, setData] = React.useState(null);
   const [isLoading, setLoading] = React.useState(true);

   React.useEffect(() => {
      axios
         .get("/product/" + productId)
         .then((res) => {
            setData(res.data);
            setLoading(false);
         })
         .catch((err) => {
            console.warn(err);
            alert("Getting product error!");
         });
   }, []);

   if (isLoading) {
      return <></>;
   }

   return (
      <ProductCard
         _id={data._id}
         productType={data.productType}
         productName={data.productName}
         description={data.description}
         producer={data.producer}
         price={data.price}
         sellerId={data.sellerId}
         // imgNames={data.imgNames}
         imgNames={img}
         createdAt={data.createdAt}
         isFullProduct
      ></ProductCard>
   );
};

export default Product;
