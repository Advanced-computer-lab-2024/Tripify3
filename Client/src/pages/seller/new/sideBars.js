import React, { useState } from "react";

//All the svg files
import logo from "./assets/logo.svg";

import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { createGlobalStyle } from "styled-components";

const PowerOff = ({ color = "#FF0000", size = 24 }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={size}
    height={size}
  >
    <path
      fill={color} // This sets the icon color
      d="M400 54.1c63 45 104 118.6 104 201.9 0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 173.1 48.9 99.3 111.8 54.2c11.7-8.3 28-4.8 35 7.7L162.6 90c5.9 10.5 3.1 23.8-6.6 31-41.5 30.8-68 79.6-68 134.9-.1 92.3 74.5 168.1 168 168.1 91.6 0 168.6-74.2 168-169.1-.3-51.8-24.7-101.8-68.1-134-9.7-7.2-12.4-20.5-6.5-30.9l15.8-28.1c7-12.4 23.2-16.1 34.8-7.8zM296 264V24c0-13.3-10.7-24-24-24h-32c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24z"
    />
  </svg>
);

const Documents = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="24" // Adjust width as needed
    height="24" // Adjust height as needed
  >
    <path
      fill="currentColor" // Adjust color as needed
      d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"
    />
  </svg>
);

const Projects = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    width="24" // Adjust width as needed
    height="24" // Adjust height as needed
  >
    <path
      fill="currentColor" // Change to any color you'd like, or pass it as a prop
      d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
    />
  </svg>
);

const Calender = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="24" // Adjust width as needed
    height="24" // Adjust height as needed
  >
    <path
      fill="currentColor" // Change to any color you'd like, or pass it as a prop
      d="M436 160H12c-6.627 0-12-5.373-12-12v-36c0-26.51 21.49-48 48-48h48V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h128V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h48c26.51 0 48 21.49 48 48v36c0 6.627-5.373 12-12 12zM12 192h424c6.627 0 12 5.373 12 12v260c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V204c0-6.627 5.373-12 12-12zm333.296 95.947l-28.169-28.398c-4.667-4.705-12.265-4.736-16.97-.068L194.12 364.665l-45.98-46.352c-4.667-4.705-12.266-4.736-16.971-.068l-28.397 28.17c-4.705 4.667-4.736 12.265-.068 16.97l82.601 83.269c4.667 4.705 12.265 4.736 16.97.068l142.953-141.805c4.705-4.667 4.736-12.265.068-16.97z"
    />
  </svg>
);

const Team = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 512"
    width="24" // You can adjust width
    height="24" // You can adjust height
  >
    <path
      fill="currentColor" // Change to any color you'd like or pass it as a prop
      d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    width="24" // You can adjust width
    height="24" // You can adjust height
  >
    <path
      fill="currentColor" // Change to any color you'd like or pass it as a prop
      d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"
    ></path>
  </svg>
);

const GlobalStyle = createGlobalStyle`
  :root {
    --orange: hsl(26, 100%, 55%);
    --pale-orange: hsl(25, 100%, 94%);
    --vd-blue: hsl(220, 13%, 13%);
    --d-grayish-blue: rgb(104, 112, 125);
    --grayish-blue: hsl(220, 14%, 75%);
    --l-grayish-blue: hsl(223, 64%, 98%);
    --white: hsl(0, 0%, 100%);
    --black: hsl(0, 0%, 0%);
    --grey: #808080;

    --p-fs: 1rem;
  }
`;

const Container = styled.div`
  position: fixed;

  .active {
    border-right: 4px solid var(--white);

    img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
        brightness(103%) contrast(103%);
    }
  }
`;

const Button = styled.button`
  background-color: var(--black);
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  &::before,
  &::after {
    content: "";
    background-color: var(--white);
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }

  &::before {
    top: ${(props) => (props.clicked ? "1.5" : "1rem")};
    transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }

  &::after {
    top: ${(props) => (props.clicked ? "1.2" : "1.5rem")};
    transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

const SidebarContainer = styled.div`
  background-color: var(--black);
  width: 3.5rem;
  height: 80vh;
  margin-top: 1rem;
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  position: relative;
`;

const Logo = styled.div`
  width: 2rem;

  img {
    width: 100%;
    height: auto;
  }
`;

const SlickBar = styled.ul`
  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--black);

  padding: 2rem 0;

  position: absolute;
  top: 6rem;
  left: 0;

  width: ${(props) => (props.clicked ? "12rem" : "3.5rem")};
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;
`;

const Item = styled(NavLink)`
  text-decoration: none;
  color: var(--white);
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;

  display: flex;
  padding-left: 1rem;

  &:hover {
    border-right: 4px solid var(--white);

    img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
        brightness(103%) contrast(103%);
    }
  }

  img {
    width: 1.2rem;
    height: auto;
    filter: invert(92%) sepia(4%) saturate(1033%) hue-rotate(169deg)
      brightness(78%) contrast(85%);
  }
`;

const Text = styled.span`
  width: ${(props) => (props.clicked ? "100%" : "0")};
  overflow: hidden;
  margin-left: ${(props) => (props.clicked ? "1.5rem" : "0")};
  transition: all 0.3s ease;
`;

const Profile = styled.div`
  width: ${(props) => (props.clicked ? "15rem" : "3rem")};
  height: 3.5rem;

  padding: 0.5rem 1rem;
  /* border: 2px solid var(--white); */
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => (props.clicked ? "11rem" : "0")};

  background-color: var(--black);
  color: var(--white);

  transition: all 0.3s ease;

  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      border: 2px solid var(--grey);
      padding: 2px;
    }
  }
`;

const Details = styled.div`
  display: ${(props) => (props.clicked ? "flex" : "none")};
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.div`
  padding: 0 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h4 {
    display: inline-block;
  }

  a {
    font-size: 0.8rem;
    text-decoration: none;
    color: var(--grey);

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Logout = styled.button`
  border: none;
  width: 2.5rem; /* Adjust size as needed */
  height: 2.5rem;
  background-color: transparent; /* Remove background */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1); /* Apply hover effect only to the button */
  }

  img {
    width: 1.5rem; /* Set icon size */
    height: 1.5rem;
    filter: invert(31%) sepia(90%) saturate(7498%) hue-rotate(357deg)
      brightness(100%) contrast(100%);
    /* Adjusted filter to make the icon red */
    transform: translateY(-7px); /* Move the icon up by 5px */
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
`;
//change the brightness of the icon to 100% to make it red 0% to make it black
const Sidebar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const [profileClick, setprofileClick] = useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Button clicked={click} onClick={() => handleClick()}></Button>
        <SidebarContainer>
          <Logo>
            <img src={logo} alt="logo" />
          </Logo>
          <SlickBar clicked={click}>
            <Item
              onClick={() => setClick(false)}
              exact
              activeClassName="active"
              to="/"
            >
              <HomeIcon />
              <Text clicked={click}>Home</Text>
            </Item>
            <Item
              onClick={() => setClick(false)}
              activeClassName="active"
              to="/team"
            >
              <Team />
              <Text clicked={click}>Team</Text>
            </Item>
            <Item
              onClick={() => setClick(false)}
              activeClassName="active"
              to="/calender"
            >
              <Calender />
              <Text clicked={click}>Calender</Text>
            </Item>
            <Item
              onClick={() => setClick(false)}
              activeClassName="active"
              to="/documents"
            >
              <Documents />
              <Text clicked={click}>Documents</Text>
            </Item>
            <Item
              onClick={() => setClick(false)}
              activeClassName="active"
              to="/projects"
            >
              <Projects />
              <Text clicked={click}>Projects</Text>
            </Item>
          </SlickBar>

          <Profile clicked={profileClick}>
            <img
              onClick={() => handleProfileClick()}
              src="https://picsum.photos/200"
              alt="Profile"
            />
            <Details clicked={profileClick}>
              <Name>
                <h4>Jhon&nbsp;Doe</h4>
                <a href="/#">view&nbsp;profile</a>
              </Name>

              <Logout>
                <PowerOff />
              </Logout>
            </Details>
          </Profile>
        </SidebarContainer>
      </Container>
    </>
  );
};

export default Sidebar;
