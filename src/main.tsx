import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App>
      <AppRouter />
    </App>
  </React.StrictMode>
);
