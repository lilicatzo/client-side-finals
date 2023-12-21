import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import logo from './Logo.png'; 
import './custom-navbar.css'; 
import { useUser } from './context/UserContext'; 
import { getAuth, signOut } from 'firebase/auth';

const NavigationBar = () => {
    const { currentUser } = useUser();
    const auth = getAuth();
  
    const handleLogout = () => {
      signOut(auth).then(() => {
        // Handle successful sign out
      }).catch((error) => {
        console.error('Logout error:', error);
      });
    };
  
    return (
      <header>
        <Navbar expand="lg" className="green-navbar" variant="dark" fixed="top">
          <Container>
            <Navbar.Brand>
              <Image src={logo} alt="Logo" height="50px" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav" className="justify-content-end">
              <Nav>
                {currentUser && (
                  <Nav.Item className="align-items-center d-flex">
                    <span className="navbar-text mx-2">{currentUser.email}</span>
                  </Nav.Item>
                )}
                <Nav.Item>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    );
};

export default NavigationBar;