import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "./dataService";

// ================= SEARCH PRODUCT IMAGE =================
const getSearchProductImage = (item) => {
  const directImage =
    item?.imageUrl ||
    item?.image ||
    null;

  // If a valid absolute/data/blob URL exists, use it first.
  if (
    typeof directImage === "string" &&
    (
      directImage.startsWith("http://") ||
      directImage.startsWith("https://") ||
      directImage.startsWith("data:") ||
      directImage.startsWith("blob:")
    )
  ) {
    return directImage;
  }

  // Existing local Product image files in /public/Products
  const subCategory = String(
    item?.subCategoryName ||
    item?.subCategory ||
    item?.subcategoryName ||
    item?.subcategory ||
    ""
  )
    .toLowerCase()
    .trim();

  const imageMap = {
    laptop: "/Products/laptop.png",
    monitor: "/Products/monitor.png",
    mouse: "/Products/mouse.png",
    keyboard: "/Products/keyboard.png",
    tablet: "/Products/tablet.png",
    "smart watch": "/Products/watches.png",
    watches: "/Products/watches.png",
    headphones: "/Products/headphones.png",
    lighting: "/Products/lighting.png",
    "t-shirts": "/Products/tshirt.png",
    tshirts: "/Products/tshirt.png",
    "t-shirt": "/Products/tshirt.png",
    shirts: "/Products/shirt.png",
    jeans: "/Products/jeans.png",
    dresses: "/Products/dress.png",
    "mobile phones": "/Products/mobile.png",
    mobiles: "/Products/mobile.png",
    smartphones: "/Products/mobile.png",
    refrigerators: "/Products/refrigerator.png",
    "air conditioners": "/Products/ac.png",
    "microwave ovens": "/Products/microwave.png",
    washing: "/Products/washing-machine.png",
    "washing machines": "/Products/washing-machine.png",
    gaming: "/Products/gaming.png",
    "gaming laptops": "/Products/gaming.png",
    "sports & fitness": "/Products/sports.png",
  };

  if (imageMap[subCategory]) {
    return imageMap[subCategory];
  }

  // Backend/local filename such as "laptop.png"
  if (typeof directImage === "string" && directImage.trim()) {
    const value = directImage.trim();

    if (value.startsWith("/")) {
      return value;
    }

    return `/Products/${value}`;
  }

  return "/Products/fallback.jpg";
};


const Navbar = () => {
  const navigate = useNavigate();

  // ================= STATES =================

  const [count, setCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // AUTHENTICATION STATES

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ================= CART COUNT =================

  const updateCartCount = () => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const totalQuantity = cart.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 1),
      0
    );

    setCount(totalQuantity);
  };

  // ================= WISHLIST COUNT =================

  const updateWishlistCount = () => {
    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    setWishlistCount(wishlist.length);
  };

  // ================= AUTH STATUS =================

  const updateAuthStatus = () => {
    const loginStatus =
      localStorage.getItem("isLoggedIn") === "true";

    let savedUser = null;

    try {
      savedUser =
        JSON.parse(
          localStorage.getItem("loggedInUser")
        );
    } catch (error) {
      console.error(
        "Could not parse logged-in user:",
        error
      );
    }

    setIsLoggedIn(loginStatus);

    setLoggedInUser(
      loginStatus && savedUser
        ? savedUser
        : null
    );
  };

  // ================= LOAD PRODUCTS =================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data =
          await getProducts();

        if (Array.isArray(data)) {
          const validProducts =
            data.filter(
              (item) =>
                item &&
                item.id !== undefined &&
                item.name
            );

          setAllProducts(
            validProducts
          );
        } else {
          setAllProducts([]);
        }
      } catch (error) {
        console.error(
          "Navbar Products Loading Error:",
          error
        );

        setAllProducts([]);
      }
    };

    loadProducts();
  }, []);

  // ================= CART + WISHLIST + AUTH EVENTS =================

  useEffect(() => {
    // Initial load
    updateCartCount();
    updateWishlistCount();
    updateAuthStatus();

    // Storage event
    const handleStorageChange = () => {
      updateCartCount();
      updateWishlistCount();
      updateAuthStatus();
    };

    // Custom app event
    const handleCartChanged = () => {
      updateCartCount();
    };

    const handleWishlistChanged = () => {
      updateWishlistCount();
    };

    const handleAuthChanged = () => {
      updateAuthStatus();
      updateCartCount();
      updateWishlistCount();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "cartChanged",
      handleCartChanged
    );

    window.addEventListener(
      "wishlistChanged",
      handleWishlistChanged
    );

    window.addEventListener(
      "authChanged",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "cartChanged",
        handleCartChanged
      );

      window.removeEventListener(
        "wishlistChanged",
        handleWishlistChanged
      );

      window.removeEventListener(
        "authChanged",
        handleAuthChanged
      );
    };
  }, []);

  // ================= PROFILE MENU =================

  const handleProfileClick = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    setShowProfileMenu(false);


    localStorage.removeItem(
      "loggedInUser"
    );

    localStorage.removeItem(
      "isLoggedIn"
    );

    setIsLoggedIn(false);
    setLoggedInUser(null);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login");
  };

  // ================= SEARCH SUBMIT =================

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue =
      search.trim();

    if (!searchValue) {
      navigate("/products");
      return;
    }

    setShowSuggestions(false);

    navigate(
      `/products?search=${encodeURIComponent(
        searchValue
      )}`
    );
  };

  // ================= GET WORDS =================

  const getWords = (text = "") => {
    return String(text)
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  // ================= SEARCH SUGGESTIONS =================
  // SMART SEARCH

  const handleInputChange = (e) => {
    const value =
      e.target.value;

    setSearch(value);

    const searchValue =
      value.trim().toLowerCase();

    // Empty search

    if (!searchValue) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // ====================================================
    // EXTRACT MAX PRICE
    // ====================================================

    let maxPrice = null;

    const pricePattern =
      /(?:under|below|less than|upto|up to)\s*₹?\s*([\d,]+)/i;

    const priceMatch =
      searchValue.match(
        pricePattern
      );

    if (priceMatch) {
      const priceValue =
        priceMatch[1].replace(
          /,/g,
          ""
        );

      const parsedPrice =
        Number(priceValue);

      if (!Number.isNaN(parsedPrice)) {
        maxPrice =
          parsedPrice;
      }
    }

    // ====================================================
    // REMOVE PRICE PART
    // ====================================================

    const keywordText =
      searchValue
        .replace(
          /(?:under|below|less than|upto|up to)\s*₹?\s*[\d,]+/i,
          ""
        )
        .trim();

    // ====================================================
    // COMMON WORDS TO IGNORE
    // ====================================================

    const ignoredWords = [
      "show",
      "me",
      "find",
      "best",
      "products",
      "product",
      "please",
      "give",
      "some",
      "the",
      "for",
      "with",
      "and",
    ];

    // ====================================================
    // GET SEARCH KEYWORDS
    // ====================================================

    const searchWords =
      keywordText
        .split(/\s+/)
        .map(
          (word) =>
            word.trim()
        )
        .filter(
          (word) =>
            word.length > 1
        )
        .filter(
          (word) =>
            !ignoredWords.includes(
              word
            )
        );

    // ====================================================
    // SEARCH PRODUCTS
    // ====================================================

    const result =
      allProducts
        .map((item) => {
          const name =
            item?.name?.toLowerCase() ||
            "";

          const brand =
            item?.brand?.toLowerCase() ||
            "";

          const category = (
            item?.categoryName ||
            item?.category ||
            ""
          ).toLowerCase();

          const subCategory = (
            item?.subCategoryName ||
            item?.subCategory ||
            ""
          ).toLowerCase();

          const description =
            item?.description?.toLowerCase() ||
            "";

          const searchableText =
            `${name} ${brand} ${category} ${subCategory} ${description}`;

          // ==================================================
          // PRICE FILTER
          // ==================================================

          if (
            maxPrice !== null &&
            Number(item?.price || 0) >
              maxPrice
          ) {
            return null;
          }

          // ==================================================
          // NO KEYWORD
          // ==================================================

          if (
            searchWords.length === 0
          ) {
            return {
              product: item,
              score: 1,
            };
          }

          // ==================================================
          // KEYWORD MATCH
          // ==================================================

          const matches =
            searchWords.every(
              (word) =>
                searchableText.includes(
                  word
                )
            );

          if (!matches) {
            return null;
          }

          // ==================================================
          // RANKING
          // ==================================================

          let score = 0;

          searchWords.forEach(
            (word) => {
              if (
                name.includes(word)
              ) {
                score += 50;
              }

              if (
                brand.includes(word)
              ) {
                score += 40;
              }

              if (
                subCategory.includes(
                  word
                )
              ) {
                score += 35;
              }

              if (
                category.includes(word)
              ) {
                score += 30;
              }

              if (
                description.includes(
                  word
                )
              ) {
                score += 10;
              }
            }
          );

          return {
            product: item,
            score,
          };
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.score - a.score
        )
        .map(
          (item) =>
            item.product
        );

    // ====================================================
    // TOP 8 SUGGESTIONS
    // ====================================================

    setSuggestions(
      result.slice(0, 8)
    );

    setShowSuggestions(true);

    // DEBUG

    console.log(
      "NAVBAR SMART SEARCH:",
      {
        query: searchValue,
        keywords: searchWords,
        maxPrice,
        results: result.length,
      }
    );
  };

  // ================= SUGGESTION CLICK =================

  const handleSuggestionClick = (
    item
  ) => {
    setSearch(
      item.name || ""
    );

    setSuggestions([]);
    setShowSuggestions(false);

    navigate(
      `/product/${item.id}`
    );
  };

  // ================= RETURN =================

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">

        {/* ================= LOGO ================= */}

        <Link
          className="navbar-brand fw-bold fs-4"
          to="/"
        >
          ShopSphere 🛍️
        </Link>

        {/* ================= MOBILE TOGGLER ================= */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >

          {/* ================= SEARCH BAR ================= */}

          <form
            className="d-flex mx-auto my-2 my-lg-0 position-relative"
            style={{
              width: "48%",
              maxWidth: "700px",
            }}
            onSubmit={handleSearch}
          >
            <input
              className="form-control"
              type="search"
              placeholder="Search for Products, Brands and More"
              value={search}
              onChange={
                handleInputChange
              }
              onFocus={() => {
                if (
                  search.trim() &&
                  suggestions.length > 0
                ) {
                  setShowSuggestions(
                    true
                  );
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(
                    false
                  );
                }, 200);
              }}
            />

            <button
              className="btn btn-light ms-2"
              type="submit"
            >
              Search
            </button>

            {/* ================= SEARCH DROPDOWN ================= */}

            {showSuggestions && (
              <div
                className="position-absolute bg-white shadow-lg rounded-3"
                style={{
                  top:
                    "calc(100% + 8px)",
                  left: 0,
                  width:
                    "calc(100% - 85px)",
                  zIndex: 9999,
                  maxHeight: "450px",
                  overflowY: "auto",
                }}
              >
                {suggestions.length ===
                0 ? (
                  <div className="p-4 text-center">

                    <div className="fw-semibold text-dark">
                      No Products Found
                    </div>

                    <small className="text-muted">
                      Try searching with another keyword
                    </small>

                  </div>
                ) : (
                  suggestions.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="p-3 border-bottom"
                        style={{
                          cursor:
                            "pointer",
                        }}
                        onMouseDown={() =>
                          handleSuggestionClick(
                            item
                          )
                        }
                      >
                        <div className="d-flex align-items-center gap-3">

                          <img
                            src={getSearchProductImage(item)}
                            alt={
                              item?.name ||
                              "Product"
                            }
                            style={{
                              width:
                                "70px",
                              height:
                                "70px",
                              objectFit:
                                "contain",
                              flexShrink: 0,
                              borderRadius:
                                "8px",
                              backgroundColor:
                                "#f8f9fa",
                            }}
                            onError={(
                              e
                            ) => {
                              e.currentTarget.onerror =
                                null;

                              e.currentTarget.src =
                                "/Products/fallback.jpg";
                            }}
                          />

                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <div
                              className="fw-semibold text-dark text-truncate"
                              title={
                                item.name
                              }
                            >
                              {item.name}
                            </div>

                            <small className="text-muted">
                              {item?.brand ||
                                item?.categoryName ||
                                item?.category ||
                                "ShopSphere"}

                              {(item?.subCategoryName ||
                                item?.subCategory) &&
                                ` • ${
                                  item?.subCategoryName ||
                                  item?.subCategory
                                }`}
                            </small>

                            <div className="text-success fw-bold mt-1">
                              ₹
                              {Number(
                                item?.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </form>

          {/* ================= NAVIGATION ================= */}

          <ul className="navbar-nav ms-auto align-items-lg-center">

            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/products"
              >
                Products
              </Link>
            </li>

            {/* ================= WISHLIST ================= */}

            <li className="nav-item">
              <Link
                className="nav-link text-white position-relative"
                to="/wishlist"
              >
                ❤️ Wishlist

                {wishlistCount > 0 && (
                  <span className="badge rounded-pill bg-danger ms-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </li>

            {/* ================= ORDERS ================= */}

            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/orders"
              >
                Orders
              </Link>
            </li>

            {/* ================= CART ================= */}

            <li className="nav-item">
              <Link
                className="nav-link text-white position-relative"
                to="/cart"
              >
                Cart 🛒

                {count > 0 && (
                  <span className="badge rounded-pill bg-danger ms-1">
                    {count}
                  </span>
                )}
              </Link>
            </li>

            {/* ================= NOT LOGGED IN ================= */}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}

            {/* ================= LOGGED IN ================= */}

            {isLoggedIn &&
              loggedInUser && (
                <>

                  {/* USER PROFILE DROPDOWN */}

                  <li
                    className="nav-item position-relative ms-lg-2"
                    style={{ listStyle: "none" }}
                  >
                    <button
                      type="button"
                      className="btn btn-link nav-link text-white fw-bold text-decoration-none d-flex align-items-center gap-1"
                      onClick={handleProfileClick}
                      style={{
                        border: "none",
                        background: "transparent",
                      }}
                    >
                      👤{" "}
                      {loggedInUser?.name ||
                        loggedInUser?.username ||
                        loggedInUser?.fullName ||
                        "User"}
                      <span style={{ fontSize: "11px" }}>
                        {showProfileMenu ? "▲" : "▼"}
                      </span>
                    </button>

                    {showProfileMenu && (
                      <div
                        className="position-absolute bg-white shadow-lg rounded-3 border"
                        style={{
                          top: "calc(100% + 8px)",
                          right: 0,
                          width: "220px",
                          zIndex: 10000,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          className="px-3 py-3 border-bottom"
                          style={{ background: "#f8f9fa" }}
                        >
                          <div className="fw-bold text-dark">
                            👤{" "}
                            {loggedInUser?.name ||
                              loggedInUser?.username ||
                              loggedInUser?.fullName ||
                              "User"}
                          </div>
                          <small className="text-muted">
                            My Account
                          </small>
                        </div>

                        <button
                          type="button"
                          className="dropdown-item px-3 py-2"
                          onClick={() => {
                            closeProfileMenu();
                            navigate("/profile");
                          }}
                        >
                          👤 My Profile
                        </button>

                        <button
                          type="button"
                          className="dropdown-item px-3 py-2"
                          onClick={() => {
                            closeProfileMenu();
                            navigate("/orders");
                          }}
                        >
                          📦 My Orders
                        </button>

                        <button
                          type="button"
                          className="dropdown-item px-3 py-2"
                          onClick={() => {
                            closeProfileMenu();
                            navigate("/wishlist");
                          }}
                        >
                          ❤️ Wishlist
                        </button>

                        <button
                          type="button"
                          className="dropdown-item px-3 py-2"
                          onClick={() => {
                            closeProfileMenu();
                            navigate("/cart");
                          }}
                        >
                          🛒 My Cart
                        </button>

                        <div className="border-top" />

                        <button
                          type="button"
                          className="dropdown-item px-3 py-2 text-danger fw-semibold"
                          onClick={handleLogout}
                        >
                          🚪 Logout
                        </button>
                      </div>
                    )}
                  </li>

                </>
              )}

          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;