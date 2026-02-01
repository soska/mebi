import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StoreContext, RootStore } from "./stores/RootStore";

const rootStore = new RootStore();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreContext.Provider value={rootStore}>
      <App />
    </StoreContext.Provider>
  </StrictMode>
);
