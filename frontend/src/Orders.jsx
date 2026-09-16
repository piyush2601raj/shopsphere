import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";

function Orders() {
  const navigate = useNavigate();

  // ================= STATES =================

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // ================= LOAD ORDERS =================

  useEffect(() => {
    try {
      const savedOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      if (Array.isArray(savedOrders)) {
        setOrders(savedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Orders Loading Error:", error);

      setOrders([]);
    }
  }, []);

  // ================= FORMAT DATE =================

  const formatDate = (date) => {
    if (!date) {
      return "Date Not Available";
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

  // ================= STATUS COLOR =================

  const getStatusClass = (status) => {
    const currentStatus =
      status?.toUpperCase() || "CONFIRMED";

    switch (currentStatus) {
      case "CONFIRMED":
        return "bg-primary";

      case "PROCESSING":
        return "bg-info text-dark";

      case "SHIPPED":
        return "bg-warning text-dark";

      case "OUT FOR DELIVERY":
        return "bg-warning text-dark";

      case "DELIVERED":
        return "bg-success";

      case "CANCELLED":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  // ================= FILTER ORDERS =================

  const filteredOrders = orders
    .filter((order) => {
      if (filter === "ALL") {
        return true;
      }

      return (
        order.status?.toUpperCase() === filter
      );
    })
    .filter((order) => {
      if (!search.trim()) {
        return true;
      }

      const searchValue =
        search.toLowerCase().trim();

      const orderIdMatch = String(order.id)
        .toLowerCase()
        .includes(searchValue);

      const productMatch = Array.isArray(order.items)
        ? order.items.some((item) =>
            item.name
              ?.toLowerCase()
              .includes(searchValue)
          )
        : false;

      return orderIdMatch || productMatch;
    })
    .slice()
    .reverse();

  // ================= EMPTY ORDERS =================

  if (orders.length === 0) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center py-5"
        style={{
          minHeight: "650px",
        }}
      >
        <div className="text-center">

          <div
            className="mb-4"
            style={{
              fontSize: "90px",
            }}
          >
            📦
          </div>

          <h2 className="fw-bold">
            No Orders Yet
          </h2>

          <p className="text-muted mb-4">
            You haven't placed any orders yet.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg px-5"
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>

        </div>
      </div>
    );
  }

  // ================= RETURN =================

  return (
    <div
      className="bg-light py-5"
      style={{
        minHeight: "750px",
      }}
    >
      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

          <div>
            <h1 className="fw-bold mb-1">
              My Orders
            </h1>

            <p className="text-muted mb-0">
              View and track all your ShopSphere orders.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>

        </div>

        {/* ================= FILTER SECTION ================= */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="row g-3">

              {/* SEARCH */}

              <div className="col-lg-7">

                <label className="form-label fw-semibold">
                  Search Orders
                </label>

                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by Order ID or Product Name"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              {/* STATUS FILTER */}

              <div className="col-lg-5">

                <label className="form-label fw-semibold">
                  Order Status
                </label>

                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                >
                  <option value="ALL">
                    All Orders
                  </option>

                  <option value="CONFIRMED">
                    Confirmed
                  </option>

                  <option value="PROCESSING">
                    Processing
                  </option>

                  <option value="SHIPPED">
                    Shipped
                  </option>

                  <option value="OUT FOR DELIVERY">
                    Out For Delivery
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>

              </div>

            </div>

          </div>

        </div>

        {/* ================= RESULT COUNT ================= */}

        <div className="d-flex justify-content-between align-items-center mb-3">

          <h5 className="fw-bold mb-0">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1
              ? "Order"
              : "Orders"}{" "}
            Found
          </h5>

        </div>

        {/* ================= NO FILTER RESULTS ================= */}

        {filteredOrders.length === 0 ? (

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body text-center py-5">

              <div
                style={{
                  fontSize: "60px",
                }}
              >
                🔍
              </div>

              <h3 className="fw-bold mt-3">
                No Matching Orders
              </h3>

              <p className="text-muted">
                Try changing your search or status filter.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  setSearch("");
                  setFilter("ALL");
                }}
              >
                Clear Filters
              </button>

            </div>

          </div>

        ) : (

          /* ================= ORDERS ================= */

          filteredOrders.map((order) => {
            const items = Array.isArray(order.items)
              ? order.items
              : [];

            const totalAmount =
              Number(order.totalAmount) || 0;

            const totalQuantity = items.reduce(
              (sum, item) =>
                sum +
                (Number(item.quantity) || 1),
              0
            );

            return (

              <div
                key={order.id}
                className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
              >

                {/* ================= ORDER HEADER ================= */}

                <div className="card-header bg-white border-bottom p-4">

                  <div className="row align-items-center g-3">

                    {/* ORDER ID */}

                    <div className="col-lg-3 col-md-6">

                      <small className="text-muted d-block">
                        ORDER ID
                      </small>

                      <span className="fw-bold">
                        #{order.id}
                      </span>

                    </div>

                    {/* ORDER DATE */}

                    <div className="col-lg-3 col-md-6">

                      <small className="text-muted d-block">
                        ORDER DATE
                      </small>

                      <span className="fw-semibold">
                        {formatDate(order.orderDate)}
                      </span>

                    </div>

                    {/* TOTAL */}

                    <div className="col-lg-2 col-md-4">

                      <small className="text-muted d-block">
                        ORDER TOTAL
                      </small>

                      <span className="fw-bold">
                        ₹
                        {totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    {/* PAYMENT METHOD */}

                    <div className="col-lg-2 col-md-4">

                      <small className="text-muted d-block">
                        PAYMENT
                      </small>

                      <span className="fw-semibold">

                        {order.paymentMethod === "COD"
                          ? "Cash On Delivery"
                          : "Online"}

                      </span>

                    </div>

                    {/* STATUS */}

                    <div className="col-lg-2 col-md-4">

                      <span
                        className={`badge ${getStatusClass(
                          order.status
                        )} px-3 py-2`}
                      >
                        {order.status || "CONFIRMED"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* ================= PRODUCTS ================= */}

                <div className="card-body p-0">

                  {items.map((item, index) => {
                    const quantity =
                      Number(item.quantity) || 1;

                    const price =
                      Number(item.price) || 0;

                    const itemTotal =
                      price * quantity;

                    return (

                      <div
                        key={`${item.id}-${index}`}
                        className={`p-4 ${
                          index !== items.length - 1
                            ? "border-bottom"
                            : ""
                        }`}
                      >

                        <div className="row align-items-center g-4">

                          {/* ================= PRODUCT IMAGE ================= */}

                          <div className="col-lg-2 col-md-3">

                            <div
                              className="border rounded-3 p-2 bg-white d-flex justify-content-center align-items-center"
                              style={{
                                height: "140px",
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
                                height="120px"
                              />

                            </div>

                          </div>

                          {/* ================= PRODUCT INFO ================= */}

                          <div className="col-lg-5 col-md-5">

                            <h5
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
                            </h5>

                            <p className="text-muted mb-1">
                              Quantity: {quantity}
                            </p>

                            <p className="text-muted mb-0">
                              Price: ₹
                              {price.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                          {/* ================= ITEM TOTAL ================= */}

                          <div className="col-lg-2 col-md-4">

                            <small className="text-muted">
                              Item Total
                            </small>

                            <h5 className="fw-bold">
                              ₹
                              {itemTotal.toLocaleString(
                                "en-IN"
                              )}
                            </h5>

                          </div>

                          {/* ================= ACTIONS ================= */}

                          <div className="col-lg-3">

                            <div className="d-grid gap-2">

                              <Link
                                to={`/track/${order.id}`}
                                className="btn btn-primary"
                              >
                                Track Order
                              </Link>

                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  navigate(
                                    `/product/${item.id}`
                                  )
                                }
                              >
                                View Product
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    );
                  })}

                </div>

                {/* ================= ORDER FOOTER ================= */}

                <div className="card-footer bg-white p-4">

                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

                    <div>

                      <span className="text-muted">
                        Total Products:
                      </span>{" "}

                      <strong>
                        {totalQuantity}
                      </strong>

                    </div>

                    <div>

                      <span className="text-muted">
                        Order Amount:
                      </span>{" "}

                      <strong className="text-success fs-5">
                        ₹
                        {totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            );
          })

        )}

      </div>
    </div>
  );
}

export default Orders;