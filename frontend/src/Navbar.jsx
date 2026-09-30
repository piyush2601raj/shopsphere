import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "./dataService";

// ============================================================
// GUARANTEED FALLBACK IMAGE
// ============================================================

const createFallbackImage = (item = {}) => {
  const name = String(item?.name || "Product")
    .replace(/[<>&"]/g, "")
    .slice(0, 22);

  const subCategory = String(
    item?.subCategoryName ||
      item?.subCategory ||
      item?.subcategoryName ||
      item?.subcategory ||
      item?.categoryName ||
      item?.category ||
      "Product"
  )
    .replace(/[<>&"]/g, "")
    .slice(0, 22);

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="140"
      viewBox="0 0 140 140"
    >
      <rect
        width="140"
        height="140"
        rx="12"
        fill="#f4f6f8"
      />

      <rect
        x="35"
        y="30"
        width="70"
        height="52"
        rx="5"
        fill="#d9dee5"
        stroke="#8b95a3"
        stroke-width="2"
      />

      <rect
        x="41"
        y="36"
        width="58"
        height="40"
        rx="2"
        fill="#ffffff"
      />

      <path
        d="M25 91 L115 91 L106 101 L34 101 Z"
        fill="#aab2bd"
      />

      <circle
        cx="70"
        cy="56"
        r="9"
        fill="#0d6efd"
      />

      <text
        x="70"
        y="120"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="10"
        font-weight="600"
        fill="#343a40"
      >
        ${name}
      </text>

      <text
        x="70"
        y="133"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="8"
        fill="#6c757d"
      >
        ${subCategory}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

// ============================================================
// NORMALIZE IMAGE URL
// ============================================================

const normalizeImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return null;
  }

  const value = image.trim();

  if (!value) {
    return null;
  }

  // External URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  // Don't use Vite source paths directly
  if (
    value.startsWith("/src/") ||
    value.startsWith("src/")
  ) {
    return null;
  }

  // Public path
  if (value.startsWith("/")) {
    return value;
  }

  // Database filename
  return `/Products/${value}`;
};

// ============================================================
// SUBCATEGORY IMAGE MAP
// ============================================================

const imageMap = {
  Laptop: "laptop.png",
  Mobile: "mobile.png",
  Monitor: "monitor.png",
  Mouse: "mouse.png",
  Keyboard: "keyboard.png",
  Tablet: "tablet.png",

  "Smart Watch": "smartwatch.png",
  Smartwatch: "smartwatch.png",

  "T-Shirts": "tshirt.png",
  TShirts: "tshirt.png",
  "T-Shirt": "tshirt.png",

  Shirts: "shirt.png",
  Jeans: "jeans.png",
  Shoes: "shoes.png",
  Dresses: "dress.png",
  Hoodies: "hoodie.png",
  Jackets: "jacket.png",

  Handbags: "handbag.png",
  Handbag: "handbag.png",

  Belts: "belts.png",
  Caps: "caps.png",
  Jewellery: "jewellery.png",
  Perfumes: "perfumes.png",

  Sunglasses: "sunglasses.png",
  Sunglasses: "sunglasses.png",

  Luggage: "luggage.png",

  Fiction: "fiction.png",
  Biography: "biography.png",
  Business: "business.png",
  Children: "children.png",
  Comics: "comics.png",
  Education: "education.png",
  Religion: "religion.png",
  "Self Help": "selfhelp.png",

  Furniture: "furniture.png",
  Chair: "chair.png",
  Bedding: "bedding.png",
  Decor: "decor.png",
  Kitchen: "kitchen.png",
  Cookware: "cookware.png",
  Cleaning: "cleaning.png",
  Storage: "storage.png",

  "Air Conditioner": "airconditioner.png",
  Appliances: "appliances.png",
  Geyser: "geyser.png",
  Microwave: "microwave.png",
  Refrigerator: "refrigerator.png",
  Television: "television.png",
  "Vacuum Cleaner": "vacuumcleaner.png",

  Console: "console.png",
  Controller: "controller.png",
  Headset: "headset.png",
  VR: "vr.png",

  Cricket: "cricket.png",
  Cycling: "cycling.png",
  Football: "football.png",
  Gym: "gym.png",
  Running: "running.png",
  Swimming: "swimming.png",
};

// ============================================================
// GET SUBCATEGORY IMAGE
// ============================================================

const getSubCategoryImage = (item) => {
  const rawSubCategory =
    item?.subCategoryName ||
    item?.subcategoryName ||
    item?.subCategory?.name ||
    item?.subcategory?.name ||
    item?.subCategory ||
    "";

  const subCategory = String(rawSubCategory)
    .trim()
    .toLowerCase();

  const matchedKey = Object.keys(imageMap).find(
    (key) =>
      key.toLowerCase() === subCategory
  );

  if (matchedKey) {
    return `/Products/${imageMap[matchedKey]}`;
  }

  return "/Products/fallback.jpg";
};

// ============================================================
// GET PRODUCT IMAGE
//
// PRIORITY:
//
// 1. product.image
// 2. product.imageUrl
// 3. product-name related Bing image
// 4. subcategory image
// 5. guaranteed SVG
// ============================================================

const getSearchProductImage = (item) => {
  if (!item) {
    return createFallbackImage({});
  }

  const existingImage = normalizeImageUrl(
    item?.image || item?.imageUrl
  );

  if (existingImage) {
    return existingImage;
  }

  // Product-specific image based on product name
  const productName =
    item?.name || "product";

  return (
    `https://tse2.mm.bing.net/th?q=` +
    `${encodeURIComponent(productName)}` +
    `&w=700&h=700&c=7&rs=1&p=0`
  );
};

// ============================================================
// NAVBAR
// ============================================================

const Navbar = () => {
  const navigate = useNavigate();

  const [count, setCount] = useState(0);

  const [wishlistCount, setWishlistCount] =
    useState(0);

  const [search, setSearch] =
    useState("");

  const [allProducts, setAllProducts] =
    useState([]);

  const [suggestions, setSuggestions] =
    useState([]);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [loggedInUser, setLoggedInUser] =
    useState(null);

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  // ==========================================================
  // CART COUNT
  // ==========================================================

  const updateCartCount = () => {
    try {
      const cart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      const totalQuantity =
        cart.reduce(
          (sum, item) =>
            sum +
            (Number(item?.quantity) || 1),
          0
        );

      setCount(totalQuantity);
    } catch (error) {
      console.error(
        "Cart count error:",
        error
      );

      setCount(0);
    }
  };

  // ==========================================================
  // WISHLIST COUNT
  // ==========================================================

  const updateWishlistCount = () => {
    try {
      const wishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      setWishlistCount(
        wishlist.length
      );
    } catch (error) {
      console.error(
        "Wishlist count error:",
        error
      );

      setWishlistCount(0);
    }
  };

  // ==========================================================
  // AUTH STATUS
  // ==========================================================

  const updateAuthStatus = () => {
    const loginStatus =
      localStorage.getItem(
        "isLoggedIn"
      ) === "true";

    let savedUser = null;

    try {
      const value =
        localStorage.getItem(
          "loggedInUser"
        );

      if (value) {
        savedUser = JSON.parse(value);
      }
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

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const data =
          await getProducts();

        if (!mounted) {
          return;
        }

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

        if (mounted) {
          setAllProducts([]);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // EVENTS
  // ==========================================================

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();
    updateAuthStatus();

    const handleStorageChange = () => {
      updateCartCount();
      updateWishlistCount();
      updateAuthStatus();
    };

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

  // ==========================================================
  // PROFILE
  // ==========================================================

  const handleProfileClick = () => {
    setShowProfileMenu(
      (prev) => !prev
    );
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    setShowProfileMenu(false);

    localStorage.removeItem(
      "loggedInUser"
    );

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userId"
    );

    setIsLoggedIn(false);
    setLoggedInUser(null);

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login");
  };

  // ==========================================================
  // SEARCH SUBMIT
  // ==========================================================

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue =
      search.trim();

    setShowSuggestions(false);

    if (!searchValue) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        searchValue
      )}`
    );
  };

  // ==========================================================
  // SMART SEARCH
  // ==========================================================

  const handleInputChange = (e) => {
    const value =
      e.target.value;

    setSearch(value);

    const searchValue =
      value
        .trim()
        .toLowerCase();

    if (!searchValue) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // ========================================================
    // PRICE DETECTION
    // ========================================================

    let maxPrice = null;

    const pricePattern =
      /(?:under|below|less than|upto|up to|within|max|maximum)\s*₹?\s*([\d,]+)/i;

    const priceMatch =
      searchValue.match(
        pricePattern
      );

    if (priceMatch) {
      const parsedPrice =
        Number(
          priceMatch[1].replace(
            /,/g,
            ""
          )
        );

      if (!Number.isNaN(parsedPrice)) {
        maxPrice = parsedPrice;
      }
    }

    // ========================================================
    // REMOVE PRICE PART
    // ========================================================

    const keywordText =
      searchValue
        .replace(
          /(?:under|below|less than|upto|up to|within|max|maximum)\s*₹?\s*[\d,]+/i,
          ""
        )
        .trim();

    // ========================================================
    // IGNORED WORDS
    // ========================================================

    const ignoredWords = new Set([
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
      "want",
      "need",
      "looking",
      "look",
      "recommend",
      "recommendation",
      "recommendations",
      "suggest",
      "suggestion",
      "suggestions",
      "under",
      "below",
      "less",
      "than",
      "upto",
      "up",
      "to",
      "within",
      "maximum",
      "max",
      "price",
      "rupees",
      "rs",
    ]);

    const searchWords =
      keywordText
        .split(/\s+/)
        .map((word) =>
          word
            .replace(
              /[^\w&-]/g,
              ""
            )
            .trim()
        )
        .filter(Boolean)
        .filter(
          (word) =>
            !ignoredWords.has(word)
        );

    // ========================================================
    // PRICE ONLY
    // ========================================================

    if (
      searchWords.length === 0 &&
      maxPrice === null
    ) {
      setSuggestions([]);
      setShowSuggestions(true);
      return;
    }

    // ========================================================
    // SEARCH + RANK
    // ========================================================

    const result =
      allProducts
        .map((item) => {
          const name =
            String(
              item?.name || ""
            ).toLowerCase();

          const brand =
            String(
              item?.brand || ""
            ).toLowerCase();

          const category =
            String(
              item?.categoryName ||
                item?.category ||
                ""
            ).toLowerCase();

          const subCategory =
            String(
              item?.subCategoryName ||
                item?.subCategory ||
                item?.subcategoryName ||
                item?.subcategory ||
                ""
            ).toLowerCase();

          const description =
            String(
              item?.description ||
                ""
            ).toLowerCase();

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
          // PRICE ONLY
          // ==================================================

          if (
            searchWords.length === 0
          ) {
            return {
              product: item,
              score: 1,
              matchedWords: 0,
            };
          }

          let score = 0;
          let matchedWords = 0;

          // ==================================================
          // WORD MATCH
          // ==================================================

          searchWords.forEach(
            (word) => {
              let matched = false;

              if (
                name.includes(word)
              ) {
                score += 100;
                matched = true;
              }

              if (
                brand.includes(word)
              ) {
                score += 80;
                matched = true;
              }

              if (
                subCategory.includes(
                  word
                )
              ) {
                score += 70;
                matched = true;
              }

              if (
                category.includes(
                  word
                )
              ) {
                score += 60;
                matched = true;
              }

              if (
                description.includes(
                  word
                )
              ) {
                score += 20;
                matched = true;
              }

              if (matched) {
                matchedWords++;
              }
            }
          );

          // ==================================================
          // ALL SEARCH WORDS MUST MATCH
          // ==================================================

          if (
            matchedWords !==
            searchWords.length
          ) {
            return null;
          }

          // ==================================================
          // EXACT PHRASE BONUS
          // ==================================================

          if (
            keywordText.length > 1 &&
            searchableText.includes(
              keywordText
            )
          ) {
            score += 200;
          }

          // ==================================================
          // STARTS WITH BONUS
          // ==================================================

          searchWords.forEach(
            (word) => {
              if (
                name.startsWith(word)
              ) {
                score += 50;
              }

              if (
                brand.startsWith(word)
              ) {
                score += 40;
              }
            }
          );

          return {
            product: item,
            score,
            matchedWords,
          };
        })
        .filter(Boolean)
        .sort((a, b) => {
          if (
            b.matchedWords !==
            a.matchedWords
          ) {
            return (
              b.matchedWords -
              a.matchedWords
            );
          }

          return (
            b.score -
            a.score
          );
        })
        .map(
          (item) =>
            item.product
        );

    setSuggestions(
      result.slice(0, 8)
    );

    setShowSuggestions(true);

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

  // ==========================================================
  // SUGGESTION CLICK
  // ==========================================================

  const handleSuggestionClick = (
    item
  ) => {
    if (!item?.id) {
      return;
    }

    setSearch(
      item?.name || ""
    );

    setSuggestions([]);
    setShowSuggestions(false);

    navigate(
      `/product/${item.id}`
    );
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          className="navbar-brand fw-bold fs-4"
          to="/"
        >
          ShopSphere 🛍️
        </Link>

        {/* ==================================================
            MOBILE TOGGLER
        ================================================== */}

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

          {/* ==================================================
              SEARCH
          ================================================== */}

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
              onChange={handleInputChange}
              onFocus={() => {
                if (search.trim()) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 250);
              }}
            />

            <button
              className="btn btn-light ms-2"
              type="submit"
            >
              Search
            </button>

            {/* ==================================================
                SEARCH DROPDOWN
            ================================================== */}

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

                {suggestions.length === 0 ? (

                  <div className="p-4 text-center">

                    <div className="fw-semibold text-dark">
                      No Products Found
                    </div>

                    <small className="text-muted">
                      Try another product,
                      brand or category
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

                          {/* ==================================================
                              PRODUCT IMAGE
                          ================================================== */}

                          <img
                            src={getSearchProductImage(
                              item
                            )}
                            alt={
                              item?.name ||
                              "Product"
                            }
                            title={
                              item?.name ||
                              "Product"
                            }
                            loading="lazy"
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "contain",
                              flexShrink: 0,
                              borderRadius: "8px",
                              backgroundColor:
                                "#f8f9fa",
                              padding: "4px",
                            }}
                            onError={(event) => {
                              const img =
                                event.currentTarget;

                              // ----------------------------------------------
                              // EXISTING IMAGE FAILED
                              // -> PRODUCT NAME IMAGE
                              // ----------------------------------------------

                              if (
                                !img.dataset
                                  .bingFallback
                              ) {
                                img.dataset
                                  .bingFallback =
                                  "true";

                                img.src =
                                  `https://tse2.mm.bing.net/th?q=${encodeURIComponent(
                                    item?.name ||
                                      "product"
                                  )}&w=700&h=700&c=7&rs=1&p=0`;

                                return;
                              }

                              // ----------------------------------------------
                              // BING FAILED
                              // -> SUBCATEGORY IMAGE
                              // ----------------------------------------------

                              if (
                                !img.dataset
                                  .subcategoryFallback
                              ) {
                                img.dataset
                                  .subcategoryFallback =
                                  "true";

                                img.src =
                                  getSubCategoryImage(
                                    item
                                  );

                                return;
                              }

                              // ----------------------------------------------
                              // FINAL GUARANTEED FALLBACK
                              // ----------------------------------------------

                              img.onerror = null;

                              img.src =
                                createFallbackImage(
                                  item
                                );
                            }}
                          />

                          {/* ==================================================
                              PRODUCT INFORMATION
                          ================================================== */}

                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >

                            <div
                              className="fw-semibold text-dark text-truncate"
                              title={
                                item?.name
                              }
                            >
                              {item?.name ||
                                "Product"}
                            </div>

                            <small className="text-muted">

                              {item?.brand ||
                                item?.categoryName ||
                                item?.category ||
                                "ShopSphere"}

                              {(item?.subCategoryName ||
                                item?.subCategory ||
                                item?.subcategoryName ||
                                item?.subcategory) &&
                                ` • ${
                                  item?.subCategoryName ||
                                  item?.subCategory ||
                                  item?.subcategoryName ||
                                  item?.subcategory
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

          {/* ==================================================
              NAVIGATION
          ================================================== */}

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

            {/* ==================================================
                WISHLIST
            ================================================== */}

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

            {/* ==================================================
                ORDERS
            ================================================== */}

            <li className="nav-item">
              <Link
                className="nav-link text-white"
                to="/orders"
              >
                Orders
              </Link>
            </li>

            {/* ==================================================
                CART
            ================================================== */}

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

            {/* ==================================================
                LOGIN
            ================================================== */}

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

            {/* ==================================================
                LOGGED IN USER
            ================================================== */}

            {isLoggedIn &&
              loggedInUser && (
                <li
                  className="nav-item position-relative ms-lg-2"
                  style={{
                    listStyle: "none",
                  }}
                >

                  <button
                    type="button"
                    className="btn btn-link nav-link text-white fw-bold text-decoration-none d-flex align-items-center gap-1"
                    onClick={
                      handleProfileClick
                    }
                    style={{
                      border: "none",
                      background:
                        "transparent",
                    }}
                  >
                    👤{" "}
                    {loggedInUser?.name ||
                      loggedInUser?.username ||
                      loggedInUser?.fullName ||
                      "User"}

                    <span
                      style={{
                        fontSize: "11px",
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div
                      className="position-absolute bg-white shadow rounded-3 p-2"
                      style={{
                        right: 0,
                        top:
                          "calc(100% + 5px)",
                        minWidth: "170px",
                        zIndex: 10000,
                      }}
                    >

                      <div className="px-3 py-2 border-bottom">

                        <div className="fw-bold text-dark">
                          {loggedInUser?.name ||
                            loggedInUser?.username ||
                            "User"}
                        </div>

                        {loggedInUser?.email && (
                          <small className="text-muted">
                            {
                              loggedInUser.email
                            }
                          </small>
                        )}

                      </div>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100 mt-2"
                        onClick={
                          handleLogout
                        }
                      >
                        Logout
                      </button>

                    </div>
                  )}

                </li>
              )}

          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;