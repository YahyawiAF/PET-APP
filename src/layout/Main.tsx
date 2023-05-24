import { Button } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import styled from "styled-components";
import { useAuth } from "../context/AuthProvider";

const LayoutContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <strong>Album</strong>
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