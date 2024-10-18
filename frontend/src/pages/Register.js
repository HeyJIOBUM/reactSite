import React from "react";
import { Typography, TextField, Paper, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import styles from "./LogReg.module.css";
import { fetchRegister, selectGetData } from "../redux/slices/users";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
   userName: yup.string().min(4).required(),
   email: yup.string().email().required(),
   password: yup.string().min(5).max(32).required(),
});

const Registration = () => {
   const userData = useSelector(selectGetData);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isValid },
   } = useForm({
      resolver: yupResolver(schema),
      // defaultValues: {
      //    userName: "kirill",
      //    email: "kirill@mail.ru",
      //    password: "11111",
      // },
      mode: "onChange",
   });

   const onSubmit = async (values) => {
      const data = await dispatch(fetchRegister(values));
      if (!data.payload) {
         setError("userName", {
            type: "custom",
            message: "This login or email is alredy used",
         });
         setError("email", {
            type: "custom",
            message: "This login or email is alredy used",
         });
      } else {
         window.localStorage.setItem("token", data.payload.token);
         navigate("/", { replace: false });
         // return <Navigate replace={true} to="/" />;
      }
   };

   if (userData) {
      navigate("/", { replace: false });
      // return <Navigate replace={true} to="/" />;
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant="h5">
            Создание аккаунта
         </Typography>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label="Login"
               error={Boolean(errors.userName)}
               helperText={errors.userName?.message}
               {...register("userName")}
               fullWidth
            />
            <TextField
               className={styles.field}
               label="email"
               error={Boolean(errors.email)}
               helperText={errors.email?.message}
               {...register("email")}
               fullWidth
            />
            <TextField
               className={styles.field}
               label="password"
               type="password"
               error={Boolean(errors.password)}
               helperText={errors.password?.message}
               {...register("password")}
               fullWidth
            />
            <Button
               disabled={!isValid}
               type="submit"
               size="large"
               variant="contained"
               fullWidth
            >
               Зарегистрироваться
            </Button>
         </form>
         <Link className={styles.link} to="/login">
            Войти
         </Link>
      </Paper>
   );
};

export default Registration;
