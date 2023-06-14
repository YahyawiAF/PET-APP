import { Button } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { ReactComponent as SPicon } from "../assets/spain.svg";
import { ReactComponent as UKicon } from "../assets/uk.svg";

import styled from "styled-components";
import { useAuth } from "../context/AuthProvider";
import { ReactComponent as IconPet } from "../assets/pets-svgrepo-com.svg";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Topbar = styled.div`
  padding-block: 10px;
  box-sizing: border-box;
  height: 40px;
`;

const Navbar = styled.div`
  position: sticky !important;
  padding-block: 10px;
  top: O;
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
  @media only screen and (max-width: 600px) {
    font-size: 16px;
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
  @media only screen and (max-width: 600px) {
    gap: 15px;
  }
`;

const Header = () => {
  const { i18n, t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

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
    <header style={{ position: "fixed", width: "100%", zIndex: "99" }}>
      <Topbar className=" bg-dark  d-flex justify-content-end align-items-center ">
        <div className="container d-flex justify-content-end gap-3">
          <SPicon
            className="navbar-brand d-flex align-items-center"
            onClick={() => changeLanguage("es")}
          />
          <UKicon
            className="navbar-brand d-flex align-items-center"
            onClick={() => changeLanguage("en")}
          />
        </div>
      </Topbar>
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
            <LinkStyled to="/home">{t("home")}</LinkStyled>
            <LinkStyled to="/profile">{t("profile")}</LinkStyled>
            <LinkStyled to="/check-in">{t("checkIn")}</LinkStyled>
            {windowWidth <= 600 ? (
              <MdLogoutStyled onClick={handleSign} />
            ) : (
              <ButtonStyled onClick={handleSign}>{t("logout")}</ButtonStyled>
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
      <div className="flex-grow-1" style={{ marginTop: "8rem" }}>
        <Outlet />
      </div>
    </LayoutContainer>
  );
};
