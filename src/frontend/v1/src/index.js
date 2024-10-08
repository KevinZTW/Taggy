import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./component/App.jsx";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducers from "./redux/reducers";
import { Provider } from "react-redux";
const store = createStore(allReducers, composeWithDevTools());
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
