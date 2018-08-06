import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import * as connect from "@vkontakte/vkui-connect";

connect.send("VKWebAppInit");
connect.send("VKWebAppGetAuthToken", {
  app_id: 6603324
});
ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
