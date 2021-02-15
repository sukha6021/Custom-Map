import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import BaseMap from "./views/BaseMap/BaseMap.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import MyMaps from "./views/MyMap/MyMaps";
import About from "./views/Sidebar/About";
import Sidebar from "./views/Sidebar/Sidebar";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App(props) {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const share = params.get("share");
  console.log(params);
  console.log(share);

  if (params.has("share"))
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <Route path="/map/:id" component={BaseMap} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  return (
    <React.Fragment>
      <Router>
        <NavBar />
        <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
          <Sidebar />
          <Switch>
            <Route exact path="/" component={Auth(BaseMap, true)} />
            <Route path="/map/:id" component={BaseMap} />
            <Route path="/about" component={About} />

            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route
              exact
              path="/register"
              component={Auth(RegisterPage, false)}
            />
            <Route path="/mymaps" component={Auth(MyMaps, true)} />
          </Switch>
        </div>
      </Router>
    </React.Fragment>
  );
}

export default App;
