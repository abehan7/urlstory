import React from "react";
import { BiLogOutCircle } from "react-icons/bi";
import styled from "styled-components";
import Login from "./Login.styled";

const Icon = styled.div`
  font-size: 1.2rem;
`;

const Logout = styled(Login)`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 0.3rem;
`;

const IsLoggedIn = ({ handleLogout }) => {
  return (
    <Logout onClick={handleLogout}>
      <Icon>
        <BiLogOutCircle />
      </Icon>
      Logout
    </Logout>
  );
};

export default IsLoggedIn;
