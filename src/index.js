import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const connect = require("@vkontakte/vkui-connect");
connect.send("VKWebAppInit");

connect.subscribe(e => {
  console.log(e);
  e = e.detail;
  if (e["type"] === "VKWebAppAccessTokenReceived") {
    let access_token = e["data"]["access_token"];
    console.log("token: " + access_token);
  }
});
connect.send("VKWebAppGetAuthToken", { app_id: 6603324, scope: "wall" });

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
