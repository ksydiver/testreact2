import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import * as connect from "@vkontakte/vkui-connect";

connect.send("VKWebAppInit");

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
