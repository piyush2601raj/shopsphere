import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";

function Checkout() {
  const navigate = useNavigate();

  // ================= STATES =================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [cart, setCart] = useState([]);
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  // ================= LOAD DATA =================

  useEffect(() => {
    try {
      const items =
        JSON.parse(localStorage.getItem("cart")) || [];

      if (Array.isArray(items)) {
        const validItems = items.filter(
          (item) =>
            item &&
            item.id !== undefined &&
            item.name
        );

        setCart(validItems);
      } else {
        setCart([]);
      }

      const savedAddress = JSON.parse(
        localStorage.getItem("shippingAddress")
      );

      if (savedAddress) {
        setFormData({
          name: savedAddress.name || "",
          phone: savedAddress.phone || "",
          address: savedAddress.address || "",
          city: savedAddress.city || "",
          pincode: savedAddress.pincode || "",
        });
      }
    } catch (error) {
      console.error(
        "Checkout Data Loading Error:",
        error
      );

      setCart([]);
    }
  }, []);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (name === "pincode") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    setFormData((previous) => ({
      ...previous,
      [name]: updatedValue,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ================= PRICE CALCULATIONS =================

  const priceDetails = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => {
        const price = Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 1;

        return sum + price * quantity;
      },
      0
    );

    /*
      Same temporary calculation as Cart.jsx.

      Later backend integration ke time
      pricing/order API se calculation karenge.
    */

    const discount =
      subtotal >= 5000
        ? Math.round(subtotal * 0.05)
        : 0;

    const deliveryCharge =
      subtotal === 0 || subtotal >= 499
        ? 0
        : 49;

    const totalAmount =
      subtotal - discount + deliveryCharge;

    const totalItems = cart.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 1),
      0
    );

    return {
      subtotal,
      discount,
      deliveryCharge,
      totalAmount,
      totalItems,
    };
  }, [cart]);

  // ================= VALIDATION =================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Please enter a valid full name";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10-digit mobile number";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Delivery address is required";
    } else if (
      formData.address.trim().length < 10
    ) {
      newErrors.address =
        "Please enter a complete address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required";
    } else if (
      !/^[1-9][0-9]{5}$/.test(formData.pincode)
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= PAYMENT =================

  const proceedToPayment = () => {
    if (cart.length === 0) {
      alert(
        "Your cart is empty. Please add products first."
      );

      navigate("/products");

      return;
    }

    if (!validateForm()) {
      return;
    }

    const shippingAddress = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
    };

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(shippingAddress)
    );

    /*
      Payment page ko same final amount mil sake.
    */

    localStorage.setItem(
      "checkoutSummary",
      JSON.stringify({
        subtotal: priceDetails.subtotal,
        discount: priceDetails.discount,
        deliveryCharge:
          priceDetails.deliveryCharge,
        totalAmount: priceDetails.totalAmount,
        totalItems: priceDetails.totalItems,
      })
    );

    navigate("/payment");
  };

  // ================= CLEAR ADDRESS =================

  const clearAddress = () => {
    localStorage.removeItem("shippingAddress");

    setFormData({
      name: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });

    setErrors({});
  };

  // ================= IMAGE ERROR =================

  const handleImageError = (id) => {
    setImageErrors((previous) => ({
      ...previous,
      [id]: true,
    }));
  };

  // ================= EMPTY CART =================

  if (cart.length === 0) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "650px" }}
      >
        <div className="text-center">

          <div
            className="mb-4"
            style={{ fontSize: "80px" }}
          >
            🛒
          </div>

          <h2 className="fw-bold">
            Your Cart Is Empty
          </h2>

          <p className="text-muted mb-4">
            Add some products before proceeding to
            checkout.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg px-5"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>

        </div>
      </div>
    );
  }

  // ================= RETURN =================

  return (
    <div
      className="bg-light py-5"
      style={{ minHeight: "700px" }}
    >
      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="mb-4">
          <h1 className="fw-bold mb-2">
            Secure Checkout
          </h1>

          <p className="text-muted mb-0">
            Complete your delivery details and review
            your order.
          </p>
        </div>

        {/* ================= CHECKOUT STEPS ================= */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body py-3">

            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">

              <span className="badge bg-primary fs-6 px-3 py-2">
                1. Cart
              </span>

              <span className="text-muted">
                →
              </span>

              <span className="badge bg-primary fs-6 px-3 py-2">
                2. Checkout
              </span>

              <span className="text-muted">
                →
              </span>

              <span className="badge bg-secondary fs-6 px-3 py-2">
                3. Payment
              </span>

              <span className="text-muted">
                →
              </span>

              <span className="badge bg-secondary fs-6 px-3 py-2">
                4. Order Complete
              </span>

            </div>

          </div>
        </div>

        <div className="row g-4">

          {/* ================= LEFT SECTION ================= */}

          <div className="col-lg-8">

            {/* ================= ADDRESS ================= */}

            <div className="card border-0 shadow-sm rounded-4 mb-4">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>
                    <h4 className="fw-bold mb-1">
                      Delivery Address
                    </h4>

                    <p className="text-muted mb-0">
                      Enter the address where you want
                      your order delivered.
                    </p>
                  </div>

                  <span
                    className="badge bg-primary rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "35px",
                      height: "35px",
                    }}
                  >
                    1
                  </span>

                </div>

                <div className="row g-3">

                  {/* NAME */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className={`form-control ${
                        errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    {errors.name && (
                      <div className="invalid-feedback">
                        {errors.name}
                      </div>
                    )}

                  </div>

                  {/* PHONE */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      className={`form-control ${
                        errors.phone
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                    {errors.phone && (
                      <div className="invalid-feedback">
                        {errors.phone}
                      </div>
                    )}

                  </div>

                  {/* ADDRESS */}

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Complete Address
                    </label>

                    <textarea
                      name="address"
                      className={`form-control ${
                        errors.address
                          ? "is-invalid"
                          : ""
                      }`}
                      rows="4"
                      placeholder="House number, street, area, landmark"
                      value={formData.address}
                      onChange={handleChange}
                    />

                    {errors.address && (
                      <div className="invalid-feedback">
                        {errors.address}
                      </div>
                    )}

                  </div>

                  {/* CITY */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      className={`form-control ${
                        errors.city
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleChange}
                    />

                    {errors.city && (
                      <div className="invalid-feedback">
                        {errors.city}
                      </div>
                    )}

                  </div>

                  {/* PINCODE */}

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      className={`form-control ${
                        errors.pincode
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />

                    {errors.pincode && (
                      <div className="invalid-feedback">
                        {errors.pincode}
                      </div>
                    )}

                  </div>

                </div>

                <button
                  type="button"
                  className="btn btn-outline-danger mt-4"
                  onClick={clearAddress}
                >
                  Clear Address
                </button>

              </div>
            </div>

            {/* ================= ORDER SUMMARY ================= */}

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <div>
                    <h4 className="fw-bold mb-1">
                      Order Summary
                    </h4>

                    <p className="text-muted mb-0">
                      {priceDetails.totalItems}{" "}
                      {priceDetails.totalItems === 1
                        ? "item"
                        : "items"}{" "}
                      in this order
                    </p>
                  </div>

                  <span
                    className="badge bg-primary rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "35px",
                      height: "35px",
                    }}
                  >
                    2
                  </span>

                </div>

                {cart.map((item, index) => {
                  const price =
                    Number(item.price) || 0;

                  const quantity =
                    Number(item.quantity) || 1;

                  const itemTotal =
                    price * quantity;

                  return (
                    <div
                      key={item.id}
                      className={`d-flex flex-column flex-sm-row align-items-sm-center gap-3 py-4 ${
                        index !== cart.length - 1
                          ? "border-bottom"
                          : ""
                      }`}
                    >

                      {/* IMAGE */}

                      <div
                        className="border rounded-3 p-2 bg-white d-flex justify-content-center align-items-center"
                        style={{
                          width: "110px",
                          height: "110px",
                          flexShrink: 0,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(
                            `/product/${item.id}`
                          )
                        }
                      >
                        <ProductImage
                          product={item}
                          height="95px"
                        />
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="flex-grow-1">

                        <h6
                          className="fw-bold mb-2"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(
                              `/product/${item.id}`
                            )
                          }
                        >
                          {item.name}
                        </h6>

                        <p className="text-muted small mb-1">
                          Quantity: {quantity}
                        </p>

                        <small className="text-success fw-semibold">
                          Free Delivery
                        </small>

                      </div>

                      {/* PRICE */}

                      <div className="text-sm-end">

                        <small className="text-muted">
                          Item Total
                        </small>

                        <h5 className="fw-bold mb-0">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </h5>

                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* ================= PRICE DETAILS ================= */}

          <div className="col-lg-4">

            <div
              className="card border-0 shadow-sm rounded-4"
              style={{
                position: "sticky",
                top: "100px",
              }}
            >
              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Price Details
                </h4>

                {/* SUBTOTAL */}

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Items Total
                  </span>

                  <span className="fw-semibold">
                    ₹
                    {priceDetails.subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* DISCOUNT */}

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Discount
                  </span>

                  <span className="text-success fw-semibold">
                    − ₹
                    {priceDetails.discount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* DELIVERY */}

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Delivery Charges
                  </span>

                  <span
                    className={
                      priceDetails.deliveryCharge === 0
                        ? "text-success fw-semibold"
                        : "fw-semibold"
                    }
                  >
                    {priceDetails.deliveryCharge === 0
                      ? "FREE"
                      : `₹${priceDetails.deliveryCharge}`}
                  </span>

                </div>

                {/* DELIVERY DATE */}

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Expected Delivery
                  </span>

                  <span className="text-primary fw-semibold">
                    3-7 Business Days
                  </span>

                </div>

                <hr />

                {/* TOTAL */}

                <div className="d-flex justify-content-between align-items-center">

                  <h5 className="fw-bold mb-0">
                    Total Amount
                  </h5>

                  <h4 className="fw-bold mb-0">
                    ₹
                    {priceDetails.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </h4>

                </div>

                {/* SAVINGS */}

                {priceDetails.discount > 0 && (
                  <div className="alert alert-success mt-4 mb-0 py-2">
                    You save ₹
                    {priceDetails.discount.toLocaleString(
                      "en-IN"
                    )}{" "}
                    on this order.
                  </div>
                )}

                {/* PAYMENT BUTTON */}

                <button
                  type="button"
                  className="btn btn-warning btn-lg w-100 mt-4 fw-semibold"
                  onClick={proceedToPayment}
                >
                  Proceed To Payment
                </button>

                <p className="text-center text-success fw-semibold mt-3 mb-0">
                  🔒 100% Secure Checkout
                </p>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;