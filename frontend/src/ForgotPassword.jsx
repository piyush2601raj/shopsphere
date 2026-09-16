import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ======================================================
  // RESET PASSWORD
  // ======================================================

  const handleResetPassword = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail =
      email.trim().toLowerCase();

    // ====================================================
    // VALIDATION
    // ====================================================

    if (!normalizedEmail) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    if (!normalizedEmail.includes("@")) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (!newPassword.trim()) {
      setError(
        "Please enter your new password."
      );

      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (!confirmPassword.trim()) {
      setError(
        "Please confirm your new password."
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );

      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // GET REGISTERED USERS
      // ==================================================

      const savedUsers =
        JSON.parse(
          localStorage.getItem(
            "registeredUsers"
          )
        );

      const registeredUsers =
        Array.isArray(savedUsers)
          ? savedUsers
          : [];

      // ==================================================
      // FIND USER
      // ==================================================

      const userIndex =
        registeredUsers.findIndex(
          (user) =>
            user.email
              ?.trim()
              .toLowerCase() ===
            normalizedEmail
        );

      // ==================================================
      // USER NOT FOUND
      // ==================================================

      if (userIndex === -1) {
        setError(
          "No account found with this email address."
        );

        setLoading(false);

        return;
      }

      // ==================================================
      // SAME OLD PASSWORD CHECK
      // ==================================================

      if (
        registeredUsers[userIndex]
          .password === newPassword
      ) {
        setError(
          "New password cannot be the same as your old password."
        );

        setLoading(false);

        return;
      }

      // ==================================================
      // UPDATE PASSWORD
      // ==================================================

      const updatedUsers = [
        ...registeredUsers,
      ];

      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],

        password: newPassword,
      };

      // ==================================================
      // SAVE UPDATED USERS
      // ==================================================

      localStorage.setItem(
        "registeredUsers",

        JSON.stringify(updatedUsers)
      );

      // ==================================================
      // REMOVE OLD LOGIN
      // ==================================================

      localStorage.removeItem(
        "loggedInUser"
      );

      localStorage.removeItem(
        "isLoggedIn"
      );

      window.dispatchEvent(
        new Event("authChanged")
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      setSuccess(
        "Password reset successfully. Redirecting to Login..."
      );

      setLoading(false);

      // ==================================================
      // REDIRECT TO LOGIN
      // ==================================================

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);

    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div
      className="
        container-fluid
        d-flex
        justify-content-center
        align-items-center
      "
      style={{
        minHeight: "80vh",
        background: "#f8f9fa",
      }}
    >
      <div
        className="
          card
          border-0
          shadow-lg
          rounded-4
        "
        style={{
          width: "100%",
          maxWidth: "470px",
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
              🔐
            </div>

            <h2 className="fw-bold mt-2">
              Forgot Password
            </h2>

            <p className="text-muted">
              Enter your registered email and
              create a new password
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div
              className="alert alert-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div
              className="alert alert-success"
              role="alert"
            >
              {success}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={
              handleResetPassword
            }
          >

            {/* EMAIL */}

            <div className="mb-3">

              <label className="form-label fw-bold">
                Registered Email
              </label>

              <input
                type="email"
                className="
                  form-control
                  form-control-lg
                "
                placeholder="Enter registered email"
                value={email}
                autoComplete="email"
                onChange={(event) => {
                  setEmail(
                    event.target.value
                  );

                  setError("");
                }}
              />

            </div>

            {/* NEW PASSWORD */}

            <div className="mb-3">

              <label className="form-label fw-bold">
                New Password
              </label>

              <div className="input-group">

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  className="
                    form-control
                    form-control-lg
                  "
                  placeholder="Enter new password"
                  value={newPassword}
                  autoComplete="new-password"
                  onChange={(event) => {
                    setNewPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                />

                <button
                  type="button"
                  className="
                    btn
                    btn-outline-secondary
                  "
                  onClick={() =>
                    setShowNewPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showNewPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="mb-4">

              <label className="form-label fw-bold">
                Confirm New Password
              </label>

              <div className="input-group">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="
                    form-control
                    form-control-lg
                  "
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(event) => {
                    setConfirmPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                />

                <button
                  type="button"
                  className="
                    btn
                    btn-outline-secondary
                  "
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* RESET BUTTON */}

            <button
              type="submit"
              className="
                btn
                btn-primary
                btn-lg
                w-100
                fw-bold
              "
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="
                      spinner-border
                      spinner-border-sm
                      me-2
                    "
                    role="status"
                  />

                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

          </form>

          {/* BACK TO LOGIN */}

          <div className="text-center mt-4">

            <span className="text-muted">
              Remember your password?{" "}
            </span>

            <Link
              to="/login"
              className="
                text-decoration-none
                fw-bold
              "
            >
              Back To Login
            </Link>

          </div>

          <hr className="my-4" />

          <div className="text-center">

            <small className="text-muted">
              🔒 Secure Password Recovery
            </small>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;