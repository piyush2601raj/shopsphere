import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "./dataService";
import ProductCard from "./ProductCard";

import laptopImg from "./Laptop.png";
import mobileImg from "./mobile.png";
import shoesImg from "./shoes.png";
import furnitureImg from "./Furnitures.png";
import clothesImg from "./clothes.png";
import sportsImg from "./sports.png";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();

        const validProducts = Array.isArray(data)
          ? data.filter((product) => product && product.id != null)
          : [];

        console.log("Home Products:", validProducts);
        setProducts(validProducts);
      } catch (error) {
        console.error("Error loading home products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = [
  { id: 1, name: "Electronics", icon: "💻" },
  { id: 2, name: "Clothing", icon: "👕" },
  { id: 3, name: "Books", icon: "📚" },
  { id: 4, name: "Home & Kitchen", icon: "🏠" },
  { id: 15, name: "Fashion", icon: "👜" },
  { id: 16, name: "Home Appliances", icon: "🧺" },
  { id: 19, name: "Sports & Fitness", icon: "🏸" },
  { id: 18, name: "Gaming", icon: "🎮" },
];

  const getCategoryProducts = (categoryName) => {
    return products.filter((product) => {
      const productCategory =
        product.categoryName ||
        product.category?.name ||
        product.category ||
        "";

      return (
        productCategory.toString().toLowerCase() === categoryName.toLowerCase()
      );
    });
  };

  const electronicsProducts = useMemo(
    () => getCategoryProducts("Electronics").slice(0, 6),
    [products]
  );

  const clothingProducts = useMemo(
    () => getCategoryProducts("Clothing").slice(0, 6),
    [products]
  );

  const fashionProducts = useMemo(
    () => getCategoryProducts("Fashion").slice(0, 6),
    [products]
  );

  const homeAppliancesProducts = useMemo(
    () => getCategoryProducts("Home Appliances").slice(0, 6),
    [products]
  );

  const recommendedProducts = useMemo(() => {
  return products
    .filter(
      (product) =>
        product &&
        product.id != null &&
        product.name &&
        product.price != null
    )
    .slice(0, 12);
}, [products]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const ProductSection = ({
    title,
    subtitle,
    sectionProducts,
    categoryName,
  }) => {
    if (!sectionProducts || sectionProducts.length === 0) {
      return null;
    }

    return (
      <section className="container my-4">
        <div className="bg-white rounded-4 shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">{title}</h3>
              {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
            </div>

            {categoryName && (
              <button
                type="button"
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => handleCategoryClick(categoryName)}
              >
                View All
              </button>
            )}
          </div>

          <div className="row g-3">
            {sectionProducts
  .filter(
    (product) =>
      product &&
      product.id != null &&
      product.name &&
      product.price != null
  )
  .map((product) => (
    <div
      className="col-6 col-md-4 col-lg-2"
      key={product.id}
    >
      <ProductCard product={product} />
    </div>
  ))}
          </div>
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading ShopSphere...</h5>
      </div>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      {/* CATEGORY STRIP */}
      <section className="container pt-3">
        <div className="bg-white rounded-4 shadow-sm p-3">
          <div className="row g-3 justify-content-center">
            {categories.map((category) => (
              <div className="col-4 col-sm-3 col-md" key={category.id}>
                <div
                  className="home-category-card text-center"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="home-category-icon">{category.icon}</div>
                  <p className="fw-semibold mb-0 mt-2">{category.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HERO CAROUSEL */}
      <section className="container mt-4">
        <div
          id="shopSphereCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="4000"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#shopSphereCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />
            <button
              type="button"
              data-bs-target="#shopSphereCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            />
            <button
              type="button"
              data-bs-target="#shopSphereCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            />
          </div>

          <div className="carousel-inner rounded-4 shadow">
            {/* SLIDE 1 */}
            <div className="carousel-item active">
              <div className="home-hero hero-blue">
                <div className="row align-items-center h-100">
                  <div className="col-md-6 hero-content">
                    <span className="badge bg-warning text-dark mb-3">
                      MEGA SALE 2026
                    </span>
                    <h1 className="display-4 fw-bold">Upgrade Your Tech</h1>
                    <p className="lead">
                      Discover premium electronics, laptops and accessories at
                      amazing prices.
                    </p>
                    <Link className="btn btn-warning btn-lg rounded-pill px-5" to="/products">
                      Shop Now
                    </Link>
                  </div>
                  <div className="col-md-6 text-center">
                    <img
                      src={laptopImg}
                      alt="Laptop Deals"
                      className="img-fluid hero-product-image"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 2 */}
            <div className="carousel-item">
              <div className="home-hero hero-purple">
                <div className="row align-items-center h-100">
                  <div className="col-md-6 hero-content">
                    <span className="badge bg-light text-dark mb-3">
                      NEW ARRIVALS
                    </span>
                    <h1 className="display-4 fw-bold">
                      Style That Defines You
                    </h1>
                    <p className="lead">
                      Explore trending clothing, shoes and fashion collections.
                    </p>
                    <button
                      type="button"
                      className="btn btn-light btn-lg rounded-pill px-5"
                      onClick={() => handleCategoryClick("Clothing")}
                    >
                      Explore Fashion
                    </button>
                  </div>
                  <div className="col-md-6 text-center">
                    <img
                      src={clothesImg}
                      alt="Fashion"
                      className="img-fluid hero-product-image"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 3 */}
            <div className="carousel-item">
              <div className="home-hero hero-orange">
                <div className="row align-items-center h-100">
                  <div className="col-md-6 hero-content">
                    <span className="badge bg-dark mb-3">HOME COLLECTION</span>
                    <h1 className="display-4 fw-bold">Make Your Home Better</h1>
                    <p className="lead">
                      Furniture, appliances and home essentials for modern
                      living.
                    </p>
                    <button
                      type="button"
                      className="btn btn-dark btn-lg rounded-pill px-5"
                      onClick={() => handleCategoryClick("Home Appliances")}
                    >
                      Shop Collection
                    </button>
                  </div>
                  <div className="col-md-6 text-center">
                    <img
                      src={furnitureImg}
                      alt="Furniture"
                      className="img-fluid hero-product-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#shopSphereCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#shopSphereCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container my-4">
        <div className="bg-white rounded-4 shadow-sm p-4">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="service-icon">🚚</div>
              <h6 className="fw-bold mb-1">Free Delivery</h6>
              <small className="text-muted">On selected orders</small>
            </div>
            <div className="col-6 col-md-3">
              <div className="service-icon">🔒</div>
              <h6 className="fw-bold mb-1">Secure Payment</h6>
              <small className="text-muted">100% secure checkout</small>
            </div>
            <div className="col-6 col-md-3">
              <div className="service-icon">↩️</div>
              <h6 className="fw-bold mb-1">Easy Returns</h6>
              <small className="text-muted">Hassle-free returns</small>
            </div>
            <div className="col-6 col-md-3">
              <div className="service-icon">🎧</div>
              <h6 className="fw-bold mb-1">24/7 Support</h6>
              <small className="text-muted">Dedicated assistance</small>
            </div>
          </div>
        </div>
      </section>

      {/* BEST DEALS */}
      <section className="container my-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div>
            <h2 className="fw-bold mb-1">Today's Best Deals 🔥</h2>
            <p className="text-muted mb-0">
              Limited-time offers you don't want to miss
            </p>
          </div>
          <Link className="btn btn-primary rounded-pill px-4" to="/products">
            View All Products
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="deal-card deal-card-blue">
              <div className="deal-content">
                <span className="deal-badge">UP TO 40% OFF</span>
                <h3>Laptops</h3>
                <p>Power meets performance</p>
                <button
  type="button"
  onClick={() =>
    navigate(`/subcategory/${encodeURIComponent("Laptop")}`)
  }
  className="btn btn-light rounded-pill"
>
  Shop Now
</button>
              </div>
              <img src={laptopImg} alt="Laptop" />
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="deal-card deal-card-purple">
              <div className="deal-content">
                <span className="deal-badge">NEW ARRIVALS</span>
                <h3>Fashion</h3>
                <p>Latest styles for you</p>
                <button
                  type="button"
                  onClick={() => handleCategoryClick("Fashion")}
                  className="btn btn-light rounded-pill"
                >
                  Explore
                </button>
              </div>
              <img src={shoesImg} alt="Shoes" />
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
  <div className="deal-card deal-card-orange">

    <div className="deal-content">

      <span className="deal-badge">
        BEST SELLERS
      </span>

      <h3>Gaming</h3>

      <p>Level up your experience</p>

      <button
        type="button"
        onClick={() =>
          handleCategoryClick("Gaming")
        }
        className="btn btn-dark rounded-pill"
      >
        Shop Now
      </button>

    </div>

    <img
      src={sportsImg}
      alt="Gaming"
    />

  </div>
</div>

         <div className="col-md-6 col-lg-3">
  <div className="deal-card deal-card-green">

    <div className="deal-content">

      <span className="deal-badge">
        SAVE MORE
      </span>

      <h3>Sports & Fitness</h3>

      <p>Build a better you</p>

      <button
        type="button"
        onClick={() =>
          handleCategoryClick("Sports & Fitness")
        }
        className="btn btn-light rounded-pill"
      >
        Discover
      </button>

    </div>

    <img
      src={sportsImg}
      alt="Sports & Fitness"
    />

  </div>
</div>
        </div>
      </section>

      {/* ELECTRONICS */}
<ProductSection
  categoryName="Electronics"
  sectionProducts={electronicsProducts}
  subtitle="Latest technology at the best prices"
  title="Top Electronics 💻"
/>
     {/* CLOTHING */}
<ProductSection
  categoryName="Clothing"
  sectionProducts={clothingProducts}
  subtitle="Refresh your wardrobe with trending styles"
  title="Trending Clothing 👕"
/>
      {/* PROMOTIONAL BANNER */}
      <section className="container my-4">
        <div className="promo-banner">
          <div className="row align-items-center">
            <div className="col-md-7">
              <span className="badge bg-warning text-dark mb-3">
                SPECIAL OFFER
              </span>
              <h2 className="display-6 fw-bold">
                Everything You Need.
                <br />
                All In One Place.
              </h2>
              <p className="lead">
                Shop thousands of products across multiple categories on
                ShopSphere.
              </p>
              <Link className="btn btn-warning btn-lg rounded-pill px-5" to="/products">
                Start Shopping
              </Link>
            </div>
            <div className="col-md-5 text-center">
              <img
                src={furnitureImg}
                alt="Shopping"
                className="img-fluid promo-image"
              />
            </div>
          </div>
        </div>
      </section>

     {/* FASHION */}
<ProductSection
  categoryName="Fashion"
  sectionProducts={fashionProducts}
  subtitle="Popular fashion products selected for you"
  title="Fashion Picks 👜"
/>
      {/* HOME APPLIANCES */}
<ProductSection
  categoryName="Home Appliances"
  sectionProducts={homeAppliancesProducts}
  subtitle="Smart appliances for your modern home"
  title="Home Appliances 🏠"
/>
      {/* RECOMMENDED PRODUCTS */}
      <section className="container my-4">
        <div className="bg-white rounded-4 shadow-sm p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h3 className="fw-bold mb-1">Recommended For You ⭐</h3>
              <p className="text-muted mb-0">Discover products you might like</p>
            </div>
            <Link className="btn btn-outline-primary rounded-pill px-4" to="/products">
              Browse All
            </Link>
          </div>

          {recommendedProducts.length > 0 ? (
            <div className="row g-3">
              {recommendedProducts.map((product) => (
                <div className="col-6 col-md-4 col-lg-2" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h5>No products available</h5>
              <p className="text-muted">
                Products will appear here when they are available from the
                backend.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container my-5">
        <div className="newsletter-section">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="newsletter-icon">📩</span>
              <h2 className="fw-bold mt-3">Never Miss A Deal</h2>
              <p className="mb-0">
                Subscribe to receive exclusive offers, new product updates and
                special discounts.
              </p>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <div className="input-group input-group-lg">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                />
                <button type="button" className="btn btn-warning px-4">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-4">
              <h3 className="fw-bold">ShopSphere</h3>
              <p className="text-white-50">
                Your trusted destination for electronics, fashion, home
                appliances and much more.
              </p>
            </div>

            <div className="col-6 col-lg-2">
              <h6 className="fw-bold">Shop</h6>
              <p>
                <Link to="/products">All Products</Link>
              </p>
              <p>
                <Link to="/cart">Cart</Link>
              </p>
              <p>
                <Link to="/wishlist">Wishlist</Link>
              </p>
            </div>

            <div className="col-6 col-lg-2">
              <h6 className="fw-bold">Categories</h6>
              <p>
                <span onClick={() => handleCategoryClick("Electronics")}>
                  Electronics
                </span>
              </p>
              <p>
                <span onClick={() => handleCategoryClick("Clothing")}>
                  Clothing
                </span>
              </p>
              <p>
                <span onClick={() => handleCategoryClick("Fashion")}>
                  Fashion
                </span>
              </p>
            </div>

            <div className="col-lg-4">
              <h6 className="fw-bold">Customer Promise</h6>
              <p className="text-white-50">
                Secure shopping, quality products, easy returns and dedicated
                customer support.
              </p>
            </div>
          </div>

          <hr className="border-secondary" />
          <div className="text-center text-white-50">
            © 2026 ShopSphere. All rights reserved.
          </div>
        </div>
      </footer>

      {/* CSS */}
      <style>{`
    .home-category-card {
      cursor: pointer;
      padding: 10px 5px;
      border-radius: 14px;
      transition: all 0.25s ease;
    }

    .home-category-card:hover {
      background: #f1f5ff;
      transform: translateY(-4px);
    }

    .home-category-icon {
      width: 64px;
      height: 64px;
      margin: auto;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef4ff, #e1eaff);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
    }

    .home-hero {
      min-height: 420px;
      color: white;
      padding: 50px 70px;
    }

    .hero-blue {
      background: linear-gradient(135deg, #0d6efd, #003b95);
    }

    .hero-purple {
      background: linear-gradient(135deg, #7b2ff7, #4b0082);
    }

    .hero-orange {
      background: linear-gradient(135deg, #ff8c00, #ff4d00);
    }

    .hero-content {
      padding: 30px;
    }

    .hero-product-image {
      max-height: 330px;
      object-fit: contain;
      filter: drop-shadow(
        0 20px 20px rgba(0, 0, 0, 0.25)
      );
    }

    .service-icon {
      font-size: 35px;
      margin-bottom: 10px;
    }

    .deal-card {
      min-height: 260px;
      padding: 25px;
      border-radius: 22px;
      color: white;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      transition: all 0.3s ease;
    }

    .deal-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
    }

    .deal-content {
      position: relative;
      z-index: 2;
    }

    .deal-card h3 {
      font-weight: 700;
      margin-top: 15px;
    }

    .deal-card img {
      position: absolute;
      width: 130px;
      height: 120px;
      object-fit: contain;
      right: -5px;
      bottom: 5px;
      z-index: 1;
    }

    .deal-badge {
      font-size: 11px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.25);
      padding: 6px 10px;
      border-radius: 20px;
    }

    .deal-card-blue {
      background: linear-gradient(135deg, #005bea, #00c6fb);
    }

    .deal-card-purple {
      background: linear-gradient(135deg, #8e2de2, #4a00e0);
    }

    .deal-card-orange {
      background: linear-gradient(135deg, #ff8008, #ffc837);
    }

    .deal-card-green {
      background: linear-gradient(135deg, #11998e, #38ef7d);
    }

    .promo-banner {
      padding: 50px;
      border-radius: 25px;
      color: white;
      background: linear-gradient(135deg, #111827, #1e3a8a);
      overflow: hidden;
    }

    .promo-image {
      max-height: 280px;
      object-fit: contain;
      filter: drop-shadow(
        0 20px 20px rgba(0, 0, 0, 0.3)
      );
    }

    .newsletter-section {
      background: linear-gradient(135deg, #0d6efd, #003b95);
      color: white;
      padding: 50px;
      border-radius: 25px;
    }

    .newsletter-icon {
      font-size: 45px;
    }

    .home-footer {
      background: #111827;
      color: white;
    }

    .home-footer a,
    .home-footer span {
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      cursor: pointer;
    }

    .home-footer a:hover,
    .home-footer span:hover {
      color: white;
    }

    @media (max-width: 768px) {
      .home-hero {
        min-height: auto;
        padding: 30px 20px;
        text-align: center;
      }

      .hero-content {
        padding: 20px 10px;
      }

      .home-hero h1 {
        font-size: 35px;
      }

      .hero-product-image {
        max-height: 220px;
        margin-top: 25px;
      }

      .deal-card {
        min-height: 240px;
      }

      .promo-banner {
        padding: 30px 20px;
        text-align: center;
      }

      .promo-image {
        margin-top: 25px;
      }

      .newsletter-section {
        padding: 30px 20px;
        text-align: center;
      }
    }
  `}</style>
    </div>
  );
};

export default Home;