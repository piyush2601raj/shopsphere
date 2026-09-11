import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

// Pages
import Home from "./Home";
import Products from "./Products";
import Cart from "./Cart";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>

      {/* Navbar (har page pe dikhega) */}
      <Navbar />

      {/* Pages */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;