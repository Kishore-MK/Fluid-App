import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { WalletProvider } from "./context/WalletContext";
import { NameServiceProvider } from "./context/NameserviceContext";
import { BridgeProvider } from "./context/BridgeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <NameServiceProvider>
          <BridgeProvider>
            <App />
          </BridgeProvider>
        </NameServiceProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>
);
