import { Link } from "react-router-dom";
import "./Navigation.css";
import logo from "../components/logo.png";
import SubLogo from "../components/SubLogo.png";

export default function Navigation() {
  return (
    <>
      <nav className="navigation">
        <img src={logo} alt="Logo" className="logo" />

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/list">List</Link>
          <Link to="/Favorites">Favorites</Link>
        </div>
      </nav>
    </>
  );
}
