import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductById } from "./dataService";
import ProductImage from "./ProductImage";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // ======================================================
  // LOAD PRODUCT
  // ======================================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const data = await getProductById(id);

        console.log("PRODUCT DETAILS DATA:", data);

        setProduct(data || null);
      } catch (error) {
        console.error("Error loading product:", error);

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ======================================================
  // SAFE PRODUCT VALUES
  // ======================================================

  const price = Number(product?.price) || 0;

  const originalPrice =
    Number(product?.originalPrice) ||
    Math.round(price * 1.2);

  const discount =
    originalPrice > price
      ? Math.round(
          ((originalPrice - price) / originalPrice) * 100
        )
      : 0;

  const rating =
    Number(product?.rating) || 4.3;

  const reviewCount =
    Number(product?.reviewCount) || 120;

  const stock =
    Number(product?.stock ?? 10);

  // ======================================================
  // CATEGORY
  // ======================================================

  const category =
    product?.categoryName ||
    product?.category?.name ||
    (typeof product?.category === "string"
      ? product.category
      : "Not Available");

  // ======================================================
  // SUBCATEGORY
  // ======================================================

  const subCategory =
    product?.subCategoryName ||
    product?.subCategory?.name ||
    (typeof product?.subCategory === "string"
      ? product.subCategory
      : "Not Available");

  // ======================================================
  // BRAND
  // ======================================================

  const brand =
    product?.brand || "ShopSphere";

  // ======================================================
  // ADD TO CART
  // ======================================================

  const addToCart = () => {
    if (!product || stock <= 0) {
      return;
    }

    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      (item) =>
        String(item.id) === String(product.id)
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map((item) =>
        String(item.id) === String(product.id)
          ? {
              ...item,

              quantity:
                (Number(item.quantity) || 1) +
                quantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,

        {
          ...product,

          quantity,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartChanged"));
    window.dispatchEvent(new Event("storage"));

    alert("Product Added To Cart Successfully");
  };

  // ======================================================
  // ADD TO WISHLIST
  // ======================================================

  const addToWishlist = () => {
    if (!product) {
      return;
    }

    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    const exists = wishlist.some(
      (item) =>
        String(item.id) === String(product.id)
    );

    if (exists) {
      alert("Product Already In Wishlist ❤️");

      return;
    }

    const updatedWishlist = [
      ...wishlist,

      product,
    ];

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistChanged"));
    window.dispatchEvent(new Event("storage"));

    alert("Added To Wishlist ❤️");
  };

  // ======================================================
  // BUY NOW
  // ======================================================

  const buyNow = () => {
    if (!product || stock <= 0) {
      return;
    }

    localStorage.setItem(
      "cart",

      JSON.stringify([
        {
          ...product,

          quantity,
        },
      ])
    );

    window.dispatchEvent(new Event("cartChanged"));
    window.dispatchEvent(new Event("storage"));

    navigate("/checkout");
  };

  // ======================================================
  // INCREASE QUANTITY
  // ======================================================

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(
        (previous) => previous + 1
      );
    }
  };

  // ======================================================
  // DECREASE QUANTITY
  // ======================================================

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(
        (previous) => previous - 1
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className="
          container
          d-flex
          justify-content-center
          align-items-center
        "
        style={{
          minHeight: "60vh",
        }}
      >
        <div className="text-center">

          <div
            className="
              spinner-border
              text-primary
            "
            role="status"
          />

          <h5 className="mt-3">
            Loading Product...
          </h5>

        </div>
      </div>
    );
  }

  // ======================================================
  // PRODUCT NOT FOUND
  // ======================================================

  if (!product) {
    return (
      <div
        className="
          container
          text-center
        "
        style={{
          minHeight: "60vh",

          paddingTop: "100px",
        }}
      >
        <h2>
          Product Not Found
        </h2>

        <p className="text-muted">
          The requested product is unavailable.
        </p>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/products")
          }
        >
          Browse Products
        </button>

      </div>
    );
  }

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div className="bg-light py-4">

      <div className="container">

        {/* ==================================================
            BREADCRUMB
        ================================================== */}

        <nav className="mb-4">

          <span
            className="text-primary"
            style={{
              cursor: "pointer",
            }}
            onClick={() =>
              navigate("/")
            }
          >
            Home
          </span>

          <span className="mx-2">
            /
          </span>

          <span
            className="text-primary"
            style={{
              cursor: "pointer",
            }}
            onClick={() =>
              navigate("/products")
            }
          >
            Products
          </span>

          <span className="mx-2">
            /
          </span>

          <span className="text-muted">
            {product.name}
          </span>

        </nav>

        {/* ==================================================
            MAIN PRODUCT CARD
        ================================================== */}

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4 p-lg-5">

            <div className="row g-5">

              {/* ==================================================
                  PRODUCT IMAGE
              ================================================== */}

              <div className="col-lg-5">

                <div
                  className="
                    bg-white
                    border
                    rounded-3
                    p-3
                    d-flex
                    justify-content-center
                    align-items-center
                  "
                  style={{
                    minHeight: "450px",
                  }}
                >

                  <ProductImage
                    product={product}
                    height="420px"
                  />

                </div>

                {/* ==================================================
                    TRUST FEATURES
                ================================================== */}

                <div className="row text-center mt-4 g-2">

                  <div className="col-4">

                    <div className="border rounded p-3 h-100">

                      🚚

                      <small className="d-block mt-1">
                        Fast Delivery
                      </small>

                    </div>

                  </div>

                  <div className="col-4">

                    <div className="border rounded p-3 h-100">

                      🔒

                      <small className="d-block mt-1">
                        Secure Payment
                      </small>

                    </div>

                  </div>

                  <div className="col-4">

                    <div className="border rounded p-3 h-100">

                      ↩️

                      <small className="d-block mt-1">
                        Easy Returns
                      </small>

                    </div>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  PRODUCT INFORMATION
              ================================================== */}

              <div className="col-lg-7">

                <p className="text-muted mb-2">
                  {brand}
                </p>

                <h1 className="fw-bold fs-2">
                  {product.name}
                </h1>

                {/* ==================================================
                    RATING
                ================================================== */}

                <div
                  className="
                    d-flex
                    align-items-center
                    gap-2
                    my-3
                  "
                >

                  <span className="badge bg-success fs-6">
                    {rating} ★
                  </span>

                  <span className="text-muted">
                    {reviewCount} Ratings & Reviews
                  </span>

                </div>

                <hr />

                {/* ==================================================
                    PRICE
                ================================================== */}

                <p className="text-success fw-semibold mb-1">
                  Special Price
                </p>

                <div
                  className="
                    d-flex
                    align-items-center
                    flex-wrap
                    gap-3
                  "
                >

                  <h2 className="fw-bold mb-0">
                    ₹{price.toLocaleString("en-IN")}
                  </h2>

                  <span
                    className="
                      text-muted
                      text-decoration-line-through
                      fs-5
                    "
                  >
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>

                  {discount > 0 && (

                    <span className="text-success fw-bold fs-5">
                      {discount}% off
                    </span>

                  )}

                </div>

                <hr />

                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="my-4">

                  <h5 className="fw-bold">
                    Product Description
                  </h5>

                  <p className="text-muted">

                    {product.description ||
                      "Product description is currently unavailable."}

                  </p>

                </div>

                {/* ==================================================
                    BASIC PRODUCT INFORMATION
                ================================================== */}

                <div className="row mb-4">

                  <div className="col-sm-6 mb-3">

                    <strong>
                      Brand:
                    </strong>

                    <div className="text-muted">
                      {brand}
                    </div>

                  </div>

                  <div className="col-sm-6 mb-3">

                    <strong>
                      Category:
                    </strong>

                    <div className="text-muted">
                      {category}
                    </div>

                  </div>

                  <div className="col-sm-6 mb-3">

                    <strong>
                      Sub Category:
                    </strong>

                    <div className="text-muted">
                      {subCategory}
                    </div>

                  </div>

                  <div className="col-sm-6 mb-3">

                    <strong>
                      Availability:
                    </strong>

                    <div>

                      {stock > 0 ? (

                        <span className="text-success fw-semibold">
                          In Stock
                        </span>

                      ) : (

                        <span className="text-danger fw-semibold">
                          Out Of Stock
                        </span>

                      )}

                    </div>

                  </div>

                </div>

                {/* ==================================================
                    LIMITED STOCK
                ================================================== */}

                {stock > 0 &&
                  stock <= 10 && (

                    <div className="alert alert-warning">

                      🔥 Hurry! Only {stock} items left in stock.

                    </div>

                  )}

                {/* ==================================================
                    DELIVERY
                ================================================== */}

                <div className="border rounded p-3 mb-4">

                  <h6 className="fw-bold">
                    🚚 Delivery Information
                  </h6>

                  <p className="mb-1">
                    Free delivery available on eligible orders.
                  </p>

                  <small className="text-muted">
                    Estimated delivery within 3-7 business days.
                  </small>

                </div>

                {/* ==================================================
                    OFFERS
                ================================================== */}

                <div className="mb-4">

                  <h5 className="fw-bold">
                    Available Offers
                  </h5>

                  <p className="mb-2">

                    🏷️ Special Price: Get extra discount on selected products

                  </p>

                  <p className="mb-2">

                    💳 Bank Offer: Additional discount on eligible cards

                  </p>

                  <p className="mb-0">

                    🚚 Free Delivery on eligible orders

                  </p>

                </div>

                {/* ==================================================
                    QUANTITY
                ================================================== */}

                {stock > 0 && (

                  <div className="mb-4">

                    <h6 className="fw-bold">
                      Quantity
                    </h6>

                    <div className="d-flex align-items-center">

                      <button
                        className="btn btn-outline-secondary"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>

                      <span
                        className="
                          border-top
                          border-bottom
                          px-4
                          py-2
                          fw-bold
                        "
                      >
                        {quantity}
                      </span>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={increaseQuantity}
                        disabled={quantity >= stock}
                      >
                        +
                      </button>

                    </div>

                  </div>

                )}

                {/* ==================================================
                    ACTION BUTTONS
                ================================================== */}

                <div className="d-flex gap-3 flex-wrap">

                  <button
                    className="btn btn-warning btn-lg px-4"
                    onClick={addToCart}
                    disabled={stock <= 0}
                  >
                    🛒 Add To Cart
                  </button>

                  <button
                    className="btn btn-success btn-lg px-4"
                    onClick={buyNow}
                    disabled={stock <= 0}
                  >
                    ⚡ Buy Now
                  </button>

                  <button
                    className="btn btn-outline-danger btn-lg"
                    onClick={addToWishlist}
                  >
                    ♡ Wishlist
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            ADDITIONAL PRODUCT INFORMATION
        ================================================== */}

        <div className="card border-0 shadow-sm mt-4">

          <div className="card-body p-4">

            <h4 className="fw-bold mb-4">
              Product Information
            </h4>

            <div className="table-responsive">

              <table className="table table-bordered">

                <tbody>

                  <tr>

                    <th
                      style={{
                        width: "30%",
                      }}
                    >
                      Product Name
                    </th>

                    <td>
                      {product.name}
                    </td>

                  </tr>

                  <tr>

                    <th>
                      Brand
                    </th>

                    <td>
                      {brand}
                    </td>

                  </tr>

                  <tr>

                    <th>
                      Category
                    </th>

                    <td>
                      {category}
                    </td>

                  </tr>

                  <tr>

                    <th>
                      Sub Category
                    </th>

                    <td>
                      {subCategory}
                    </td>

                  </tr>

                  <tr>

                    <th>
                      Stock
                    </th>

                    <td>
                      {stock} Units Available
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;