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
        </div>
      </nav>

      <nav className="SubNavigation">
        <img src={SubLogo} alt="SubLogo" className="SubLogo" />
      </nav>
    </>
  );
}
