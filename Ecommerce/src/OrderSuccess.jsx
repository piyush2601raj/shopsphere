import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";

function OrderSuccess() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  // ================= LOAD LATEST ORDER =================

  useEffect(() => {
    try {
      // First preference: latestOrder

      const latestOrder = JSON.parse(
        localStorage.getItem("latestOrder")
      );

      if (latestOrder) {
        setOrder(latestOrder);
        return;
      }

      // Fallback: get last order from orders

      const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

      if (Array.isArray(orders) && orders.length > 0) {
        setOrder(orders[orders.length - 1]);
      }
    } catch (error) {
      console.error(
        "Order Success Loading Error:",
        error
      );

      setOrder(null);
    }
  }, []);

  // ================= FORMAT DATE =================

  const formatDate = (date) => {
    if (!date) {
      return "Not Available";
    }

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  // ================= ORDER NOT FOUND =================

  if (!order) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center py-5"
        style={{
          minHeight: "650px",
        }}
      >
        <div className="text-center">

          <div
            className="mb-3"
            style={{
              fontSize: "80px",
            }}
          >
            📦
          </div>

          <h2 className="fw-bold">
            Order Information Not Found
          </h2>

          <p className="text-muted">
            We could not find your latest order.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg mt-3"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>

        </div>
      </div>
    );
  }

  // ================= ORDER VALUES =================

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const address = order.address || {};

  const totalAmount =
    Number(order.totalAmount) || 0;

  const subtotal =
    Number(order.subtotal) || 0;

  const discount =
    Number(order.discount) || 0;

  const deliveryCharge =
    Number(order.deliveryCharge) || 0;

  // ================= RETURN =================

  return (
    <div
      className="bg-light py-5"
      style={{
        minHeight: "750px",
      }}
    >
      <div className="container">

        {/* ================= SUCCESS CARD ================= */}

        <div className="row justify-content-center">

          <div className="col-xl-9 col-lg-10">

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

              {/* ================= SUCCESS HEADER ================= */}

              <div className="card-body text-center p-5">

                <div
                  className="d-flex justify-content-center align-items-center mx-auto mb-4 bg-success bg-opacity-10 rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    fontSize: "50px",
                  }}
                >
                  ✅
                </div>

                <h1 className="fw-bold text-success">
                  Order Placed Successfully!
                </h1>

                <p className="text-muted fs-5 mt-3 mb-2">
                  Thank you for shopping with ShopSphere.
                </p>

                <p className="text-muted">
                  Your order has been confirmed and will
                  be delivered soon.
                </p>

                {/* ORDER ID */}

                <div className="d-inline-block bg-light border rounded-3 px-4 py-3 mt-3">

                  <small className="text-muted d-block">
                    Order ID
                  </small>

                  <span className="fw-bold">
                    #{order.id}
                  </span>

                </div>

              </div>

              {/* ================= ORDER DETAILS ================= */}

              <div className="border-top">

                <div className="card-body p-4 p-lg-5">

                  <div className="row g-4">

                    {/* ORDER INFORMATION */}

                    <div className="col-md-6">

                      <div className="border rounded-4 p-4 h-100">

                        <h5 className="fw-bold mb-4">
                          📦 Order Information
                        </h5>

                        <div className="mb-3">

                          <small className="text-muted">
                            Order Date
                          </small>

                          <div className="fw-semibold">
                            {formatDate(order.orderDate)}
                          </div>

                        </div>

                        <div className="mb-3">

                          <small className="text-muted">
                            Payment Method
                          </small>

                          <div className="fw-semibold">
                            {order.paymentMethod === "COD"
                              ? "Cash On Delivery"
                              : "Online Payment"}
                          </div>

                        </div>

                        <div>

                          <small className="text-muted">
                            Order Status
                          </small>

                          <div className="mt-1">

                            <span className="badge bg-success">
                              {order.status || "CONFIRMED"}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* DELIVERY ADDRESS */}

                    <div className="col-md-6">

                      <div className="border rounded-4 p-4 h-100">

                        <h5 className="fw-bold mb-4">
                          🚚 Delivery Address
                        </h5>

                        <p className="fw-bold mb-2">
                          {address.name ||
                            "Customer"}
                        </p>

                        <p className="text-muted mb-2">
                          {address.address ||
                            "Address Not Available"}
                        </p>

                        <p className="text-muted mb-2">
                          {address.city}

                          {address.city &&
                            address.pincode &&
                            " - "}

                          {address.pincode}
                        </p>

                        {address.phone && (
                          <p className="text-muted mb-0">
                            Phone: {address.phone}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* ================= ORDER ITEMS ================= */}

                  <div className="mt-5">

                    <h4 className="fw-bold mb-4">
                      Order Summary
                    </h4>

                    <div className="border rounded-4 overflow-hidden">

                      {items.map((item, index) => {
                        const price =
                          Number(item.price) || 0;

                        const quantity =
                          Number(item.quantity) || 1;

                        const itemTotal =
                          price * quantity;

                        return (
                          <div
                            key={`${item.id}-${index}`}
                            className={`p-3 ${
                              index !== items.length - 1
                                ? "border-bottom"
                                : ""
                            }`}
                          >

                            <div className="d-flex align-items-center gap-3">

                              {/* ================= IMAGE ================= */}

                              <div
                                className="border rounded-3 p-2 d-flex justify-content-center align-items-center bg-white"
                                style={{
                                  width: "90px",
                                  height: "90px",
                                  flexShrink: 0,
                                }}
                              >
                                <ProductImage
                                  product={item}
                                  height="75px"
                                />
                              </div>

                              {/* ================= PRODUCT INFO ================= */}

                              <div className="flex-grow-1">

                                <h6 className="fw-bold mb-1">
                                  {item.name}
                                </h6>

                                <small className="text-muted">
                                  Quantity: {quantity}
                                </small>

                              </div>

                              {/* ================= ITEM TOTAL ================= */}

                              <div className="text-end">

                                <small className="text-muted">
                                  Item Total
                                </small>

                                <h6 className="fw-bold mb-0">
                                  ₹
                                  {itemTotal.toLocaleString(
                                    "en-IN"
                                  )}
                                </h6>

                              </div>

                            </div>

                          </div>
                        );
                      })}

                    </div>

                  </div>

                  {/* ================= PRICE DETAILS ================= */}

                  <div className="row justify-content-end mt-4">

                    <div className="col-lg-5 col-md-7">

                      <div className="border rounded-4 p-4">

                        <h5 className="fw-bold mb-4">
                          Payment Summary
                        </h5>

                        <div className="d-flex justify-content-between mb-3">

                          <span className="text-muted">
                            Subtotal
                          </span>

                          <span>
                            ₹
                            {subtotal.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                        <div className="d-flex justify-content-between mb-3">

                          <span className="text-muted">
                            Discount
                          </span>

                          <span className="text-success">
                            − ₹
                            {discount.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                        <div className="d-flex justify-content-between mb-3">

                          <span className="text-muted">
                            Delivery Charges
                          </span>

                          <span
                            className={
                              deliveryCharge === 0
                                ? "text-success"
                                : ""
                            }
                          >
                            {deliveryCharge === 0
                              ? "FREE"
                              : `₹${deliveryCharge.toLocaleString(
                                  "en-IN"
                                )}`}
                          </span>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-between">

                          <h5 className="fw-bold mb-0">
                            Total Amount
                          </h5>

                          <h5 className="fw-bold text-success mb-0">
                            ₹
                            {totalAmount.toLocaleString(
                              "en-IN"
                            )}
                          </h5>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* ================= ACTION BUTTONS ================= */}

                  <div className="d-flex justify-content-center flex-wrap gap-3 mt-5">

                    <Link
                      to="/orders"
                      className="btn btn-outline-primary btn-lg px-4"
                    >
                      View My Orders
                    </Link>

                    <Link
                      to="/products"
                      className="btn btn-primary btn-lg px-4"
                    >
                      Continue Shopping
                    </Link>

                  </div>

                  {/* ================= MESSAGE ================= */}

                  <div className="alert alert-info text-center mt-4 mb-0">

                    📧 Order confirmation details will be
                    available in your order history.

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;