
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
import { SocketProvider } from "./contexts/SocketContext.tsx";
import { useAuth } from "./contexts/AuthContext.tsx";

  const {currentUser} = useAuth();
  const userId = currentUser?.id;

  createRoot(document.getElementById("root")!).render(
    <SocketProvider userId={userId!}>
      <App />
    </SocketProvider>
  );
  