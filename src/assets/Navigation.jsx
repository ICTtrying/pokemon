// Navigation.jsx
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/list">List</Link>
      <Link to="/detail/1">Detail</Link>
    </nav>
  );
}
