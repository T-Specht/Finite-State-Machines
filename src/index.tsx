import React from "react";
import { render } from "react-dom";
import App from "./App";
import "./styles.scss";
import "semantic-ui-css/semantic.min.css";
import { AppContextProviderWrapper } from "./AppContext";

render(
  <AppContextProviderWrapper>
    <App />
  </AppContextProviderWrapper>,
  document.getElementById("app")
);
