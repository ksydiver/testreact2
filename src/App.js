import React from "react";
import "./App.css";
import * as UI from "@vkontakte/vkui";
import * as connect from "@vkontakte/vkui-connect";
import "@vkontakte/vkui/dist/vkui.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeView: "view1",
      name: null,
      city: null,
      post: null
    };
    let self = this;
    connect.subscribe(e => {
      e = e.detail;
      if (e["type"] === "VKWebAppGetUserInfoResult") {
        let name = e["data"]["first_name"] + " " + e["data"]["last_name"];
        let owner_id = e["data"]["id"];
        let city = e["data"]["city"]["title"];
        self.setState({ name: name });
        self.setState({ owner_id: owner_id });
        self.setState({ city: city });
      } else if (e["type"] === "VKWebAppShowWallPostBoxResult") {
        let post = "vk.com/wall" + self.owner_id + "_" + e["data"]["post_id"];
        self.setState({ post: post });
        self.setState({ activeView: "view3" });
      }
    });
    if (this.state.name === null) {
      connect.send("VKWebAppGetUserInfo");
    }
    /*if (this.state.post === null) {
      connect.send("VKWebAppShowWallPostBoxResult");
    }*/
  }

  userInfo() {
    let newState = App.getInitState();
    connect.subscribe(e => {
      let result = e.detail;
      if (result["type"] === "VKWebAppGetUserInfoResult") {
        newState.name = result["data"]["first_name"];
      }
    });
    connect.send("VKWebAppGetUserInfo", {});
    this.setState(newState);
  }

  render() {
    return (
      <UI.Root activeView={this.state.activeView}>
        <UI.View activePanel="panel1.1" id="view1">
          <UI.Panel id="panel1.1">
            <UI.PanelHeader>Кто я?</UI.PanelHeader>
            <UI.Group title="Щас узнаем">
              <UI.Div style={{ display: "flex" }}>
                <UI.Button
                  size="m"
                  onClick={() => this.setState({ activeView: "view2" })}
                  stretched
                  style={{ marginRight: 8 }}
                >
                  Обо мне
                </UI.Button>
                <UI.Button size="m" onClick={this.share()} stretched level="2">
                  Рассказать
                </UI.Button>
              </UI.Div>
            </UI.Group>
          </UI.Panel>
        </UI.View>
        <UI.View header activePanel="panel2.1" id="view2">
          <UI.Panel id="panel2.1">
            <UI.PanelHeader>Обо мне</UI.PanelHeader>
            <UI.Group title="Информация">
              <UI.List>
                <UI.ListItem>{this.state.name}</UI.ListItem>
                <UI.ListItem>{this.state.city}</UI.ListItem>
              </UI.List>
            </UI.Group>
            <UI.Group>
              <UI.Button
                type="cell"
                onClick={() => this.setState({ activeView: "view1" })}
              >
                Назад
              </UI.Button>
            </UI.Group>
          </UI.Panel>
        </UI.View>
        <UI.View header activePanel="panel3.1" id="view3">
          <UI.Panel id="panel3.1">
            <UI.PanelHeader>Запись на стене</UI.PanelHeader>
            <UI.Group title="Ссылка на запись">
              <UI.List>
                <UI.ListItem>{this.state.post}</UI.ListItem>
              </UI.List>
            </UI.Group>
            <UI.Group>
              <UI.Button
                type="cell"
                onClick={() => this.setState({ activeView: "view1" })}
              >
                Назад
              </UI.Button>
            </UI.Group>
          </UI.Panel>
        </UI.View>
      </UI.Root>
    );
  }
  share() {
    connect.send("VKWebAppShowWallPostBox", {
      message: "Если эта запись опубликовалась -- я счастливый человек"
    });
  }
}

export default App;
