import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">
          Smart Restaurant
        </h1>

        <div className="space-x-6">
          <Link
            to="/"
            className="text-white hover:text-gray-200 font-medium"
          >
            Home
          </Link>
          <Link
            to="/order"
            className="text-white hover:text-gray-200 font-medium"
          >
            Order Food
          </Link>

          <Link
            to="/tables"
            className="text-white hover:text-gray-200 font-medium"
          >
            Tables
          </Link>
          <Link
            to="/events"
            className="text-white hover:text-gray-200 font-medium"
          >
            Events
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
