import React from "react";
import ReactDOM from "react-dom/client";
import { installStorage } from "./storage.js";
import KtoSaul from "./KtoSaul.jsx";
import "./index.css";

// must run before the app mounts so Save/Library work outside the Claude runtime
installStorage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <KtoSaul />
  </React.StrictMode>
);
