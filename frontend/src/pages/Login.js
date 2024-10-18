import React from "react";
import { Typography, TextField, Paper, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchLogin, selectGetData } from "../redux/slices/users";

import styles from "./LogReg.module.css";

const schema = yup.object().shape({
   userName: yup.string().min(4).required(),
   password: yup.string().min(5).max(32).required(),
});

const Login = () => {
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
      //    password: "11111",
      // },
      mode: "onChange",
   });

   const onSubmit = async (values) => {
      const data = await dispatch(fetchLogin(values));
      if (!data.payload) {
         setError("userName", {
            type: "custom",
            message: "This user doesn't exist",
         });
      } else {
         window.localStorage.setItem("token", data.payload.token);
         navigate("/", { replace: false });
      }
   };

   if (userData) {
      navigate("/");
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant="h5">
            Вход в аккаунт
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
               label="Password"
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
               Войти
            </Button>
         </form>
         <Link className={styles.link} to="/register">
            Создать аккаунт
         </Link>
      </Paper>
   );
};

export default Login;
