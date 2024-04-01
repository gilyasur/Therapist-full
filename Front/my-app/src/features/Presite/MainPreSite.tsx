import React from "react";
import {  useNavigate } from "react-router-dom";

import logoImage from "../../images/DashBoardLogo.jpeg";

import { Login } from "./login/Login";
import { useSelector } from "react-redux";
import { selectLogged } from "./login/loginSlice";
import {
  Anchor,
  Title,
  Text,
  Container,
  Group,
} from "@mantine/core";

import classes from "./MainPreSite.module.css";


export function MainPreSite() {
  const logged = useSelector(selectLogged);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };
  return (
    <div >
      <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
  <Group className={classes.groupContainer} gap="xs">
    <div className={classes.logoContainer}>
      <img
        src={logoImage}
        alt="Logo"
        style={{
          height: "90px",
          borderRadius: "50%",
          border: "1px solid #94b6bf",
        }}
      />
    </div>
    <div className={classes.textContainer}>
      <div className={classes.dmSansCustom}>Therapist DashBoard App</div>
    </div>
  </Group>
</Container>
      </div>
<div>
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Welcome Back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component="button" onClick={handleRegisterClick}>
            Create account
          </Anchor>
        </Text>

        <Login></Login>
        <Anchor component="button" size="sm"></Anchor>
      </Container>
      </div>
    </div>
  );
}
