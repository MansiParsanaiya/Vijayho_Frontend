import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";

import store from "./store";
import BranchPage from "pages/Branches/BranchPage";
import BranchProvider from "pages/Branches/BranchContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store} >
      <React.Fragment>
        <BrowserRouter>
        <BranchProvider><App /></BranchProvider>
        </BrowserRouter>
      </React.Fragment>
    </Provider>
);

serviceWorker.unregister()
