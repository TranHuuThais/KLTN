import React, { useEffect, useContext, useState } from "react";
import { Container, Navbar, Offcanvas, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaHistory, FaBell } from "react-icons/fa";
import { UserContext } from "../../../context/UserContext";
import "../Header/header.css";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext); 
  const navigate = useNavigate();

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userid"); 
    
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => caches.delete(cacheName));
      });
    }
  
    setIsLoggedIn(false);
  
    navigate("/login", { replace: true });
    window.location.reload(); 
  };
  

  const handleLogin = () => {
    navigate("/login");
    
  };

  const isSticky = () => {
    const header = document.querySelector(".header-section");
    if (header) {
      window.scrollY >= 120
        ? header.classList.add("is-sticky")
        : header.classList.remove("is-sticky");
    }
  };

  // Listen to storage changes to update isLoggedIn
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("scroll", isSticky);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", isSticky);
    };
  }, [setIsLoggedIn]);

  return (
    <header className="header-section">
      <Container>
        <Navbar expand="lg" className="p-0">
          <Navbar.Brand>
            <NavLink to="/">TRAVEL</NavLink>
          </Navbar.Brand>

          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            placement="start"
            show={open}
          >
            <Offcanvas.Header>
              <h1 className="logo">Weekendmonks</h1>
              <span className="navbar-toggler ms-auto" onClick={toggleMenu}>
                <i className="bi bi-x-lg"></i>
              </span>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavLink className="nav-link" to="/">Home</NavLink>
                <NavLink className="nav-link" to="/about-us">ABOUT US</NavLink>
                <NavLink className="nav-link" to="/tours">TOURS</NavLink>
                <NavDropdown title="DESTINATION">
                  <NavLink className="nav-link text-dark" to="/destinations">SPAIN TOURS</NavLink>
                </NavDropdown>
                <NavLink className="nav-link" to="/gallery">GALLERY</NavLink>
                <NavLink className="nav-link" to="/contact-us">CONTACT</NavLink>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <div className="ms-md-4 ms-2">
            <li className="d-inline-block d-lg-none ms-3 toggle_btn">
              <i className={open ? "bi bi-x-lg" : "bi bi-list"} onClick={toggleMenu}></i>
            </li>
          </div>

          <Nav className="align-items-center">
            <li className="nav-item">
              <FaBell
                className="notification-icon"
                onClick={() => navigate("/notifications")}
              />
            </li>
            {isLoggedIn ? (
              <NavDropdown title={<FaUserCircle className="user-icon-header" />}>
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  <FaUserCircle className="user-icon" /> My Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/my-bookings")}>
                  <FaHistory className="user-icon" /> My Bookings
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="user-icon" /> Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <button onClick={handleLogin} className="btn btn-primary">
                Đăng nhập
              </button>
            )}
          </Nav>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
