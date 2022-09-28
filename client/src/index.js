import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import UserContextProvider from "./context/UserContext";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
