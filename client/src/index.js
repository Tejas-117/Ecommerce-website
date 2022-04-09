import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { initialState, reducer } from "./context/reducer";
import { StateProvider } from "./context/StateProvider";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Router>
        <App />
      </Router>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
