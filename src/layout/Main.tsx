import { Button } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { MdLogout } from "react-icons/md";

import styled from "styled-components";
import { useAuth } from "../context/AuthProvider";
import { ReactComponent as IconPet } from "../assets/pets-svgrepo-com.svg";
import { useEffect, useState } from "react";

const Navbar = styled.div`
position : fixed ;
padding-block: 10px;
z-index: 99;
top: 0;
right: 0;
left: 0;"
`;
const MdLogoutStyled = styled(MdLogout)`
  color: white;
  font-size: 25px;
  font-weight: bold;
  &:hover {
    color: gray;
  }
`;

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
`;
const LinkStyled = styled(Link)`
  color: white;
  font-size: 20px;
  font-weight: bold;
  &:hover {
    color: gray;
  }
`;

const ButtonStyled = styled(Button)`
  border: 2px solid white;
  background: none;
  transition: 0.4s all;
  &:hover {
    border: 2px solid white;
    background: white;
    color: black;
  }
`;

const RightNavSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Header = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      <Navbar className="navbar navbar-dark bg-dark box-shadow">
        <div className="container d-flex justify-content-between">
          <Link to="/home" className="navbar-brand d-flex align-items-center">
            <IconPet
              style={{
                width: "40px",
                height: "40px",
                fill: "white",
              }}
            />
            {/* <strong>Pet</strong> */}
          </Link>
          <RightNavSection>
            <LinkStyled to="/home">Home</LinkStyled>
            <LinkStyled to="/profile">Profile</LinkStyled>
            {windowWidth <= 600 ? (
              <MdLogoutStyled onClick={handleSign} />
            ) : (
              <ButtonStyled onClick={handleSign}>Logout</ButtonStyled>
            )}
          </RightNavSection>
        </div>
      </Navbar>
    </header>
  );
};

export const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <div className="flex-grow-1" style={{ marginTop: "4.5rem" }}>
        <Outlet />
      </div>
    </LayoutContainer>
  );
};
