import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No root element found. Ensure index.html contains <div id=\"root\"></div>");
}

createRoot(rootEl).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
