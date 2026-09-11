import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  // ---------------- LOAD WISHLIST ----------------

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(data);
  }, []);

  // ---------------- UPDATE WISHLIST ----------------

  const updateWishlist = (updatedWishlist) => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);

    // Navbar wishlist count update
    window.dispatchEvent(
      new Event("wishlistChanged")
    );

    // Keep storage event for compatibility
    window.dispatchEvent(
      new Event("storage")
    );
  };

  // ---------------- REMOVE ITEM ----------------

  const removeItem = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    updateWishlist(updatedWishlist);
  };

  // ---------------- ADD TO CART ----------------

  const addToCart = (product) => {
    let cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      cart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    // Navbar cart count update
    window.dispatchEvent(
      new Event("cartChanged")
    );

    // Keep storage event for compatibility
    window.dispatchEvent(
      new Event("storage")
    );

    alert("Product Added To Cart 🛒");
  };

  // ---------------- MOVE TO CART ----------------

  const moveToCart = (product) => {
    addToCart(product);

    const updatedWishlist = wishlist.filter(
      (item) => item.id !== product.id
    );

    updateWishlist(updatedWishlist);
  };

  // ---------------- VIEW DETAILS ----------------

  const viewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  // ---------------- RETURN ----------------

  return (
    <div className="container mt-4 mb-5">

      <h2 className="fw-bold mb-4">
        ❤️ My Wishlist
      </h2>

      {wishlist.length === 0 ? (

        // ---------------- EMPTY WISHLIST ----------------

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body text-center py-5">

            <div
              style={{
                fontSize: "70px",
              }}
            >
              💔
            </div>

            <h3 className="fw-bold mt-3">
              Your Wishlist Is Empty
            </h3>

            <p className="text-muted">
              Save products you like and buy them later.
            </p>

            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>

          </div>
        </div>

      ) : (

        // ---------------- WISHLIST PRODUCTS ----------------

        <div className="row g-4">

          {wishlist.map((item) => (

            <div
              className="col-lg-3 col-md-4 col-sm-6"
              key={item.id}
            >

              <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">

                {/* PRODUCT IMAGE */}

                <div
                  className="position-relative"
                  style={{
                    height: "240px",
                    background: "#f8f9fa",
                  }}
                >

                  <img
                    src={
                      item.imageUrl ||
                      item.image ||
                      "https://via.placeholder.com/300"
                    }
                    className="w-100 h-100"
                    style={{
                      objectFit: "contain",
                      padding: "15px",
                      cursor: "pointer",
                    }}
                    alt={item.name}
                    onClick={() =>
                      viewDetails(item.id)
                    }
                  />

                  {/* REMOVE BUTTON */}

                  <button
                    className="btn btn-light shadow-sm position-absolute rounded-circle"
                    style={{
                      top: "10px",
                      right: "10px",
                      width: "40px",
                      height: "40px",
                    }}
                    onClick={() =>
                      removeItem(item.id)
                    }
                    title="Remove From Wishlist"
                  >
                    ❌
                  </button>

                </div>

                {/* PRODUCT DETAILS */}

                <div className="card-body d-flex flex-column">

                  <small className="text-muted">
                    {item.brand || "ShopSphere"}
                  </small>

                  <h5 className="fw-bold mt-1">
                    {item.name}
                  </h5>

                  {/* RATING */}

                  <div className="mb-2">

                    <span className="badge bg-success">
                      4.3 ⭐
                    </span>

                    <small className="text-muted ms-2">
                      (120 Ratings)
                    </small>

                  </div>

                  {/* PRICE */}

                  <div className="mb-3">

                    <h5 className="text-success fw-bold d-inline">
                      ₹
                      {Number(item.price).toLocaleString(
                        "en-IN"
                      )}
                    </h5>

                    <small className="text-muted text-decoration-line-through ms-2">
                      ₹
                      {Math.round(
                        Number(item.price) * 1.2
                      ).toLocaleString("en-IN")}
                    </small>

                  </div>

                  <small className="text-success fw-bold mb-3">
                    Free Delivery
                  </small>

                  {/* BUTTONS */}

                  <div className="mt-auto">

                    {/* VIEW DETAILS */}

                    <button
                      className="btn btn-outline-primary w-100 mb-2"
                      onClick={() =>
                        viewDetails(item.id)
                      }
                    >
                      View Details
                    </button>

                    {/* ADD TO CART */}

                    <button
                      className="btn btn-warning w-100 mb-2 fw-bold"
                      onClick={() =>
                        addToCart(item)
                      }
                    >
                      🛒 Add To Cart
                    </button>

                    {/* MOVE TO CART */}

                    <button
                      className="btn btn-success w-100"
                      onClick={() =>
                        moveToCart(item)
                      }
                    >
                      Move To Cart
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Wishlist;