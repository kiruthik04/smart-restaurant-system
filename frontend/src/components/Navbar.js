import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
      <Link to="/tables" style={{ marginRight: "15px" }}>Tables</Link>
      <Link to="/events">Events</Link>
    </nav>
  );
}

export default Navbar;
