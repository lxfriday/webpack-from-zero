import React from "react";
import ReactDOM from "react-dom/client";

import Home from "./Pages/Home";

function App() {
  return (
    <div>
      <Home />
    </div>
  );
}

const root = document.querySelector("#root");

ReactDOM.createRoot(root).render(<App />);
