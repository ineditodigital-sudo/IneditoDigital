
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  /* El puente del editor del panel: solo se descarga dentro de su iframe
     (o forzado con ?editorVivo=1 para pruebas). Una visita normal no paga
     ni un byte por él. */
  if (window.self !== window.top || window.location.search.includes('editorVivo')) {
    import('./app/editorEnVivo');
  }

  createRoot(document.getElementById("root")!).render(<App />);
