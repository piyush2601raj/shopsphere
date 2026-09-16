import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./Navbar";
import Footer from "./Footer";

// Pages
import Home from "./Home";
import Products from "./Products";
import Cart from "./Cart";
import Login from "./Login";
import ProductDetails from "./ProductDetails";
import Users from "./Users";
import CategoryPage from "./CategoryPage";
import Wishlist from "./Wishlist";
import SubCategoryPage from "./SubCategoryPage";
import Checkout from "./Checkout";
import Payment from "./Payment";
import OrderSuccess from "./OrderSuccess";
import Orders from "./Orders";
import TrackOrder from "./TrackOrder";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "./ForgotPassword";
import AIChatbot from "./AIChatbot";

function AppContent() {
  const location = useLocation();

  // Authentication pages are standalone pages.
  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
  ].includes(location.pathname);

  return (
    <>
      {/* Navbar only on the main shopping/application pages */}
      {!isAuthPage && <Navbar />}

      <main>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/category/:name"
            element={<CategoryPage />}
          />

          <Route
            path="/subcategory/:name"
            element={<SubCategoryPage />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          {/* ================= AUTH ROUTES ================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/users"
            element={<Users />}
          />

          {/* ================= PROTECTED ROUTES ================= */}

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/track/:id"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          {/* ================= PAGE NOT FOUND ================= */}

          <Route
            path="*"
            element={
              <div
                className="container text-center py-5"
                style={{ minHeight: "500px" }}
              >
                <h2 className="fw-bold">
                  Page Not Found
                </h2>

                <p className="text-muted">
                  The page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Routes>

        {/* Chatbot only inside the shopping application */}
        {!isAuthPage && <AIChatbot />}
      </main>

      {/* Footer only on the shopping/application pages */}
      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
