import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { cleanOnLoad } from "./utils/bannerProtection";

// Запуск системы защиты от внешних баннеров
cleanOnLoad();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
