import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./tailwind.css";
import "./utils/testApiConnection";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
