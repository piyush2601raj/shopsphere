import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- INPUT CHANGE ----------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  // ---------------- REGISTER ----------------

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (formData.phone.length !== 10) {
      setError("Phone number must contain 10 digits.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Temporary frontend registration.
    // Later this will be replaced by Spring Boot API.

    const registeredUsers =
      JSON.parse(
        localStorage.getItem("registeredUsers")
      ) || [];

    const userAlreadyExists =
      registeredUsers.some(
        (user) =>
          user.email.toLowerCase() ===
          formData.email.toLowerCase()
      );

    if (userAlreadyExists) {
      setLoading(false);
      setError(
        "An account with this email already exists."
      );
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    registeredUsers.push(newUser);

    localStorage.setItem(
      "registeredUsers",
      JSON.stringify(registeredUsers)
    );

    setTimeout(() => {
      setLoading(false);

      alert("Account Created Successfully");

      navigate("/login");
    }, 800);
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center py-5"
      style={{
        minHeight: "85vh",
        background: "#f8f9fa",
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4"
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <div className="card-body p-4 p-md-5">

          {/* HEADER */}

          <div className="text-center mb-4">
            <div
              style={{
                fontSize: "50px",
              }}
            >
              🛍️
            </div>

            <h2 className="fw-bold mt-2">
              Create Account
            </h2>

            <p className="text-muted">
              Join ShopSphere and start shopping
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* REGISTER FORM */}

          <form onSubmit={handleRegister}>

            {/* FULL NAME */}

            <div className="mb-3">
              <label className="form-label fw-bold">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control form-control-lg"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* EMAIL */}

            <div className="mb-3">
              <label className="form-label fw-bold">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* PHONE */}

            <div className="mb-3">
              <label className="form-label fw-bold">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                className="form-control form-control-lg"
                placeholder="Enter 10 digit phone number"
                value={formData.phone}
                maxLength="10"
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setFormData((previousData) => ({
                    ...previousData,
                    phone: value,
                  }));

                  setError("");
                }}
              />
            </div>

            {/* PASSWORD */}

            <div className="mb-3">
              <label className="form-label fw-bold">
                Password
              </label>

              <div className="input-group">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="mb-4">
              <label className="form-label fw-bold">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                className="form-control form-control-lg"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* TERMS */}

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                required
              />

              <label
                className="form-check-label"
                htmlFor="terms"
              >
                I agree to the Terms & Conditions
              </label>
            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-bold"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* LOGIN */}

          <div className="text-center mt-4">
            <span className="text-muted">
              Already have an account?{" "}
            </span>

            <Link
              to="/login"
              className="text-decoration-none fw-bold"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;