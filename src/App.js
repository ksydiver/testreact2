import React from "react";
import "./App.css";
import * as UI from "@vkontakte/vkui";
import * as connect from "@vkontakte/vkui-connect";
import "@vkontakte/vkui/dist/vkui.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.share = this.share.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.state = {
      activeView: "view1",
      name: null,
      city: null,
      post: null,
      user_id: 0,
      access_token: null,
      friends_count: null
    };
    connect.subscribe(e => {
      e = e.detail;
      if (e["type"] === "VKWebAppAccessTokenReceived") {
        let access_token = e["data"]["access_token"];
        this.setState({ access_token: access_token });
      } else if (e["type"] === "VKWebAppAccessTokenFailed") {
        let error = e["data"]["error_type"]["error_reason"];
        this.setState({
          friends_count: "количество не удалось получить." + error
        });
        this.setState({ access_token: null });
      } else if (e["type"] === "VKWebAppGetUserInfoResult") {
        let name = e["data"]["first_name"] + " " + e["data"]["last_name"];
        let id = e["data"]["id"];

        if (e["data"]["city"]) {
          let city = e["data"]["city"]["title"];
          this.setState({ city: city });
        } else {
          this.setState({ city: "не установлен" });
        }
        this.setState({ name: name });
        this.setState({ user_id: id });
      } else if (e["type"] === "VKWebAppShowWallPostBoxFailed") {
        this.setState({ activeView: "view1" });
      }
    });

    /*if (this.state.access_token === null) {
      connect.send("VKWebAppGetAuthToken", {
        app_id: 6603324
      });
    }
    connect.send("VKWebAppGetAuthToken", {
      app_id: 6603324,
      scope: "friends,wall,groups"
    });*/
    if (this.state.name === null) {
      connect.send("VKWebAppGetUserInfo");
    }

    /*if (this.state.post === null) {
      connect.send("VKWebAppShowWallPostBoxResult");
    }*/
  }

  render() {
    return (
      <UI.Root activeView={this.state.activeView}>
        <UI.View activePanel="panel1.1" id="view1">
          <UI.Panel id="panel1.1">
            <UI.PanelHeader>Кто я такой?</UI.PanelHeader>
            <UI.Group title="Сейчас узнаем">
              <UI.Div style={{ display: "flex" }}>
                <UI.Button
                  size="m"
                  onClick={() => {
                    this.getInfo();
                  }}
                  /*{() => this.setState({ activeView: "view2" })}*/
                  stretched
                  style={{ marginRight: 8 }}
                >
                  Обо мне
                </UI.Button>
                <UI.Button
                  size="m"
                  onClick={() => {
                    this.share();
                  }}
                  stretched
                  style={{ marginRight: 8 }}
                >
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
                <UI.ListItem>Город: {this.state.city}</UI.ListItem>
                <UI.ListItem>
                  Друзей всего: {this.state.friends_count}
                </UI.ListItem>
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
                <UI.ListItem>
                  <a href={"https://" + this.state.post}>{this.state.post}</a>
                </UI.ListItem>
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
      message: this.state.name + " готовит инопланетное вторжение"
    });
    connect.subscribe(e => {
      e = e.detail;
      if (e["type"] === "VKWebAppShowWallPostBoxResult") {
        let post =
          "vk.com/wall" + this.state.user_id + "_" + e["data"]["post_id"];
        this.setState({ post: post });
        this.setState({ activeView: "view3" });
      } else if (e["type"] === "VKWebAppShowWallPostBoxFailed") {
        let error = e["data"]["error_type"];
        this.setState({ post: error });
        this.setState({ activeView: "view3" });
      }
    });
  }
  getInfo() {
    connect.send("VKWebAppCallAPIMethod", {
      method: "friends.get",
      params: { v: "5.80", access_token: this.state.access_token }
    });
    connect.subscribe(e => {
      e = e.detail;
      if (e["type"] === "VKWebAppCallAPIMethodResult") {
        let friends_count = e["data"]["response"]["count"];
        this.setState({ friends_count: friends_count });
        this.setState({ activeView: "view2" });
      } else if (e["type"] === "VKWebAppCallAPIMethodFailed") {
        this.setState({ friends_count: "не удалось получить" });
        this.setState({ activeView: "view2" });
      }
    });
    if (this.state.friends_count === null) {
      connect.send("VKWebAppCallAPIMethod", {
        method: "friends.get",
        params: { v: "5.80", access_token: this.state.access_token }
      });
    }
  }
}

export default App;
