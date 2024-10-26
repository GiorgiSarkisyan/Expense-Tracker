import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { MovProvider } from "./context/MovContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MovProvider>
      <App />
      <Toaster />
    </MovProvider>
  </React.StrictMode>
);
