import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< HEAD
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
=======
import './styles.css';
import { RouterProvider } from "react-router-dom";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
 <React.StrictMode>
   <RouterProvider router={router} />
 </React.StrictMode>
>>>>>>> 7edc912eb716b41f89e346c5f1285fd1cb1682c5
);
