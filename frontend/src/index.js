import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import store from "./redux/store";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <>
      <CssBaseline />
      <BrowserRouter>
         <Provider store={store}>
            <App />
         </Provider>
      </BrowserRouter>
   </>
);
