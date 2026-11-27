import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext/AuthProvider.jsx";
import { MensajeProvider } from "./context/MensajeContext/MensajeProvider.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MensajeProvider>
          <App />
        </MensajeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
