import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <StrictMode>
      <BrowserRouter>
      <SnackbarProvider>
        <App />
        </SnackbarProvider>
      </BrowserRouter>
    </StrictMode>
);
