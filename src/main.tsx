  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { idiomaGuardado, cargarDiccionario } from "./app/idioma";
  import "./styles/index.css";

  /* El puente del editor del panel: solo se descarga dentro de su iframe
     (o forzado con ?editorVivo=1 para pruebas). Una visita normal no paga
     ni un byte por él. */
  if (window.self !== window.top || window.location.search.includes('editorVivo')) {
    import('./app/editorEnVivo');
  }

  const raiz = createRoot(document.getElementById("root")!);

  /* Quien ya eligió inglés espera el diccionario antes del primer pintado. Es
     un trozo aparte y una sola petición; si se pintara primero, la página
     saldría en español y se voltearía a la vista. En español —la inmensa
     mayoría— no se descarga nada y esto no cuesta ni un milisegundo. */
  if (idiomaGuardado() === 'en') {
    cargarDiccionario().then(() => raiz.render(<App />));
  } else {
    raiz.render(<App />);
  }
