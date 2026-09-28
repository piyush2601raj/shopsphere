import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductImage from "./ProductImage";

function Payment() {
  const navigate = useNavigate();

  // ================= STATES =================

  const [method, setMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({});
  const [checkoutSummary, setCheckoutSummary] = useState(null);

  const [imageErrors, setImageErrors] = useState({});

  // ================= LOAD CHECKOUT DATA =================

  useEffect(() => {
    try {
      const savedCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      const savedAddress =
        JSON.parse(
          localStorage.getItem("shippingAddress")
        ) || {};

      const savedSummary =
        JSON.parse(
          localStorage.getItem("checkoutSummary")
        ) || null;

      setCart(
        Array.isArray(savedCart)
          ? savedCart
          : []
      );

      setAddress(savedAddress);

      setCheckoutSummary(savedSummary);
    } catch (error) {
      console.error(
        "Payment Data Loading Error:",
        error
      );

      setCart([]);
      setAddress({});
      setCheckoutSummary(null);
    }
  }, []);

  // ================= FALLBACK PRICE CALCULATION =================

  const calculatedPrice = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => {
        const price = Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 1;

        return sum + price * quantity;
      },
      0
    );

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

  // ================= FINAL PRICE DETAILS =================

  const priceDetails = {
    subtotal:
      Number(checkoutSummary?.subtotal) ||
      calculatedPrice.subtotal,

    discount:
      Number(checkoutSummary?.discount) ||
      calculatedPrice.discount,

    deliveryCharge:
      Number(checkoutSummary?.deliveryCharge) ||
      calculatedPrice.deliveryCharge,

    totalAmount:
      Number(checkoutSummary?.totalAmount) ||
      calculatedPrice.totalAmount,

    totalItems:
      Number(checkoutSummary?.totalItems) ||
      calculatedPrice.totalItems,
  };

  // ================= RAZORPAY SCRIPT =================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ================= CREATE REAL DATABASE ORDER =================

  const createBackendOrder = async (
    paymentMethod,
    paymentDetails = {}
  ) => {
    // First try direct userId
    let userId =
      localStorage.getItem("userId");

    // If userId is not directly stored,
    // try saved user object
    if (!userId) {
      const savedUser =
        JSON.parse(
          localStorage.getItem("user")
        ) || null;

      userId =
        savedUser?.userId ||
        savedUser?.id ||
        savedUser?.user?.id ||
        null;
    }

    if (!userId) {
      throw new Error(
        "User ID not found. Please login again."
      );
    }

    console.log(
      "Creating ShopSphere Order for user:",
      userId
    );

    const response = await axios.post(
      `https://shopsphere-backend-production-3877.up.railway.app/orders/place/${userId}`
    );

    console.log(
      "ShopSphere Order Response:",
      response.data
    );

    const backendOrder =
      response.data?.data;

    if (!backendOrder?.orderId) {
      throw new Error(
        "Backend did not return a valid order ID."
      );
    }

    const orders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    const newOrder = {
      // IMPORTANT: use the real DB order ID.
      // Never use Date.now() here.
      id: backendOrder.orderId,

      items: cart,
      address,
      paymentMethod,
      paymentDetails,

      subtotal: priceDetails.subtotal,
      discount: priceDetails.discount,
      deliveryCharge:
        priceDetails.deliveryCharge,
      totalAmount:
        priceDetails.totalAmount,

      status:
        backendOrder.status || "PENDING",

      orderDate:
        backendOrder.orderDate ||
        new Date().toISOString(),
    };

    // Replace an existing local copy of the same DB order instead of duplicating it.
    const existingIndex =
      orders.findIndex(
        (existingOrder) =>
          String(existingOrder.id) ===
          String(newOrder.id)
      );

    if (existingIndex >= 0) {
      orders[existingIndex] = newOrder;
    } else {
      orders.push(newOrder);
    }

    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );

    return newOrder;
  };

  // ================= COMPLETE ORDER =================

  const completeOrder = async (
    paymentMethod,
    paymentDetails = {}
  ) => {
    try {
      const order =
        await createBackendOrder(
          paymentMethod,
          paymentDetails
        );

      console.log(
        "FINAL SHOPSPHERE ORDER:",
        order
      );

      localStorage.setItem(
        "latestOrder",
        JSON.stringify(order)
      );

      localStorage.removeItem("cart");
      localStorage.removeItem(
        "checkoutSummary"
      );

      window.dispatchEvent(
        new Event("storage")
      );

      navigate("/order-success");
    } catch (error) {
      console.error(
        "Order Creation Error:",
        error
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        (typeof error.response?.data ===
        "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Unable to create order."
      );

      setProcessing(false);

      throw error;
    }
  };

  // ================= RAZORPAY PAYMENT =================

  const payWithRazorpay = async () => {
    try {
      setProcessing(true);

      // LOAD RAZORPAY

      const loaded =
        await loadRazorpay();

      if (!loaded) {
        alert(
          "Unable to load Razorpay Checkout."
        );

        setProcessing(false);

        return;
      }

      // CREATE RAZORPAY ORDER FROM BACKEND

      console.log(
        "Creating Razorpay Order..."
      );

      const response = await axios.post(
        "https://shopsphere-backend-production-3877.up.railway.app/payments/create-order",
        {
          amount:
            priceDetails.totalAmount,
        }
      );

      console.log(
        "Razorpay Order:",
        response.data
      );

      const razorpayOrder =
        response.data;

      // VALIDATE BACKEND RESPONSE

      if (
        !razorpayOrder ||
        !razorpayOrder.id ||
        !razorpayOrder.amount
      ) {
        alert(
          "Invalid payment order received from server."
        );

        setProcessing(false);

        return;
      }

      // ================= RAZORPAY OPTIONS =================

      const options = {
        /*
          Better:
          later key ko .env file me rakhenge.
        */

        key: "rzp_test_SiUqjfu32UIx4B",

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency ||
          "INR",

        name: "ShopSphere",

        description:
          "ShopSphere Order Payment",

        order_id:
          razorpayOrder.id,

        // ================= CUSTOMER INFO =================

        prefill: {
          name: address?.name || "",

          contact:
            address?.phone || "",

          email: "",
        },

        // ================= SUCCESS HANDLER =================

        handler: async function (
          paymentResponse
        ) {
          try {
            console.log(
              "Payment Response:",
              paymentResponse
            );

            // VERIFY PAYMENT ON BACKEND

            const verifyResponse =
              await axios.post(
                "https://shopsphere-backend-production-3877.up.railway.app/payments/verify",
                {
                  orderId:
                    paymentResponse.razorpay_order_id,

                  paymentId:
                    paymentResponse.razorpay_payment_id,

                  signature:
                    paymentResponse.razorpay_signature,
                }
              );

            console.log(
              "Verification Response:",
              verifyResponse.data
            );

            // ================= SUCCESS =================

            if (
              verifyResponse.data?.status ===
              "SUCCESS"
            ) {
              await completeOrder(
                "ONLINE",
                {
                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,

                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id,
                }
              );
            } else {
              alert(
                "Payment verification failed."
              );

              setProcessing(false);
            }
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            alert(
              "Unable to verify payment."
            );

            setProcessing(false);
          }
        },

        // ================= MODAL =================

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay Checkout Closed"
            );

            setProcessing(false);
          },
        },

        // ================= THEME =================

        theme: {
          color: "#2874F0",
        },
      };

      // ================= OPEN RAZORPAY =================

      const razorpay =
        new window.Razorpay(options);

      // PAYMENT FAILURE EVENT

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment Failed:",
            response.error
          );

          alert(
            response.error?.description ||
            "Payment failed."
          );

          setProcessing(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay Payment Error:",
        error
      );

      if (error.response) {
        console.error(
          "Backend Status:",
          error.response.status
        );

        console.error(
          "Backend Response:",
          error.response.data
        );
      }

      alert(
        "Unable to start payment. Please try again."
      );

      setProcessing(false);
    }
  };

  // ================= CASH ON DELIVERY =================

  const placeCODOrder = async () => {
    setProcessing(true);

    try {
      await completeOrder("COD");
    } catch (error) {
      console.error(
        "COD Order Error:",
        error
      );
      // completeOrder already shows the backend error and resets processing.
    }
  };

  // ================= HANDLE PAYMENT =================

  const handlePayment = () => {
    if (!method) {
      alert(
        "Please Select Payment Method"
      );

      return;
    }

    if (cart.length === 0) {
      alert(
        "Your Cart Is Empty"
      );

      navigate("/products");

      return;
    }

    if (
      !address?.name ||
      !address?.phone ||
      !address?.address
    ) {
      alert(
        "Delivery Address Is Missing"
      );

      navigate("/checkout");

      return;
    }

    if (method === "ONLINE") {
      payWithRazorpay();

      return;
    }

    if (method === "COD") {
      placeCODOrder();
    }
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
        className="container d-flex justify-content-center align-items-center"
        style={{
          minHeight: "650px",
        }}
      >
        <div className="text-center">

          <div
            style={{
              fontSize: "80px",
            }}
          >
            🛒
          </div>

          <h2 className="fw-bold mt-3">
            Your Cart Is Empty
          </h2>

          <p className="text-muted">
            Add products before making payment.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() =>
              navigate("/products")
            }
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
      style={{
        minHeight: "750px",
      }}
    >
      <div className="container">

        {/* ================= HEADER ================= */}

        <div className="mb-4">

          <h1 className="fw-bold">
            Secure Payment
          </h1>

          <p className="text-muted">
            Choose your preferred payment method
            and complete your order.
          </p>

        </div>

        {/* ================= STEPS ================= */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body py-3">

            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">

              <span className="badge bg-success fs-6 px-3 py-2">
                ✓ Cart
              </span>

              <span>→</span>

              <span className="badge bg-success fs-6 px-3 py-2">
                ✓ Checkout
              </span>

              <span>→</span>

              <span className="badge bg-primary fs-6 px-3 py-2">
                3. Payment
              </span>

              <span>→</span>

              <span className="badge bg-secondary fs-6 px-3 py-2">
                4. Complete
              </span>

            </div>

          </div>

        </div>

        <div className="row g-4">

          {/* ================= LEFT SIDE ================= */}

          <div className="col-lg-8">

            {/* ================= PAYMENT METHODS ================= */}

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">
                  Select Payment Method
                </h4>

                {/* ================= ONLINE PAYMENT ================= */}

                <div
                  className={`border rounded-4 p-4 mb-3 ${
                    method === "ONLINE"
                      ? "border-primary bg-primary bg-opacity-10"
                      : ""
                  }`}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setMethod("ONLINE")
                  }
                >

                  <div className="form-check">

                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="onlinePayment"
                      checked={
                        method === "ONLINE"
                      }
                      onChange={() =>
                        setMethod("ONLINE")
                      }
                    />

                    <label
                      className="form-check-label fw-bold fs-5"
                      htmlFor="onlinePayment"
                    >
                      💳 Online Payment
                    </label>

                  </div>

                  <p className="text-muted mt-2 mb-0 ms-4">
                    Pay securely using UPI, Cards,
                    Net Banking or other available
                    payment options.
                  </p>

                </div>

                {/* ================= ONLINE INFO ================= */}

                {method === "ONLINE" && (
                  <div className="alert alert-info">

                    <h6 className="fw-bold">
                      Secure Razorpay Checkout
                    </h6>

                    <p className="mb-0">
                      Click the payment button below.
                      Razorpay Checkout will open where
                      you can select UPI, Card, Net
                      Banking or other supported payment
                      methods.
                    </p>

                  </div>
                )}

                {/* ================= COD ================= */}

                <div
                  className={`border rounded-4 p-4 ${
                    method === "COD"
                      ? "border-primary bg-primary bg-opacity-10"
                      : ""
                  }`}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setMethod("COD")
                  }
                >

                  <div className="form-check">

                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="codPayment"
                      checked={
                        method === "COD"
                      }
                      onChange={() =>
                        setMethod("COD")
                      }
                    />

                    <label
                      className="form-check-label fw-bold fs-5"
                      htmlFor="codPayment"
                    >
                      📦 Cash On Delivery
                    </label>

                  </div>

                  <p className="text-muted mt-2 mb-0 ms-4">
                    Pay when your order is delivered.
                  </p>

                </div>

                {/* ================= PAYMENT BUTTON ================= */}

                <button
                  type="button"
                  className={`btn btn-lg w-100 mt-4 fw-bold ${
                    method === "COD"
                      ? "btn-warning"
                      : "btn-success"
                  }`}
                  disabled={processing}
                  onClick={handlePayment}
                >
                  {processing
                    ? "Processing..."
                    : method === "COD"
                    ? `Place Order ₹${priceDetails.totalAmount.toLocaleString(
                        "en-IN"
                      )}`
                    : `Pay ₹${priceDetails.totalAmount.toLocaleString(
                        "en-IN"
                      )}`}
                </button>

                <div className="text-center mt-3">

                  <small className="text-success fw-semibold">
                    🔒 Secure Checkout
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="col-lg-4">

            <div
              className="card border-0 shadow-sm rounded-4"
              style={{
                position: "sticky",
                top: "100px",
              }}
            >

              <div className="card-body p-4">

                {/* ================= ADDRESS ================= */}

                <div className="mb-4">

                  <div className="d-flex justify-content-between align-items-center">

                    <h5 className="fw-bold">
                      Deliver To
                    </h5>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        navigate("/checkout")
                      }
                    >
                      Change
                    </button>

                  </div>

                  <p className="fw-semibold mb-1">
                    {address.name}
                  </p>

                  <p className="text-muted small mb-1">
                    {address.address}
                  </p>

                  <p className="text-muted small mb-1">
                    {address.city} -{" "}
                    {address.pincode}
                  </p>

                  <p className="text-muted small mb-0">
                    Phone: {address.phone}
                  </p>

                </div>

                <hr />

                {/* ================= PRICE DETAILS ================= */}

                <h4 className="fw-bold mb-4">
                  Price Details
                </h4>

                <div className="d-flex justify-content-between mb-3">

                  <span className="text-muted">
                    Price (
                    {priceDetails.totalItems} items)
                  </span>

                  <span>
                    ₹
                    {priceDetails.subtotal.toLocaleString(
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
                    {priceDetails.discount.toLocaleString(
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
                      priceDetails.deliveryCharge === 0
                        ? "text-success"
                        : ""
                    }
                  >
                    {priceDetails.deliveryCharge === 0
                      ? "FREE"
                      : `₹${priceDetails.deliveryCharge}`}
                  </span>

                </div>

                <hr />

                <div className="d-flex justify-content-between">

                  <h5 className="fw-bold">
                    Total Amount
                  </h5>

                  <h5 className="fw-bold text-success">
                    ₹
                    {priceDetails.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </h5>

                </div>

                {priceDetails.discount > 0 && (

                  <div className="alert alert-success mt-3 mb-0">

                    🎉 You saved ₹
                    {priceDetails.discount.toLocaleString(
                      "en-IN"
                    )}

                  </div>

                )}

                {/* ================= ORDER SUMMARY ================= */}

                <hr />

                <h5 className="fw-bold mb-3">
                  Order Summary
                </h5>

                {cart.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="d-flex align-items-center gap-3 mb-3"
                    >

                      <div
                        className="border rounded p-1"
                        style={{
                          width: "65px",
                          height: "65px",
                          flexShrink: 0,
                        }}
                      >
                        <ProductImage
                          product={item}
                          height="55px"
                        />
                      </div>

                      <div
                        style={{
                          minWidth: 0,
                        }}
                      >

                        <div
                          className="fw-semibold text-truncate"
                          title={item.name}
                        >
                          {item.name}
                        </div>

                        <small className="text-muted">
                          Qty:{" "}
                          {Number(item.quantity) || 1}
                        </small>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Payment;