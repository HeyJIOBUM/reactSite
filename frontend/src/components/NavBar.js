import React from "react";
import { Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/users";
import styles from "./NavBar.module.css";

const NavBar = () => {
   const dispatch = useDispatch();
   const userData = useSelector((state) => state.users.userData);
   const navigate = useNavigate();

   let role = "";
   if (userData) {
      role = userData.role;
   }

   const onClickLogout = () => {
      window.localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
   };

   return (
      <div className={styles.root}>
         <Container maxWidth="lg">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
               <Link className={styles.logo} to="/">
                  <>Store catalog</>
               </Link>
               <div className={styles.buttons}>
                  {role === "user" && (
                     <>
                        <Link to="/basket">
                           <Button variant="contained" size="large">
                              Корзина
                           </Button>
                        </Link>
                     </>
                  )}
                  {role === "seller" && (
                     <>
                        <Link to="/basket">
                           <Button variant="contained" size="large">
                              Мои товары
                           </Button>
                        </Link>
                     </>
                  )}
                  {role === "admin" && (
                     <>
                        <Link to="/admin">
                           <Button variant="contained" size="large">
                              Пользователи
                           </Button>
                        </Link>
                     </>
                  )}
                  {role ? (
                     <>
                        <Button
                           onClick={onClickLogout}
                           variant="contained"
                           size="large"
                        >
                           Выйти
                        </Button>
                     </>
                  ) : (
                     <>
                        <Link to="/login">
                           <Button variant="contained" size="large">
                              Войти
                           </Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </Container>
      </div>
   );
};

export default NavBar;
