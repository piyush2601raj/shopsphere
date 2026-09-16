import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  // ================= LOAD CART =================

  useEffect(() => {
    try {
      const cartItems =
        JSON.parse(localStorage.getItem("cart")) || [];

      if (Array.isArray(cartItems)) {
        const validCartItems = cartItems.filter(
          (item) =>
            item &&
            item.id !== undefined &&
            item.name
        );

        setCart(validCartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Cart Loading Error:", error);
      setCart([]);
    }
  }, []);

  // ================= UPDATE CART =================

  const updateCart = (updatedCart) => {
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);

    // Update Navbar cart count
    window.dispatchEvent(new Event("cartChanged"));

    // Keep the existing event for compatibility
    window.dispatchEvent(new Event("cartUpdated"));

    // Keep storage-based listeners in sync
    window.dispatchEvent(new Event("storage"));
  };

  // ================= INCREASE QUANTITY =================

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) => {
      if (String(item.id) !== String(id)) {
        return item;
      }

      const currentQuantity =
        Number(item.quantity) || 1;

      const stock = Number(item.stock ?? 100);

      if (currentQuantity >= stock) {
        alert(
          `Only ${stock} item${
            stock !== 1 ? "s" : ""
          } available in stock`
        );

        return item;
      }

      return {
        ...item,
        quantity: currentQuantity + 1,
      };
    });

    updateCart(updatedCart);
  };

  // ================= DECREASE QUANTITY =================

  const decreaseQty = (id) => {
    const updatedCart = cart.map((item) => {
      if (String(item.id) !== String(id)) {
        return item;
      }

      const currentQuantity =
        Number(item.quantity) || 1;

      return {
        ...item,
        quantity: Math.max(
          1,
          currentQuantity - 1
        ),
      };
    });

    updateCart(updatedCart);
  };

  // ================= REMOVE ITEM =================

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) =>
        String(item.id) !== String(id)
    );

    updateCart(updatedCart);
  };

  // ================= CLEAR CART =================

  const clearCart = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to remove all products from your cart?"
    );

    if (!confirmClear) {
      return;
    }

    updateCart([]);
  };

  // ================= IMAGE ERROR =================

  const handleImageError = (id) => {
    setImageErrors((previous) => ({
      ...previous,
      [id]: true,
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
      Temporary frontend discount calculation.

      Later, when backend integration is complete,
      discount should ideally come from backend/order API.
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

  // ================= CHECKOUT =================

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    navigate("/checkout");
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
            style={{ fontSize: "90px" }}
          >
            🛒
          </div>

          <h2 className="fw-bold">
            Your Cart Is Empty
          </h2>

          <p className="text-muted mb-4">
            Looks like you haven't added any
            products to your cart yet.
          </p>

          <button
            type="button"
            className="btn btn-primary btn-lg px-5"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
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

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

          <div>
            <h1 className="fw-bold mb-1">
              Shopping Cart
            </h1>

            <p className="text-muted mb-0">
              {priceDetails.totalItems}{" "}
              {priceDetails.totalItems === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>

        <div className="row g-4">

          {/* ================= CART PRODUCTS ================= */}

          <div className="col-lg-8">

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

              {cart.map((item, index) => {
                const price =
                  Number(item.price) || 0;

                const quantity =
                  Number(item.quantity) || 1;

                const stock =
                  Number(item.stock ?? 100);

                const itemTotal =
                  price * quantity;

                const category =
                  item.categoryName ||
                  item.category ||
                  "";

                const subCategory =
                  item.subCategoryName ||
                  item.subCategory ||
                  "";

                return (
                  <div
                    key={item.id}
                    className={`p-4 ${
                      index !== cart.length - 1
                        ? "border-bottom"
                        : ""
                    }`}
                  >

                    <div className="row align-items-center g-4">

                      {/* PRODUCT IMAGE */}

                      <div className="col-md-3">

                        <div
                          className="border rounded-3 p-2 bg-white d-flex justify-content-center align-items-center"
                          style={{
                            height: "170px",
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
                            height="150px"
                          />
                        </div>

                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="col-md-5">

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

                        {(category ||
                          subCategory) && (
                          <p className="text-muted small mb-2">
                            {category}

                            {category &&
                              subCategory &&
                              " • "}

                            {subCategory}
                          </p>
                        )}

                        <h5 className="fw-bold text-success">
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )}
                        </h5>

                        {stock > 0 ? (
                          <small className="text-success fw-semibold">
                            In Stock
                          </small>
                        ) : (
                          <small className="text-danger fw-semibold">
                            Out Of Stock
                          </small>
                        )}

                      </div>

                      {/* QUANTITY + TOTAL */}

                      <div className="col-md-4">

                        <div className="d-flex justify-content-md-end mb-3">

                          <div className="d-flex align-items-center">

                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                decreaseQty(item.id)
                              }
                              disabled={
                                quantity <= 1
                              }
                            >
                              −
                            </button>

                            <span
                              className="border-top border-bottom px-4 py-2 fw-bold"
                            >
                              {quantity}
                            </span>

                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                increaseQty(item.id)
                              }
                              disabled={
                                quantity >= stock
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>

                        <div className="text-md-end">

                          <small className="text-muted">
                            Item Total
                          </small>

                          <h5 className="fw-bold">
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </h5>

                          <button
                            type="button"
                            className="btn btn-link text-danger text-decoration-none p-0"
                            onClick={() =>
                              removeItem(item.id)
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* CONTINUE SHOPPING */}

            <button
              type="button"
              className="btn btn-outline-primary mt-4"
              onClick={() =>
                navigate("/products")
              }
            >
              ← Continue Shopping
            </button>

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
                    Subtotal (
                    {priceDetails.totalItems} items)
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

                <hr />

                {/* TOTAL */}

                <div className="d-flex justify-content-between align-items-center mb-4">

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
                  <div className="alert alert-success py-2">
                    You will save ₹
                    {priceDetails.discount.toLocaleString(
                      "en-IN"
                    )}{" "}
                    on this order.
                  </div>
                )}

                {/* CHECKOUT */}

                <button
                  type="button"
                  className="btn btn-success btn-lg w-100"
                  onClick={proceedToCheckout}
                >
                  Proceed To Checkout
                </button>

                {/* SECURE PAYMENT */}

                <div className="text-center mt-3">
                  <small className="text-muted">
                    🔒 Secure Checkout
                  </small>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;