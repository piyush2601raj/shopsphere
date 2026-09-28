import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // ======================================================
  // PRODUCT DETAILS
  // ======================================================

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  // ======================================================
  // ADD TO CART
  // LOGIN CHECK REMOVED
  // BACKEND API REMOVED
  // ======================================================

  const handleAddToCart = (event) => {
    event.stopPropagation();

    try {
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
                  (Number(item.quantity) || 1) + 1,
              }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      window.dispatchEvent(
        new Event("cartChanged")
      );

      window.dispatchEvent(
        new Event("storage")
      );

      alert("Added To Cart ✅");
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );

      alert("Failed To Add Cart ❌");
    }
  };

  // ======================================================
  // ADD TO WISHLIST
  // LOGIN CHECK REMOVED
  // ======================================================

  const handleAddToWishlist = (event) => {
    event.stopPropagation();

    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    const exists = wishlist.find(
      (item) =>
        Number(item.id) === Number(product.id)
    );

    if (exists) {
      alert("Already In Wishlist ❤️");

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

    window.dispatchEvent(
      new Event("wishlistChanged")
    );

    window.dispatchEvent(
      new Event("storage")
    );

    alert("Added To Wishlist ❤️");
  };

  // ======================================================
  // PRICE
  // ======================================================

  const price = Number(product?.price || 0);

  const originalPrice = Math.round(
    price * 1.2
  );

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div
      className="card h-100 border-0 product-card"
      onClick={handleProductClick}
    >
      <div className="product-image-container">

        <span className="product-discount-badge">
          20% OFF
        </span>

        <button
          type="button"
          className="product-wishlist-icon"
          onClick={handleAddToWishlist}
          title="Add To Wishlist"
        >
          ♡
        </button>

        <ProductImage
          product={product}
          height="190px"
        />

      </div>

      <div className="card-body d-flex flex-column">

        <small className="product-category">
          {product?.categoryName ||
            product?.category?.name ||
            product?.category ||
            "ShopSphere"}
        </small>

        <h6
          className="product-title"
          title={product?.name}
        >
          {product?.name || "Product"}
        </h6>

        <div className="d-flex align-items-center mb-2">

          <span className="product-rating">
            4.3 ★
          </span>

          <small className="text-muted ms-2">
            (120)
          </small>

        </div>

        <div className="d-flex align-items-center gap-2 mb-1">

          <h5 className="product-price mb-0">
            ₹{price.toLocaleString("en-IN")}
          </h5>

          <small className="product-original-price">
            ₹{originalPrice.toLocaleString("en-IN")}
          </small>

        </div>

        <p className="product-delivery mb-3">
          Free Delivery
        </p>

        <button
          type="button"
          className="btn btn-warning product-cart-button mt-auto"
          onClick={handleAddToCart}
        >
          Add To Cart
        </button>

      </div>

      <style>{`

        .product-card {
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          background: #ffffff;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .product-image-container {
          height: 220px;
          box-sizing: border-box;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          background: #ffffff;
          overflow: visible;
        }

        .product-image-container img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .product-card:hover
        .product-image-container img {
          transform: scale(1.04);
        }

        .product-discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 5;
          padding: 4px 8px;
          background: #198754;
          color: white;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .product-wishlist-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 5;

          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #e5e7eb;
          border-radius: 50%;

          background: white;
          color: #dc3545;

          font-size: 21px;
          line-height: 1;

          transition: all 0.2s ease;
        }

        .product-wishlist-icon:hover {
          background: #fff1f2;
          border-color: #dc3545;
          transform: scale(1.08);
        }

        .product-card .card-body {
          padding: 14px;
        }

        .product-category {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .product-title {
          min-height: 40px;
          margin-bottom: 8px;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          overflow: hidden;

          color: #111827;
          font-size: 15px;
          font-weight: 600;
          line-height: 20px;
        }

        .product-rating {
          padding: 3px 7px;

          background: #198754;
          color: white;

          border-radius: 4px;

          font-size: 12px;
          font-weight: 600;
        }

        .product-price {
          color: #111827;
          font-size: 19px;
          font-weight: 700;
        }

        .product-original-price {
          color: #9ca3af;
          text-decoration: line-through;
          font-size: 13px;
        }

        .product-delivery {
          color: #198754;
          font-size: 13px;
          font-weight: 600;
        }

        .product-cart-button {
          width: 100%;
          border-radius: 7px;
          font-weight: 600;
        }

        @media (max-width: 768px) {

          .product-image-container {
            height: 180px;
            padding: 8px;
          }

          .product-title {
            font-size: 14px;
          }

          .product-price {
            font-size: 17px;
          }

        }

      `}</style>

    </div>
  );
};

export default ProductCard;