import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">

      {/* Logo */}
      <Link className="navbar-brand fw-bold" to="/">
        Flipkart Clone
      </Link>

      {/* Search */}
      <form className="d-flex w-50">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search for products..."
        />
        <button className="btn btn-light">Search</button>
      </form>

      {/* Links */}
      <div className="ms-auto d-flex gap-3">
        <Link className="nav-link text-white" to="/">Home</Link>
        <Link className="nav-link text-white" to="/products">Products</Link>
        <Link className="nav-link text-white" to="/cart">Cart 🛒</Link>
        <Link className="nav-link text-white" to="/login">Login</Link>
      </div>

    </nav>
  );
};

export default Navbar;