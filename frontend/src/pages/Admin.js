import React from "react";
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import CastleOutlinedIcon from "@mui/icons-material/CastleOutlined";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

import styles from "./Admin.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllUsers } from "../redux/slices/admin";
import axios from "../axios";

const Admin = () => {
   const { admin } = useSelector((state) => state);
   const userData = useSelector((state) => state.users.userData);

   const dispatch = useDispatch();
   const navigate = useNavigate();

   React.useEffect(() => {
      if (!userData || (userData && userData.role !== "admin")) {
         navigate("/");
      } else {
         dispatch(fetchGetAllUsers());
      }
   }, []);

   const isUsersLoading = admin.status === "loading";

   return (
      <Table sx={{ backgroundColor: "white" }}>
         <TableHead>
            <TableRow>
               <TableCell>Login</TableCell>
               <TableCell>Email</TableCell>
               <TableCell>Role</TableCell>
               <TableCell>Delete</TableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {(isUsersLoading ? [...Array(0)] : admin.adminData).map((row) => (
               <TableRow key={row._id}>
                  {row.role === "seller" ? (
                     <TableCell className={styles.linkRow}>
                        <Link to={"/basket/" + row._id}>{row.userName}</Link>
                     </TableCell>
                  ) : (
                     <TableCell>{row.userName}</TableCell>
                  )}
                  <TableCell>{row.email}</TableCell>
                  {row.role === "user" ? (
                     <>
                        <TableCell>
                           {row.role}
                           <IconButton
                              edge="end"
                              aria-label="levelUp"
                              onClick={() => {
                                 axios.patch("/user/" + row._id);
                                 window.location.reload();
                              }}
                           >
                              <ArrowCircleUpIcon />
                           </IconButton>
                        </TableCell>
                     </>
                  ) : (
                     <>
                        <TableCell>{row.role}</TableCell>
                     </>
                  )}
                  {row.role !== "admin" && (
                     <TableCell>
                        <IconButton
                           edge="end"
                           aria-label="delete"
                           onClick={() => {
                              axios.delete("/user/" + row._id);
                              window.location.reload();
                              window.location.reload();
                           }}
                        >
                           <DeleteIcon />
                        </IconButton>
                     </TableCell>
                  )}
                  {row.role === "admin" && (
                     <TableCell>
                        <IconButton
                           onClick={() => {
                              alert("Хорош!!!!!!");
                           }}
                        >
                           <CastleOutlinedIcon edge="end" aria-label="delete" />
                        </IconButton>
                     </TableCell>
                  )}
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
};

export default Admin;
