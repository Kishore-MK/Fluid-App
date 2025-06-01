import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { WalletProvider } from "./context/WalletContext"; 
import { NameServiceProvider } from "./context/NameserviceContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
         <NameServiceProvider>
          <App />
         </NameServiceProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>
);
