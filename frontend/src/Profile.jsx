import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [activeModal, setActiveModal] = useState(null);

  const [profile, setProfile] = useState({
    name: user.name || user.username || "Test User",
    email: user.email || "testuser@gmail.com",
    phone: user.phone || "Not added",
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: profile.name,
      address: "Add your delivery address",
      phone: profile.phone,
      default: true,
    },
  ]);

  const [payments] = useState([
    {
      id: 1,
      type: "UPI",
      details: "Add your preferred payment method",
      default: true,
    },
  ]);

  const [editForm, setEditForm] = useState(profile);

  const name = profile.name;
  const email = profile.email;
  const initial = name.charAt(0).toUpperCase();

  // =========================
  // EDIT PROFILE
  // =========================
  const handleProfileSave = () => {
    const updatedUser = {
      ...user,
      name: editForm.name,
      username: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setProfile(editForm);
    setActiveModal(null);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="profile-page">

      {/* ================= HERO ================= */}

      <div className="profile-container">

        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>Home</span>
          <span>›</span>
          <strong>My Account</strong>
        </div>

        <div className="profile-hero">

          <div className="profile-avatar">
            {initial}
          </div>

          <div className="profile-hero-info">
            <h1>{name}</h1>
            <p>{email}</p>

            <div className="account-status">
              <span>●</span>
              Active Account
            </div>
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => {
              setEditForm(profile);
              setActiveModal("edit");
            }}
          >
            ✏️ Edit Profile
          </button>

        </div>

        {/* ================= OVERVIEW ================= */}

        <div className="section-title">
          <div>
            <h2>My Account</h2>
            <p>Manage your profile, shopping and account preferences.</p>
          </div>
        </div>

        <div className="account-grid">

          {/* PERSONAL INFORMATION */}

          <div className="account-card">

            <div className="card-header">
              <div className="card-icon blue">
                👤
              </div>

              <div>
                <h3>Personal Information</h3>
                <span>Account details</span>
              </div>
            </div>

            <div className="info-row">
              <label>FULL NAME</label>
              <strong>{name}</strong>
            </div>

            <div className="info-row">
              <label>EMAIL ADDRESS</label>
              <strong>{email}</strong>
            </div>

            <div className="info-row">
              <label>PHONE NUMBER</label>
              <strong>{profile.phone}</strong>
            </div>

            <button
              className="outline-btn"
              onClick={() => {
                setEditForm(profile);
                setActiveModal("edit");
              }}
            >
              Edit Information →
            </button>

          </div>

          {/* SECURITY */}

          <div className="account-card">

            <div className="card-header">
              <div className="card-icon purple">
                🔐
              </div>

              <div>
                <h3>Login & Security</h3>
                <span>Protect your account</span>
              </div>
            </div>

            <div className="security-item">
              <div>
                <strong>Password</strong>
                <small>••••••••••••</small>
              </div>

              <button
                className="small-btn"
                onClick={() => setActiveModal("password")}
              >
                Change
              </button>
            </div>

            <div className="security-item">
              <div>
                <strong>Account Status</strong>
                <small className="verified">
                  ● Verified & Active
                </small>
              </div>

              <span className="secure-badge">
                Secure
              </span>
            </div>

          </div>

        </div>

        {/* ================= SHOPPING ================= */}

        <div className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Shopping Activity</h2>
              <p>Quick access to your shopping information.</p>
            </div>
          </div>

          <div className="shopping-grid">

            <DashboardCard
              icon="📦"
              title="My Orders"
              description="View and track your orders"
              onClick={() => navigate("/orders")}
            />

            <DashboardCard
              icon="❤️"
              title="Wishlist"
              description="Products you've saved"
              onClick={() => navigate("/wishlist")}
            />

            <DashboardCard
              icon="🛒"
              title="My Cart"
              description="Review your shopping cart"
              onClick={() => navigate("/cart")}
            />

            <DashboardCard
              icon="🔍"
              title="Browse Products"
              description="Discover new products"
              onClick={() => navigate("/products")}
            />

          </div>

        </div>

        {/* ================= ADDRESSES ================= */}

        <div className="dashboard-section">

          <div className="section-title section-flex">

            <div>
              <h2>Saved Addresses</h2>
              <p>Manage your delivery addresses.</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setActiveModal("address")}
            >
              + Add Address
            </button>

          </div>

          <div className="address-grid">

            {addresses.map((address) => (
              <div className="address-card" key={address.id}>

                <div className="address-top">

                  <div className="address-title">
                    <span>🏠</span>
                    <strong>{address.type}</strong>

                    {address.default && (
                      <span className="default-badge">
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <button
                    className="more-btn"
                    onClick={() => setActiveModal("address")}
                  >
                    ⋮
                  </button>

                </div>

                <h4>{address.name}</h4>

                <p>
                  {address.address}
                </p>

                <small>
                  📞 {address.phone}
                </small>

              </div>
            ))}

          </div>

        </div>

        {/* ================= PAYMENT ================= */}

        <div className="dashboard-section">

          <div className="section-title section-flex">

            <div>
              <h2>Payment Methods</h2>
              <p>Manage your preferred payment options.</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setActiveModal("payment")}
            >
              + Add Payment
            </button>

          </div>

          <div className="payment-card">

            <div className="payment-icon">
              💳
            </div>

            <div className="payment-info">
              <strong>{payments[0].type}</strong>

              <span>
                {payments[0].details}
              </span>
            </div>

            <span className="default-badge">
              DEFAULT
            </span>

          </div>

          <div className="payment-note">
            🔒 Your payment information is securely handled.
            ShopSphere does not display full card details.
          </div>

        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="dashboard-section">

          <div className="section-title">
            <div>
              <h2>Account Actions</h2>
              <p>Manage your ShopSphere account.</p>
            </div>
          </div>

          <div className="quick-actions">

            <button
              onClick={() => navigate("/")}
            >
              🏠
              <span>
                <strong>Continue Shopping</strong>
                <small>Return to ShopSphere</small>
              </span>
            </button>

            <button
              onClick={() => setActiveModal("password")}
            >
              🔐
              <span>
                <strong>Change Password</strong>
                <small>Update your account password</small>
              </span>
            </button>

            <button
              className="logout-action"
              onClick={handleLogout}
            >
              🚪
              <span>
                <strong>Logout</strong>
                <small>Sign out of your account</small>
              </span>
            </button>

          </div>

        </div>

        <div className="profile-footer">
          🔒 ShopSphere keeps your account information secure.
        </div>

      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}

      {activeModal === "edit" && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>Edit Profile</h2>
                <p>Update your personal information.</p>
              </div>

              <button onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Full Name</label>

              <input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={handleProfileSave}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= PASSWORD MODAL ================= */}

      {activeModal === "password" && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>Change Password</h2>
                <p>Keep your account protected.</p>
              </div>

              <button onClick={() => setActiveModal(null)}>
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
              />
            </div>

            <div className="security-warning">
              🔒 Password changes will be securely processed through
              your account backend.
            </div>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={() => setActiveModal(null)}
              >
                Update Password
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= ADDRESS MODAL ================= */}

      {activeModal === "address" && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Add Address</h2>
                <p>Add a delivery address to your account.</p>
              </div>

              <button onClick={() => setActiveModal(null)}>
                ×
              </button>

            </div>

            <div className="form-group">
              <label>Address Type</label>

              <select>
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Full Address</label>

              <textarea
                placeholder="House/Flat, Street, Area, City, State, PIN"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                placeholder="Enter phone number"
              />
            </div>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={() => setActiveModal(null)}
              >
                Save Address
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= PAYMENT MODAL ================= */}

      {activeModal === "payment" && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>Add Payment Method</h2>
                <p>Select your preferred payment option.</p>
              </div>

              <button onClick={() => setActiveModal(null)}>
                ×
              </button>

            </div>

            <div className="payment-options">

              <button>💳 Credit / Debit Card</button>
              <button>📱 UPI</button>
              <button>🏦 Net Banking</button>

            </div>

            <div className="security-warning">
              🔒 Payment credentials should be handled by a secure
              payment gateway rather than stored directly in the frontend.
            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* =====================================================
   DASHBOARD CARD
===================================================== */

function DashboardCard({ icon, title, description, onClick }) {
  return (
    <button
      className="dashboard-card"
      onClick={onClick}
    >
      <div className="dashboard-card-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <span className="dashboard-arrow">
        →
      </span>
    </button>
  );
}


/* =====================================================
   STYLES
===================================================== */

const style = document.createElement("style");

style.innerHTML = `

.profile-page {
  min-height: calc(100vh - 70px);
  background: #f5f7fb;
  padding: 35px 20px 60px;
  color: #111827;
}

.profile-container {
  max-width: 1100px;
  margin: auto;
}

.breadcrumb {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6b7280;
}

.breadcrumb span:first-child {
  cursor: pointer;
}

.breadcrumb span:first-child:hover {
  color: #0d6efd;
}

.profile-hero {
  background: linear-gradient(135deg, #0d6efd, #084298);
  border-radius: 18px;
  padding: 32px 38px;
  display: flex;
  align-items: center;
  gap: 22px;
  color: white;
  box-shadow: 0 10px 30px rgba(13,110,253,.18);
}

.profile-avatar {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: white;
  color: #0d6efd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  font-weight: 800;
  flex-shrink: 0;
}

.profile-hero-info {
  flex: 1;
}

.profile-hero-info h1 {
  margin: 0;
  font-size: 29px;
}

.profile-hero-info p {
  margin: 5px 0 12px;
  opacity: .9;
}

.account-status {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  background: rgba(255,255,255,.15);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.edit-profile-btn {
  border: none;
  background: white;
  color: #0d6efd;
  padding: 11px 18px;
  border-radius: 9px;
  font-weight: 700;
  cursor: pointer;
}

.edit-profile-btn:hover {
  background: #f1f5ff;
}

.section-title {
  margin: 35px 0 18px;
}

.section-title h2 {
  margin: 0;
  font-size: 22px;
}

.section-title p {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.section-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.account-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 3px 12px rgba(0,0,0,.03);
}

.card-header {
  display: flex;
  gap: 13px;
  align-items: center;
  margin-bottom: 22px;
}

.card-icon {
  width: 45px;
  height: 45px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
}

.card-icon.blue {
  background: #eef5ff;
}

.card-icon.purple {
  background: #f3e8ff;
}

.card-header h3 {
  margin: 0;
  font-size: 17px;
}

.card-header span {
  font-size: 12px;
  color: #6b7280;
}

.info-row {
  margin-bottom: 17px;
}

.info-row label {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 5px;
  letter-spacing: .4px;
}

.info-row strong {
  font-size: 14px;
}

.outline-btn,
.small-btn {
  border: 1px solid #bfdbfe;
  background: white;
  color: #1d4ed8;
  border-radius: 8px;
  padding: 9px 13px;
  cursor: pointer;
  font-weight: 600;
}

.outline-btn {
  width: 100%;
  margin-top: 4px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #edf0f5;
}

.security-item:last-child {
  border-bottom: none;
}

.security-item strong,
.security-item small {
  display: block;
}

.security-item small {
  margin-top: 5px;
  color: #6b7280;
}

.verified {
  color: #16a34a !important;
}

.secure-badge,
.default-badge {
  background: #ecfdf3;
  color: #15803d;
  padding: 5px 9px;
  border-radius: 15px;
  font-size: 10px;
  font-weight: 700;
}

.dashboard-section {
  margin-top: 35px;
}

.shopping-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.dashboard-card {
  position: relative;
  text-align: left;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: .2s;
}

.dashboard-card:hover {
  transform: translateY(-3px);
  border-color: #bfdbfe;
  box-shadow: 0 8px 20px rgba(0,0,0,.07);
}

.dashboard-card-icon {
  font-size: 25px;
  margin-bottom: 15px;
}

.dashboard-card h3 {
  margin: 0;
  font-size: 16px;
  color: #111827;
}

.dashboard-card p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.dashboard-arrow {
  position: absolute;
  right: 18px;
  bottom: 18px;
  color: #0d6efd;
}

.primary-btn {
  border: none;
  background: #0d6efd;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn:hover {
  background: #0b5ed7;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.address-card,
.payment-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
}

.address-top {
  display: flex;
  justify-content: space-between;
}

.address-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.more-btn {
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
}

.address-card h4 {
  margin: 20px 0 7px;
}

.address-card p {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.address-card small {
  color: #374151;
}

.payment-card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.payment-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #eef5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.payment-info {
  flex: 1;
}

.payment-info strong,
.payment-info span {
  display: block;
}

.payment-info span {
  color: #6b7280;
  font-size: 13px;
  margin-top: 4px;
}

.payment-note,
.security-warning {
  margin-top: 12px;
  padding: 12px 15px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 9px;
  color: #64748b;
  font-size: 12px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.quick-actions button {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 13px;
  padding: 17px;
  cursor: pointer;
}

.quick-actions button:hover {
  border-color: #bfdbfe;
  box-shadow: 0 5px 15px rgba(0,0,0,.05);
}

.quick-actions button > span strong,
.quick-actions button > span small {
  display: block;
}

.quick-actions button > span small {
  margin-top: 4px;
  color: #6b7280;
}

.logout-action {
  color: #dc2626;
}

.profile-footer {
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  margin-top: 30px;
}

/* MODAL */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
}

.modal {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 20px 50px rgba(0,0,0,.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0;
}

.modal-header p {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.modal-header button {
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 21px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 7px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13,110,253,.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.cancel-btn {
  border: 1px solid #d1d5db;
  background: white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.payment-options {
  display: grid;
  gap: 10px;
}

.payment-options button {
  text-align: left;
  padding: 15px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  cursor: pointer;
  font-weight: 600;
}

.payment-options button:hover {
  border-color: #0d6efd;
  background: #f8fbff;
}

/* RESPONSIVE */

@media (max-width: 800px) {

  .profile-hero {
    flex-wrap: wrap;
  }

  .edit-profile-btn {
    width: 100%;
  }

  .account-grid,
  .address-grid {
    grid-template-columns: 1fr;
  }

  .shopping-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {

  .profile-page {
    padding: 20px 12px 40px;
  }

  .profile-hero {
    padding: 25px 20px;
  }

  .profile-avatar {
    width: 65px;
    height: 65px;
    font-size: 27px;
  }

  .profile-hero-info h1 {
    font-size: 23px;
  }

  .shopping-grid {
    grid-template-columns: 1fr;
  }

  .section-flex {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

}

`;

document.head.appendChild(style);

export default Profile;