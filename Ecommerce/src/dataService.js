import { USE_LOCAL_DATA } from "./config";
import { products } from "./data/product";
import subCategoriesData from "./subCategories";
import API from "./axios";

// ======================================================
// HELPERS
// ======================================================

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

// ======================================================
// NORMALIZE IMAGE PATH
// ======================================================

const normalizeImage = (image) => {
  if (!image || typeof image !== "string") {
    return null;
  }

  const value = image.trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `/Products/${value}`;
};

// ======================================================
// GET PRODUCT SUBCATEGORY NAME
// Supports Backend + Local Data Structures
// ======================================================

const getSubCategoryName = (product) => {
  if (!product) return "";

  return (
    product?.subCategoryName ||
    product?.subcategoryName ||
    product?.subCategory?.name ||
    product?.subcategory?.name ||
    (typeof product?.subCategory === "string"
      ? product.subCategory
      : "") ||
    (typeof product?.subcategory === "string"
      ? product.subcategory
      : "")
  );
};

// ======================================================
// GET PRODUCT CATEGORY NAME
// ======================================================

const getCategoryName = (product) => {
  if (!product) return "";

  return (
    product?.categoryName ||
    product?.category?.name ||
    (typeof product?.category === "string"
      ? product.category
      : "")
  );
};

// ======================================================
// FIND LOCAL PRODUCT BY SUBCATEGORY (+ BRAND AWARE)
// ======================================================

const findLocalProductBySubCategory = (backendProduct) => {
  if (!backendProduct) return null;

  const backendSubCategory =
    getSubCategoryName(backendProduct);

  if (!backendSubCategory) {
    return null;
  }

  const backendBrand = normalizeText(
    backendProduct?.brand
  );

  const matchingProducts = products.filter(
    (localProduct) => {
      const localSubCategory =
        getSubCategoryName(localProduct);

      return (
        normalizeText(localSubCategory) ===
        normalizeText(backendSubCategory)
      );
    }
  );

  if (matchingProducts.length === 0) {
    return null;
  }

  // 1. Exact brand match
  if (backendBrand) {
    const brandMatch = matchingProducts.find(
      (item) =>
        normalizeText(item?.brand) ===
        backendBrand
    );

    if (brandMatch) {
      return brandMatch;
    }
  }

  // 2. Rotate by product id
  const index =
    Number(backendProduct?.id || 0) %
    matchingProducts.length;

  return matchingProducts[index];
};

// ======================================================
// MERGE BACKEND PRODUCT WITH LOCAL IMAGE
// ======================================================

const mergeProductImage = (backendProduct) => {
  if (!backendProduct) {
    return backendProduct;
  }

  const subCategoryName =
    getSubCategoryName(backendProduct);

  const localProduct =
    findLocalProductBySubCategory(
      backendProduct
    );

  // Local image
  const localImage =
    normalizeImage(localProduct?.image) ||
    normalizeImage(localProduct?.imageUrl);

  // Backend image
  const backendImage =
    normalizeImage(backendProduct?.image) ||
    normalizeImage(
      backendProduct?.imageUrl
    );

  console.log(
    "MERGING PRODUCT IMAGE:",
    {
      productName: backendProduct?.name,
      brand: backendProduct?.brand,
      subCategoryName,
      localProductFound:
        localProduct?.name,
      localProductBrand:
        localProduct?.brand,
      localImage,
      backendImage,
    }
  );

  // ====================================================
  // FIX: SAFE PRODUCT NAME
  // Prevent React Date/Object rendering error
  // ====================================================

  const backendName =
    typeof backendProduct?.name === "string"
      ? backendProduct.name.trim()
      : "";

  const localName =
    typeof localProduct?.name === "string"
      ? localProduct.name.trim()
      : "";

  const safeProductName =
    backendName ||
    localName ||
    "Product";

  return {
    ...backendProduct,

    // IMPORTANT:
    // Always keep product name as a string
    name: safeProductName,

    categoryName:
      backendProduct?.categoryName ||
      getCategoryName(backendProduct),

    subCategoryName:
      backendProduct?.subCategoryName ||
      subCategoryName,

    image:
      localImage ||
      backendImage ||
      null,

    imageUrl:
      localImage ||
      backendImage ||
      null,
  };
};

// ======================================================
// ALL PRODUCTS
// ======================================================

export const getProducts = async () => {
  if (USE_LOCAL_DATA) {
    return products;
  }

  try {
    const res =
      await API.get("/products/all");

    const backendProducts =
      res?.data?.data || [];

    console.log(
      "BACKEND PRODUCTS:",
      backendProducts
    );

    const mergedProducts =
      backendProducts.map(
        mergeProductImage
      );

    console.log(
      "MERGED PRODUCTS:",
      mergedProducts
    );

    return mergedProducts;

  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return [];
  }
};
// ======================================================
// SUBCATEGORIES
// ======================================================

export const getSubCategories = async (
  categoryId
) => {
  if (USE_LOCAL_DATA) {
    return subCategoriesData.filter(
      (item) =>
        Number(item.categoryId) ===
        Number(categoryId)
    );
  }

  try {
    const res =
      await API.get(
        `/subcategories/category/${categoryId}`
      );

    return (
      res?.data?.data || []
    );

  } catch (error) {
    console.error(
      "GET SUBCATEGORIES ERROR:",
      error
    );

    return [];
  }
};

// ======================================================
// PRODUCTS BY SUBCATEGORY
// ======================================================

export const getProductsBySubCategory = async (
  name
) => {

  if (USE_LOCAL_DATA) {

    return products.filter(
      (item) => {

        const itemSubCategory =
          getSubCategoryName(item);

        return (
          normalizeText(
            itemSubCategory
          ) ===
          normalizeText(name)
        );
      }
    );
  }

  try {

    const res =
      await API.get(
        `/products/subcategory/${encodeURIComponent(
          name
        )}`
      );

    const backendProducts =
      res?.data?.data || [];

    console.log(
      `BACKEND ${name} PRODUCTS:`,
      backendProducts
    );

    const mergedProducts =
      backendProducts.map(
        mergeProductImage
      );

    console.log(
      `MERGED ${name} PRODUCTS:`,
      mergedProducts
    );

    return mergedProducts;

  } catch (error) {

    console.error(
      "GET PRODUCTS BY SUBCATEGORY ERROR:",
      error
    );

    return [];
  }
};
// ======================================================
// PRODUCT BY ID
// ======================================================

export const getProductById = async (
  id
) => {

  if (USE_LOCAL_DATA) {

    return (
      products.find(
        (item) =>
          Number(item.id) ===
          Number(id)
      ) || null
    );
  }

  try {

    const res =
      await API.get(
        `/products/${id}`
      );

    const backendProduct =
      res?.data?.data;

    return mergeProductImage(
      backendProduct
    );

  } catch (error) {

    console.error(
      "GET PRODUCT BY ID ERROR:",
      error
    );

    return null;
  }
};

// ======================================================
// PRODUCTS BY CATEGORY
// ======================================================

export const getProductsByCategory = async (
  categoryName
) => {

  const allProducts =
    await getProducts();

  return allProducts.filter(
    (item) => {

      const itemCategory =
        getCategoryName(item);

      return (
        normalizeText(
          itemCategory
        ) ===
        normalizeText(
          categoryName
        )
      );
    }
  );
};
// ======================================================
// SEARCH PRODUCTS
// SMART SEARCH
//
// Supports:
// laptop
// laptop under 70000
// laptop below 50000
// laptop upto 60000
// dell laptop under 70000
// mobile under 30000
// headphones below 5000
// ======================================================

export const searchProducts = async (
  query
) => {

  if (
    !query ||
    !query.trim()
  ) {
    return [];
  }

  const searchText =
    query
      .trim()
      .toLowerCase();

  // ====================================================
  // EXTRACT MAX PRICE
  // ====================================================

  let maxPrice = null;

  const pricePattern =
    /(?:under|below|less than|upto|up to)\s*₹?\s*([\d,]+)/i;

  const priceMatch =
    searchText.match(
      pricePattern
    );

  if (priceMatch) {

    const priceValue =
      priceMatch[1]
        .replace(/,/g, "");

    const parsedPrice =
      Number(priceValue);

    if (
      !Number.isNaN(
        parsedPrice
      )
    ) {

      maxPrice =
        parsedPrice;
    }
  }

  // ====================================================
  // REMOVE PRICE PART
  //
  // laptop under 70000
  //
  // becomes:
  //
  // laptop
  // ====================================================

  const keywordText =
    searchText
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
  // SEARCH KEYWORDS
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
  // LOCAL DATA MODE
  // ====================================================

  if (USE_LOCAL_DATA) {

    const localResults =
      products.filter(
        (product) => {

          // --------------------------------------------
          // PRICE FILTER
          // --------------------------------------------

          if (
            maxPrice !== null &&
            Number(
              product?.price || 0
            ) > maxPrice
          ) {
            return false;
          }

          // --------------------------------------------
          // IF NO KEYWORD
          // --------------------------------------------

          if (
            searchWords.length === 0
          ) {
            return true;
          }

          // --------------------------------------------
          // PRODUCT FIELDS
          // --------------------------------------------

          const productName =
            product?.name
              ?.toLowerCase() ||
            "";

          const brand =
            product?.brand
              ?.toLowerCase() ||
            "";

          const categoryName =
            getCategoryName(
              product
            ).toLowerCase();

          const subCategoryName =
            getSubCategoryName(
              product
            ).toLowerCase();

          const description =
            product?.description
              ?.toLowerCase() ||
            "";

          // --------------------------------------------
          // SEARCHABLE TEXT
          // --------------------------------------------

          const searchableText =
            `${productName} ${brand} ${categoryName} ${subCategoryName} ${description}`;

          // --------------------------------------------
          // ALL SEARCH WORDS MUST MATCH
          // --------------------------------------------

          return searchWords.every(
            (word) =>
              searchableText.includes(
                word
              )
          );
        }
      );

    console.log(
      "LOCAL SMART SEARCH:",
      {
        query,
        searchWords,
        maxPrice,
        resultCount:
          localResults.length,
      }
    );

    return localResults;
  }

  // ====================================================
  // BACKEND SMART SEARCH
  // ====================================================

  try {

    const res =
      await API.get(
        `/products/search?query=${encodeURIComponent(
          query.trim()
        )}`
      );

    const backendProducts =
      res?.data?.data || [];

    console.log(
      "SMART SEARCH QUERY:",
      query
    );

    console.log(
      "SMART SEARCH KEYWORDS:",
      searchWords
    );

    console.log(
      "SMART SEARCH MAX PRICE:",
      maxPrice
    );

    console.log(
      "SMART SEARCH RESULTS:",
      backendProducts
    );

    // ==================================================
    // KEEP EXISTING IMAGE/CATEGORY HANDLING
    // ==================================================

    const mergedProducts =
      backendProducts.map(
        mergeProductImage
      );

    console.log(
      "MERGED SEARCH RESULTS:",
      mergedProducts
    );

    return mergedProducts;

  } catch (error) {

    console.error(
      "SEARCH PRODUCTS ERROR:",
      error
    );

    return [];
  }
};
// ======================================================
// ADD TO CART
// ======================================================

export const addToCart = async (
  product
) => {

  if (!product?.id) {
    throw new Error("Invalid product");
  }

  // ====================================================
  // LOCAL DATA MODE
  // ====================================================

  if (USE_LOCAL_DATA) {

    let cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const exists =
      cart.find(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    if (exists) {

      exists.quantity =
        (exists.quantity || 1) +
        1;

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

    // Notify Navbar + Cart
    window.dispatchEvent(
      new Event("cartChanged")
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    window.dispatchEvent(
      new Event("storage")
    );

    return {
      success: true,
    };
  }

  // =====================================================
  // GET LOGGED-IN USER ID
  // =====================================================

  let userId =
    localStorage.getItem("userId");

  if (!userId) {

    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser") ||
      localStorage.getItem("loggedInUser");

    if (storedUser) {

      try {

        const parsedUser =
          JSON.parse(storedUser);

        userId =
          parsedUser?.id ??
          parsedUser?.userId ??
          parsedUser?.user?.id ??
          parsedUser?.user?.userId;

      } catch (error) {

        console.error(
          "Could not parse user:",
          error
        );
      }
    }
  }

  // =====================================================
  // USER MUST BE LOGGED IN
  // =====================================================

  if (
    userId === null ||
    userId === undefined ||
    userId === ""
  ) {

    throw new Error(
      "Please login before adding products to cart."
    );
  }

  // =====================================================
  // ADD TO BACKEND CART
  // =====================================================

  try {

    const response =
      await API.post(
        "/cart/add",
        null,
        {
          params: {
            userId: Number(userId),
            productId: Number(product.id),
            quantity: 1,
          },
        }
      );

    console.log(
      "ADD TO CART SUCCESS:",
      response.data
    );

    // =================================================
    // UPDATE FRONTEND LOCAL CART
    // =================================================

    let localCart = [];

    try {

      localCart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      if (!Array.isArray(localCart)) {
        localCart = [];
      }

    } catch (error) {

      console.error(
        "INVALID LOCAL CART:",
        error
      );

      localCart = [];
    }

    // =================================================
    // CHECK WHETHER PRODUCT ALREADY EXISTS
    // =================================================

    const existingProduct =
      localCart.find(
        (item) =>
          Number(item.id) ===
          Number(product.id)
      );

    if (existingProduct) {

      existingProduct.quantity =
        (Number(existingProduct.quantity) || 1) +
        1;

    } else {

      localCart.push({
        ...product,
        quantity: 1,
      });
    }

    // =================================================
    // SAVE UPDATED CART
    // =================================================

    localStorage.setItem(
      "cart",
      JSON.stringify(localCart)
    );

    console.log(
      "FRONTEND CART UPDATED:",
      localCart
    );

    // =================================================
    // NOTIFY NAVBAR + CART
    // =================================================

    window.dispatchEvent(
      new Event("cartChanged")
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    window.dispatchEvent(
      new Event("storage")
    );

    return response.data;

  } catch (error) {

    console.error(
      "ADD TO CART FAILED"
    );

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "BACKEND ERROR:",
      error.response?.data
    );

    console.error(
      "FULL ERROR:",
      error
    );

    throw error;
  }
};