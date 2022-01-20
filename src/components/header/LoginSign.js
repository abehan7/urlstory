import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { UserContext } from "../../App";
import IsLoggedIn from "./IsLoggedIn";
import IsNotLoggedIn from "./IsNotLoggedIn";

const LoginSignEl = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 1rem;
  padding-right: 10px;
`;

const LoginSign = () => {
  const { loginUser, setLoginUser } = useContext(UserContext);

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.replace("/");
  };
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/signup");
  };
  return (
    <LoginSignEl>
      {token ? (
        <IsLoggedIn handleLogout={handleLogout} />
      ) : (
        <IsNotLoggedIn handleLogin={handleLogin} handleSignUp={handleSignUp} />
      )}
    </LoginSignEl>
  );
};

export default LoginSign;
