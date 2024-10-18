import React from "react";
import {
   Button,
   Paper,
   TextField,
   Stack,
   Typography,
   FormControlLabel,
   RadioGroup,
   Radio,
   FormLabel,
} from "@mui/material";

import styles from "./ProductSearch.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const ProductSearch = ({ basket, setCatalogParams, setBasketParams }) => {
   const { users } = useSelector((state) => state);

   let role = "";
   if (users.userData) {
      role = users.userData.role;
   }

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      mode: "onChange",
   });

   const onSubmit = async (values) => {
      if (basket) {
         setBasketParams(values);
      } else {
         setCatalogParams(values);
      }
   };

   return (
      <Paper classes={{ root: styles.root }}>
         {role == "seller" && (
            <Link to="/product-add">
               <Button size="small" variant="contained" fullWidth>
                  Создать товар
               </Button>
            </Link>
         )}
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               size="small"
               className={styles.field}
               label="Тип товара"
               error={Boolean(errors.productType)}
               helperText={errors.productType?.message}
               {...register("productType")}
               fullWidth
            />
            <TextField
               size="small"
               className={styles.field}
               label="Название товара"
               error={Boolean(errors.productName)}
               helperText={errors.productName?.message}
               {...register("productName")}
               fullWidth
            />
            <TextField
               size="small"
               className={styles.field}
               label="Производитель"
               error={Boolean(errors.producer)}
               helperText={errors.producer?.message}
               {...register("producer")}
               fullWidth
            />
            <Stack
               className={styles.field}
               direction="row"
               justifyContent="space-evenly"
               alignItems="center"
            >
               <TextField
                  label="min"
                  type="number"
                  variant="outlined"
                  size="small"
                  {...register("priceMin")}
                  sx={{ width: "90px" }}
               />
               <Typography>-</Typography>
               <TextField
                  label="max"
                  type="number"
                  variant="outlined"
                  size="small"
                  {...register("priceMax")}
                  sx={{ width: "90px" }}
               />
            </Stack>
            <FormLabel>
               <Typography>Сортировка</Typography>
            </FormLabel>
            <RadioGroup defaultValue="descending" {...register("sorting")}>
               <FormControlLabel
                  value="ascending"
                  control={<Radio />}
                  label="возрастание цены"
               />
               <FormControlLabel
                  value="descending"
                  control={<Radio />}
                  label="убывание цены"
               />
            </RadioGroup>
            <Button type="submit" size="small" variant="contained" fullWidth>
               Найти
            </Button>
         </form>
      </Paper>
   );
};

export default ProductSearch;
