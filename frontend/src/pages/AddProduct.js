import React, { useState } from "react";
import { Typography, TextField, Container, Button } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "../axios";
import styles from "./AddProduct.module.css";


const schema = yup.object().shape({
   productType: yup.string().required(),
   productName: yup.string().required(),
   description: yup.string().required(),
   price: yup.number().min(1).required(),
   producer: yup.string().required(),
});

const AddProduct = ({ addProduct, editProduct }) => {
   const { users } = useSelector((state) => state);
   const { productId } = useParams();
   const navigate = useNavigate();
   const [productType, setProductType] = React.useState("");
   const [productName, setProductName] = React.useState("");
   const [description, setDescription] = React.useState("");
   const [price, setPrice] = React.useState("");
   const [producer, setProducer] = React.useState("");

   React.useEffect(() => {
      if (editProduct) {
         axios.get("/product/" + productId).then(({ data }) => {
            setProductType(data.productType);
            setProductName(data.productName);
            setDescription(data.description);
            setPrice(data.price);
            setProducer(data.producer);
         });
      }
   }, []);

   let role = "";
   let userId = "";
   if (users.userData) {
      if (users.userData.role !== "seller") {
         navigate("/");
      } else {
         role = users.userData.role;
         userId = users.userData._id;
      }
   }

   const onSubmit = async () => {
      const fields = {
         productType,
         productName,
         description,
         price,
         producer,
         sellerId: userId,
      };
      if (addProduct) {
         axios
            .post("/product", fields)
            .then(() => {
               navigate("/");
               window.location.reload();
            })
            .catch((err) => console.log(err));
      } else {
         axios
            .patch("/product/" + productId, fields)
            .then(() => {
               navigate("/");
               window.location.reload();
            })
            .catch((err) => console.log(err));
      }
   };

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(schema),
      mode: "all",
   });

   return (
      <Container maxWidth="md" classes={{ root: styles.root }}>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Typography classes={{ root: styles.title }} variant="h5">
               {addProduct ? <>Добавление товара</> : <>Изменение товара</>}
            </Typography>
            <TextField
               {...register("productType")}
               className={styles.field}
               label="Тип товара"
               error={Boolean(errors.productType)}
               helperText={errors.productType?.message}
               value={productType}
               onChange={(e) => setProductType(e.target.value)}
               fullWidth
            />
            <TextField
               {...register("productName")}
               className={styles.field}
               label="Название"
               error={Boolean(errors.productName)}
               helperText={errors.productName?.message}
               value={productName}
               onChange={(e) => setProductName(e.target.value)}
               fullWidth
            />
            <TextField
               {...register("description")}
               className={styles.field}
               label="Описание"
               error={Boolean(errors.description)}
               helperText={errors.description?.message}
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               fullWidth
            />
            <TextField
               {...register("price")}
               className={styles.field}
               type="number"
               label="Цена товара"
               error={Boolean(errors.price)}
               helperText={errors.price?.message}
               value={price}
               onChange={(e) => setPrice(e.target.value)}
               fullWidth
            />
            <TextField
               {...register("producer")}
               className={styles.field}
               label="Фирма производитель"
               error={Boolean(errors.producer)}
               helperText={errors.producer?.message}
               value={producer}
               onChange={(e) => setProducer(e.target.value)}
               fullWidth
            />
            <Button type="sybmit" size="large" variant="contained" fullWidth>
               {addProduct ? <>Добавить</> : <>Изменить</>}
            </Button>
         </form>
      </Container>
   );
};

export default AddProduct;
