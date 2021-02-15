import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import "./Sections/Navbar.css";
import logo from "../../../images/logo.png";
import { useSelector } from "react-redux";
import { AiOutlineFontSize } from "react-icons/ai";

function NavBar() {
  const user = useSelector((state) => {
    if (document.getElementById("userId") != null) {
      console.log(document.getElementById("userId"));
      if (state.user.userData != null && state.user.userData.name != null)
        document.getElementById("userId").innerHTML = state.user.userData.name;
    }
    return state.user;
  });
  console.log(user.userData);
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav
      className="menu"
      style={{ position: "fixed", color:"white", zIndex: 5, width: "100%" }}
    >
      <div className="menu__logo">
        <a href="/">
          <img src={logo} alt="QuickBooking" />
        </a>
      </div>

      <div className="menu__container">
        <div className="menu_left">
          <LeftMenu mode="horizontal" />
        </div>
        <div style={{ float: "right", font: "20px" }} id="userId"></div>
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
