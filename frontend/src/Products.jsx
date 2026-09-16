import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getProducts,
  searchProducts
} from "./dataService";
import ProductCard from "./ProductCard";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // URL PARAMETERS
  // ========================================

  const query = new URLSearchParams(location.search);

  const search = query.get("search") || "";
  const urlCategory = query.get("category") || "";

  // ========================================
  // LOAD PRODUCTS
  // ========================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
       
      const data = search.trim()
  ? await searchProducts(search)
  : await getProducts();
        console.log("Products API Data =", data);

        if (Array.isArray(data)) {
          // Keep the existing product structure/UI intact, but make sure
          // React never receives a Date/object as the product name.
          const validProducts = data
            .filter(
              (product) =>
                product &&
                product.id !== undefined
            )
            .map((product) => {
              let safeName = "";

              if (typeof product.name === "string") {
                safeName = product.name.trim();
              } else if (
                typeof product.productName === "string"
              ) {
                // Safe fallback if an API/local record uses productName.
                safeName = product.productName.trim();
              }

              if (!safeName) {
                return null;
              }

              return {
                ...product,
                name: safeName,
              };
            })
            .filter(Boolean);

          setProducts(validProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error Loading Products =", err);

        setProducts([]);

        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ========================================
  // SET CATEGORY FROM URL
  // ========================================

  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory("");
    }

    setCurrentPage(1);
  }, [urlCategory]);

  // ========================================
  // FILTER + SEARCH + SORT
  // ========================================

  const filteredProducts = useMemo(() => {
    let data = [...products];

    // ========================================
    // SMART SEARCH
    // ========================================

    if (search.trim()) {
      const searchText = search.trim().toLowerCase();

      // Extract maximum price
      let searchMaxPrice = null;

      const underMatch = searchText.match(
        /(?:under|below|less than|upto|up to)\s*₹?\s*([\d,]+)/i
      );

      if (underMatch) {
        searchMaxPrice = Number(
          underMatch[1].replace(/,/g, "")
        );
      }

      // Remove price condition from search text
      let keywordText = searchText
        .replace(
          /(?:under|below|less than|upto|up to)\s*₹?\s*[\d,]+/gi,
          ""
        )
        .trim();

      // Remove currency/extra symbols
      keywordText = keywordText
        .replace(/₹/g, "")
        .trim();

      const searchWords = keywordText
        .split(/\s+/)
        .filter(
          (word) =>
            word.length > 1 &&
            ![
              "show",
              "me",
              "find",
              "best",
              "products",
              "product",
              "please",
              "give",
              "some",
              "the"
            ].includes(word)
        );

      data = data.filter((product) => {
        const name =
          product?.name?.toLowerCase() || "";

        const brand =
          product?.brand?.toLowerCase() || "";

        const productCategory =
          (
            product?.categoryName ||
            product?.category ||
            ""
          ).toLowerCase();

        const subCategory =
          (
            product?.subCategoryName ||
            product?.subCategory ||
            ""
          ).toLowerCase();

        const description =
          product?.description?.toLowerCase() || "";

        const searchableText = `
          ${name}
          ${brand}
          ${productCategory}
          ${subCategory}
          ${description}
        `.toLowerCase();

        // All important words should match
        const keywordMatches =
          searchWords.length === 0 ||
          searchWords.every((word) =>
            searchableText.includes(word)
          );

        // Price condition
        const priceMatches =
          searchMaxPrice === null ||
          Number(product?.price || 0) <= searchMaxPrice;

        return keywordMatches && priceMatches;
      });
    }

    // ========================================
    // CATEGORY
    // ========================================

    if (category) {
      data = data.filter((product) => {
        const productCategory =
          product?.categoryName ||
          product?.category ||
          "";

        return (
          productCategory.toLowerCase() ===
          category.toLowerCase()
        );
      });
    }

    // ========================================
    // MIN PRICE
    // ========================================

    if (minPrice !== "") {
      data = data.filter(
        (product) =>
          Number(product?.price || 0) >=
          Number(minPrice)
      );
    }

    // ========================================
    // MAX PRICE
    // ========================================

    if (maxPrice !== "") {
      data = data.filter(
        (product) =>
          Number(product?.price || 0) <=
          Number(maxPrice)
      );
    }

    // ========================================
    // RATING
    // ========================================

    if (rating) {
      data = data.filter(
        (product) =>
          Number(product?.rating || 0) >=
          Number(rating)
      );
    }

    // ========================================
    // SORTING
    // ========================================

    if (sort === "low") {
      data.sort(
        (a, b) =>
          Number(a?.price || 0) -
          Number(b?.price || 0)
      );
    }

    if (sort === "high") {
      data.sort(
        (a, b) =>
          Number(b?.price || 0) -
          Number(a?.price || 0)
      );
    }

    if (sort === "rating") {
      data.sort(
        (a, b) =>
          Number(b?.rating || 0) -
          Number(a?.rating || 0)
      );
    }

    return data;
  }, [
    products,
    search,
    category,
    minPrice,
    maxPrice,
    rating,
    sort,
  ]);

  // ========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    rating,
    sort,
  ]);

  // ========================================
  // PAGINATION
  // ========================================

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const lastProductIndex =
    currentPage * PRODUCTS_PER_PAGE;

  const firstProductIndex =
    lastProductIndex - PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    firstProductIndex,
    lastProductIndex
  );

  // ========================================
  // CHANGE PAGE
  // ========================================

  const changePage = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // PAGE NUMBERS
  // ========================================

  const getPageNumbers = () => {
    const pages = [];

    let startPage = Math.max(
      1,
      currentPage - 2
    );

    let endPage = Math.min(
      totalPages,
      currentPage + 2
    );

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(
        1,
        totalPages - 4
      );
    }

    for (
      let i = startPage;
      i <= endPage;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  // ========================================
  // CATEGORY CHANGE
  // ========================================

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setCategory(selectedCategory);

    if (selectedCategory) {
      navigate(
        `/products?category=${encodeURIComponent(
          selectedCategory
        )}`
      );
    } else {
      navigate("/products");
    }
  };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setCategory("");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setCurrentPage(1);

    navigate("/products");
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "600px" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          />

          <h5>Loading Products...</h5>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div
        className="container text-center py-5"
        style={{ minHeight: "600px" }}
      >
        <h2 className="fw-bold">
          Products Could Not Be Loaded
        </h2>

        <p className="text-muted">
          {error}
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div
      className="container-fluid px-3 px-lg-5 py-5"
      style={{
        minHeight: "700px",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* HEADER */}

      <div className="mb-4">
        <h1 className="fw-bold mb-2">
          {search
            ? `Search Results for "${search}"`
            : category
            ? `${category} Products`
            : "All Products"}
        </h1>

        <p className="text-muted">
          Discover the best products across all categories
        </p>
      </div>

      <div className="row g-4">

        {/* ========================================
            FILTER SIDEBAR
        ======================================== */}

        <div className="col-lg-3">
          <div
            className="card border-0 shadow-sm rounded-4 p-4"
            style={{
              position: "sticky",
              top: "100px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">
                Filters
              </h4>

              {(category ||
                sort ||
                search ||
                minPrice ||
                maxPrice ||
                rating) && (
                <button
                  type="button"
                  className="btn btn-link text-danger text-decoration-none p-0"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* CATEGORY */}

            <div className="mb-4">
              <label className="fw-semibold mb-2">
                Category
              </label>

              <select
                className="form-select"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">
                  All Categories
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Books">
                  Books
                </option>

                <option value="Home & Kitchen">
                  Home & Kitchen
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Home Appliances">
                  Home Appliances
                </option>

                <option value="Gaming">
                  Gaming
                </option>

                <option value="Sports & Fitness">
                  Sports & Fitness
                </option>
              </select>
            </div>

            <hr />

            {/* PRICE */}

            <div className="mb-4">
              <label className="fw-semibold mb-2">
                Price Range
              </label>

              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    min="0"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(e.target.value)
                    }
                  />
                </div>

                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    min="0"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* RATING */}

            <div className="mb-4">
              <label className="fw-semibold mb-2">
                Minimum Rating
              </label>

              <select
                className="form-select"
                value={rating}
                onChange={(e) =>
                  setRating(e.target.value)
                }
              >
                <option value="">
                  All Ratings
                </option>

                <option value="4">
                  4★ & Above
                </option>

                <option value="3">
                  3★ & Above
                </option>

                <option value="2">
                  2★ & Above
                </option>
              </select>
            </div>

            <hr />

            {/* SORT */}

            <div>
              <label className="fw-semibold mb-2">
                Sort By
              </label>

              <select
                className="form-select"
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
              >
                <option value="">
                  Recommended
                </option>

                <option value="rating">
                  Highest Rating
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================
            PRODUCTS
        ======================================== */}

        <div className="col-lg-9">

          {/* RESULTS BAR */}

          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

              <h5 className="fw-bold mb-0">
                {filteredProducts.length} Products Found
              </h5>

              <span className="text-muted">
                Page {currentPage} of {totalPages || 1}
              </span>

            </div>
          </div>

          {/* NO PRODUCTS */}

          {currentProducts.length === 0 ? (
            <div
              className="card border-0 shadow-sm rounded-4 text-center py-5"
              style={{ minHeight: "400px" }}
            >
              <div className="card-body d-flex flex-column justify-content-center">

                <h2 className="fw-bold">
                  No Products Found
                </h2>

                <p className="text-muted">
                  Try changing your search or filters.
                </p>

                <div>
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={clearFilters}
                  >
                    View All Products
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <>
              {/* PRODUCT GRID */}

              <div className="row g-4">
                {currentProducts.map((product) => (
                  <div
                    className="col-xl-4 col-lg-6 col-md-6"
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* ========================================
                  PAGINATION
              ======================================== */}

              {totalPages > 1 && (
                <nav className="mt-5">
                  <ul className="pagination justify-content-center flex-wrap gap-1">

                    {/* PREVIOUS */}

                    <li
                      className={`page-item ${
                        currentPage === 1
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link rounded-3"
                        onClick={() =>
                          changePage(currentPage - 1)
                        }
                      >
                        Previous
                      </button>
                    </li>

                    {/* FIRST PAGE */}

                    {getPageNumbers()[0] > 1 && (
                      <>
                        <li className="page-item">
                          <button
                            type="button"
                            className="page-link rounded-3"
                            onClick={() =>
                              changePage(1)
                            }
                          >
                            1
                          </button>
                        </li>

                        {getPageNumbers()[0] > 2 && (
                          <li className="page-item disabled">
                            <span className="page-link">
                              ...
                            </span>
                          </li>
                        )}
                      </>
                    )}

                    {/* PAGE NUMBERS */}

                    {getPageNumbers().map(
                      (pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-item ${
                            currentPage === pageNumber
                              ? "active"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="page-link rounded-3"
                            onClick={() =>
                              changePage(pageNumber)
                            }
                          >
                            {pageNumber}
                          </button>
                        </li>
                      )
                    )}

                    {/* LAST PAGE */}

                    {getPageNumbers()[
                      getPageNumbers().length - 1
                    ] < totalPages && (
                      <>
                        {getPageNumbers()[
                          getPageNumbers().length - 1
                        ] <
                          totalPages - 1 && (
                          <li className="page-item disabled">
                            <span className="page-link">
                              ...
                            </span>
                          </li>
                        )}

                        <li className="page-item">
                          <button
                            type="button"
                            className="page-link rounded-3"
                            onClick={() =>
                              changePage(totalPages)
                            }
                          >
                            {totalPages}
                          </button>
                        </li>
                      </>
                    )}

                    {/* NEXT */}

                    <li
                      className={`page-item ${
                        currentPage === totalPages
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link rounded-3"
                        onClick={() =>
                          changePage(currentPage + 1)
                        }
                      >
                        Next
                      </button>
                    </li>

                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;