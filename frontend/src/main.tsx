import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SocketProvider } from "./contexts/SocketContext.tsx";
import { useAuth } from "./contexts/AuthContext.tsx";



createRoot(document.getElementById("root")!).render(

        <App />

);
