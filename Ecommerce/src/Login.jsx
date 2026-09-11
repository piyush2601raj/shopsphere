import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "./axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = location.state?.from || "/";

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!normalizedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/users/login", {
        email: normalizedEmail,
        password,
      });

      console.log("LOGIN API RESPONSE:", response.data);

      const loggedInUser = response.data;

      if (!loggedInUser || !loggedInUser.id) {
        throw new Error("Invalid user response from server");
      }

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
      );

      localStorage.setItem("userId", String(loggedInUser.id));
      localStorage.setItem("isLoggedIn", "true");

      if (rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          loggedInUser.email
        );
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      window.dispatchEvent(new Event("authChanged"));
      window.dispatchEvent(new Event("storage"));

      alert(`Welcome ${loggedInUser.name} 👋`);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.error(
        "LOGIN BACKEND RESPONSE:",
        error.response?.data
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        background:
          "linear-gradient(135deg, #f5f8ff 0%, #eef4ff 50%, #f8faff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "45px 20px",
      }}
    >
      <div
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "1050px",
          minHeight: "590px",
          background: "#fff",
          borderRadius: "24px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* LEFT BRAND PANEL */}
        <div
          style={{
            background:
              "linear-gradient(145deg, #0d6efd 0%, #084298 100%)",
            color: "#fff",
            padding: "55px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              top: "-70px",
              right: "-70px",
            }}
          />

          <div
            style={{
              fontSize: "54px",
              marginBottom: "18px",
            }}
          >
            🛍️
          </div>

          <h1
            className="fw-bold"
            style={{
              fontSize: "42px",
              letterSpacing: "-1px",
              marginBottom: "15px",
            }}
          >
            ShopSphere
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.6,
              opacity: 0.92,
              maxWidth: "420px",
            }}
          >
            Your one-stop destination for electronics, fashion,
            books, home essentials and more.
          </p>

          <div className="mt-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <span
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✓
              </span>
              <span>Secure and simple shopping</span>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <span
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🚚
              </span>
              <span>Track your orders easily</span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ❤️
              </span>
              <span>Wishlist your favourite products</span>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN PANEL */}
        <div
          style={{
            padding: "50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "440px", margin: "auto" }}>
            <div className="mb-4">
              <p
                className="text-primary fw-semibold mb-2"
                style={{ letterSpacing: "0.5px" }}
              >
                WELCOME BACK
              </p>

              <h2
                className="fw-bold mb-2"
                style={{ fontSize: "34px", color: "#172033" }}
              >
                Sign in to your account
              </h2>

              <p className="text-muted mb-0">
                Enter your details to continue shopping.
              </p>
            </div>

            {error && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
                style={{
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              >
                <span className="me-2">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* EMAIL */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold"
                  htmlFor="loginEmail"
                >
                  Email Address
                </label>

                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white">
                    ✉️
                  </span>

                  <input
                    id="loginEmail"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    autoComplete="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    style={{ fontSize: "15px" }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold"
                  htmlFor="loginPassword"
                >
                  Password
                </label>

                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white">
                    🔒
                  </span>

                  <input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    style={{ fontSize: "15px" }}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                  />

                  <label
                    className="form-check-label text-muted"
                    htmlFor="rememberMe"
                    style={{ fontSize: "14px" }}
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-primary text-decoration-none fw-semibold"
                  style={{ fontSize: "14px" }}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* LOGIN */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                disabled={loading}
                style={{
                  borderRadius: "12px",
                  minHeight: "52px",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Signing In...
                  </>
                ) : (
                  <>Sign In →</>
                )}
              </button>
            </form>

            {/* REGISTER */}
            <div className="text-center mt-4">
              <span className="text-muted">
                Don't have an account?{" "}
              </span>

              <Link
                to="/register"
                className="text-primary text-decoration-none fw-bold"
              >
                Create Account
              </Link>
            </div>

            <div
              className="d-flex align-items-center justify-content-center gap-2 mt-4 pt-3"
              style={{
                borderTop: "1px solid #e9ecef",
                color: "#6c757d",
                fontSize: "13px",
              }}
            >
              🔒 Secure login • ShopSphere
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE RESPONSIVE FIX */}
      <style>
        {`
          @media (max-width: 768px) {
            .shadow-lg {
              grid-template-columns: 1fr !important;
            }

            .shadow-lg > div:first-child {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
