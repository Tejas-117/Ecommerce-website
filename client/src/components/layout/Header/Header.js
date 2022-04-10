import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import HamburgerIcon from "@mui/icons-material/Menu";
import "./Header.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { StateContext } from "../../../context/StateProvider";

function Header() {
  const [state, dispatch] = useContext(StateContext);

  function toggleNavbar(e) {
    const headerLinks = document.querySelector(".header_links");
    headerLinks.classList.toggle("show_header_links");
  }

  async function logout() {
    await fetch("/api/v1/users/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch({ type: "set_user", payload: { user: null } });
    toggleNavbar();
  }

  return (
    <nav className="navbar">
      <HamburgerIcon className="hamburger_icon" onClick={toggleNavbar} />

      <Link to="/">
        <img src={Logo} className="header_logo" alt="Logo" />
      </Link>

      <div className="header_links">
        <div>
          <Link to="/" className="header_link" onClick={toggleNavbar}>
            Home
          </Link>

          <Link to="#" className="header_link" onClick={toggleNavbar}>
            About
          </Link>

          <Link to="#" className="header_link" onClick={toggleNavbar}>
            Blog
          </Link>

          {state.user && (
            <Link to="/orders" className="header_link" onClick={toggleNavbar}>
              My Orders
            </Link>
          )}

          {state.user?.isAdmin && (
            <Link
              to="/admin/dashboard"
              className="header_link"
              onClick={toggleNavbar}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div style={{ display: "flex" }}>
          {state.user ? (
            <div className="header_link" onClick={logout}>
              LogOut
            </div>
          ) : (
            <div>
              <Link to="/login" className="header_link" onClick={toggleNavbar}>
                Login
              </Link>
              <Link
                to="/register"
                className="header_link"
                onClick={toggleNavbar}
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link to="/cart">
            <span className="cart" onClick={toggleNavbar}>
              <ShoppingCartIcon />
              <span>{state.cart.length}</span>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;
