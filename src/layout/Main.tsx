import { Button } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import styled from "styled-components";
import { useAuth } from "../context/AuthProvider";
import { ReactComponent as IconPet } from "../assets/pets-svgrepo-com.svg";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
`;

const Header = () => {
  const { signOut } = useAuth();

  const handleSign = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <header>
      <div className="navbar navbar-dark bg-dark box-shadow">
        <div className="container d-flex justify-content-between">
          <a href="#" className="navbar-brand d-flex align-items-center">
            <IconPet
              style={{
                width: "40px",
                height: "40px",
                fill: "white",
              }}
            />
            {/* <strong>Pet</strong> */}
          </a>
          <Button onClick={handleSign}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
};

export const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </LayoutContainer>
  );
};
