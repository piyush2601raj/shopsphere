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
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");

const normalizeImage = (image) => {
  if (!image || typeof image !== "string") {
    return null;
  }

  const value = image.trim();

  if (!value) {
    return null;
  }

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
// PRODUCT CATEGORY
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
// PRODUCT SUBCATEGORY
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
// LOCAL PRODUCT MATCH
// ======================================================

const findLocalProductBySubCategory = (backendProduct) => {
  if (!backendProduct) {
    return null;
  }

  const backendSubCategory =
    getSubCategoryName(backendProduct);

  if (!backendSubCategory) {
    return null;
  }

  const backendName = normalizeText(
    backendProduct?.name
  );

  const backendBrand = normalizeText(
    backendProduct?.brand
  );

  const matchingProducts = products.filter(
    (localProduct) =>
      normalizeText(
        getSubCategoryName(localProduct)
      ) === normalizeText(backendSubCategory)
  );

  if (matchingProducts.length === 0) {
    return null;
  }

  // ====================================================
  // EXACT PRODUCT NAME
  // ====================================================

  if (backendName) {
    const exactMatch =
      matchingProducts.find(
        (item) =>
          normalizeText(item?.name) ===
          backendName
      );

    if (exactMatch) {
      return exactMatch;
    }
  }

  // ====================================================
  // BRAND MATCH
  // ====================================================

  if (backendBrand) {
    const brandMatches =
      matchingProducts.filter(
        (item) =>
          normalizeText(item?.brand) ===
          backendBrand
      );

    if (brandMatches.length > 0) {
      const index =
        Math.abs(
          Number(backendProduct?.id || 0)
        ) % brandMatches.length;

      return brandMatches[index];
    }
  }

  // ====================================================
  // STABLE SUBCATEGORY ROTATION
  // ====================================================

  const index =
    Math.abs(
      Number(backendProduct?.id || 0)
    ) % matchingProducts.length;

  return matchingProducts[index];
};

// ======================================================
// SUBCATEGORY FALLBACK IMAGE
// ======================================================

const getSubCategoryFallbackImage = (
  subCategoryName
) => {
  const key = normalizeText(
    subCategoryName
  );

  const imageMap = {
    laptop: "/Products/laptop.png",
    "gaming laptops": "/Products/gaming.png",

    monitor: "/Products/monitor.png",
    mouse: "/Products/mouse.png",
    keyboard: "/Products/keyboard.png",
    tablet: "/Products/tablet.png",

    "mobile phones": "/Products/mobile.png",
    mobile: "/Products/mobile.png",
    mobiles: "/Products/mobile.png",
    smartphones: "/Products/mobile.png",

    headphones: "/Products/headphones.png",

    watches: "/Products/watches.png",
    "smart watch": "/Products/smartwatch.png",
    smartwatch: "/Products/smartwatch.png",

    "t shirts": "/Products/tshirt.png",
    tshirts: "/Products/tshirt.png",
    "t shirt": "/Products/tshirt.png",

    shirts: "/Products/shirt.png",
    jeans: "/Products/jeans.png",
    shoes: "/Products/shoes.png",
    dresses: "/Products/dress.png",
    hoodies: "/Products/hoodie.png",
    jackets: "/Products/jacket.png",

    handbags: "/Products/handbag.png",
    belts: "/Products/belts.png",
    caps: "/Products/caps.png",
    jewellery: "/Products/jewellery.png",
    perfumes: "/Products/perfumes.png",
    sunglasses: "/Products/sunglasses.png",
    luggage: "/Products/luggage.png",

    fiction: "/Products/fiction.png",
    biography: "/Products/biography.png",
    business: "/Products/business.png",
    children: "/Products/children.png",
    comics: "/Products/comics.png",
    education: "/Products/education.png",
    religion: "/Products/religion.png",
    "self help": "/Products/selfhelp.png",

    furniture: "/Products/furniture.png",
    chair: "/Products/chair.png",
    bedding: "/Products/bedding.png",
    decor: "/Products/decor.png",
    kitchen: "/Products/kitchen.png",
    cookware: "/Products/cookware.png",
    cleaning: "/Products/cleaning.png",
    storage: "/Products/storage.png",

    "air conditioner":
      "/Products/airconditioner.png",

    "air conditioners":
      "/Products/airconditioner.png",

    appliances: "/Products/appliances.png",
    geyser: "/Products/geyser.png",

    microwave: "/Products/microwave.png",

    "microwave ovens":
      "/Products/microwave.png",

    refrigerator:
      "/Products/refrigerator.png",

    refrigerators:
      "/Products/refrigerator.png",

    television:
      "/Products/television.png",

    televisions:
      "/Products/television.png",

    "vacuum cleaner":
      "/Products/vacuumcleaner.png",

    "vacuum cleaners":
      "/Products/vacuumcleaner.png",

    console: "/Products/console.png",
    controller: "/Products/controller.png",
    headset: "/Products/headset.png",
    vr: "/Products/vr.png",

    cricket: "/Products/cricket.png",
    cycling: "/Products/cycling.png",
    football: "/Products/football.png",
    gym: "/Products/gym.png",
    running: "/Products/running.png",
    swimming: "/Products/swimming.png",

    gaming: "/Products/gaming.png",

    "sports fitness":
      "/Products/sports.png",

    "sports & fitness":
      "/Products/sports.png",
  };

  return (
    imageMap[key] ||
    "/Products/fallback.jpg"
  );
};

// ======================================================
// MERGE PRODUCT IMAGE
// ======================================================

const mergeProductImage = (
  backendProduct
) => {
  if (!backendProduct) {
    return backendProduct;
  }

  const subCategoryName =
    getSubCategoryName(
      backendProduct
    );

  const localProduct =
    findLocalProductBySubCategory(
      backendProduct
    );

  const localImage =
    normalizeImage(
      localProduct?.imageUrl
    ) ||
    normalizeImage(
      localProduct?.image
    );

  const backendImage =
    normalizeImage(
      backendProduct?.imageUrl
    ) ||
    normalizeImage(
      backendProduct?.image
    );

  const fallbackImage =
    getSubCategoryFallbackImage(
      subCategoryName
    );

  /*
   * IMPORTANT
   *
   * Local image first.
   *
   * Backend mein kuch URLs 404 ho rahe hain.
   * Isliye broken external URL ko blindly priority
   * nahi denge.
   */

  const finalImage =
    localImage ||
    backendImage ||
    fallbackImage;

  return {
    ...backendProduct,

    categoryName:
      backendProduct?.categoryName ||
      getCategoryName(
        backendProduct
      ),

    subCategoryName:
      backendProduct?.subCategoryName ||
      subCategoryName,

    image: finalImage,

    imageUrl: finalImage,

    fallbackImage:
      localImage ||
      fallbackImage,
  };
};

// ======================================================
// GET ALL PRODUCTS
// ======================================================

export const getProducts = async () => {
  if (USE_LOCAL_DATA) {
    return products.map(
      (product) => ({
        ...product,
        image:
          normalizeImage(
            product?.imageUrl
          ) ||
          normalizeImage(
            product?.image
          ) ||
          getSubCategoryFallbackImage(
            getSubCategoryName(product)
          ),
        imageUrl:
          normalizeImage(
            product?.imageUrl
          ) ||
          normalizeImage(
            product?.image
          ) ||
          getSubCategoryFallbackImage(
            getSubCategoryName(product)
          ),
      })
    );
  }

  try {
    const response =
      await API.get(
        "/products/all"
      );

    const backendProducts =
      response?.data?.data || [];

    if (
      !Array.isArray(
        backendProducts
      )
    ) {
      return [];
    }

    const mergedProducts =
      backendProducts.map(
        mergeProductImage
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

export const getSubCategories =
  async (categoryId) => {
    if (USE_LOCAL_DATA) {
      return subCategoriesData.filter(
        (item) =>
          Number(
            item.categoryId
          ) ===
          Number(categoryId)
      );
    }

    try {
      const response =
        await API.get(
          `/subcategories/category/${categoryId}`
        );

      return (
        response?.data?.data || []
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

export const getProductsBySubCategory =
  async (name) => {
    if (USE_LOCAL_DATA) {
      return products
        .filter(
          (item) =>
            normalizeText(
              getSubCategoryName(item)
            ) ===
            normalizeText(name)
        )
        .map(
          mergeProductImage
        );
    }

    try {
      const response =
        await API.get(
          `/products/subcategory/${encodeURIComponent(
            name
          )}`
        );

      const backendProducts =
        response?.data?.data || [];

      return backendProducts.map(
        mergeProductImage
      );
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

export const getProductById =
  async (id) => {
    if (USE_LOCAL_DATA) {
      const product =
        products.find(
          (item) =>
            Number(item.id) ===
            Number(id)
        );

      return product
        ? mergeProductImage(product)
        : null;
    }

    try {
      const response =
        await API.get(
          `/products/${id}`
        );

      const backendProduct =
        response?.data?.data;

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

export const getProductsByCategory =
  async (categoryName) => {
    const allProducts =
      await getProducts();

    return allProducts.filter(
      (item) =>
        normalizeText(
          getCategoryName(item)
        ) ===
        normalizeText(
          categoryName
        )
    );
  };

// ======================================================
// SEARCH HELPERS
// ======================================================

const extractSearchData = (
  query
) => {
  const searchText =
    String(query || "")
      .toLowerCase()
      .trim();

  let maxPrice = null;

  const pricePattern =
    /(?:under|below|less than|upto|up to)\s*₹?\s*([\d,]+)/i;

  const priceMatch =
    searchText.match(
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

    if (
      !Number.isNaN(
        parsedPrice
      )
    ) {
      maxPrice =
        parsedPrice;
    }
  }

  const keywordText =
    searchText
      .replace(
        /(?:under|below|less than|upto|up to)\s*₹?\s*[\d,]+/gi,
        ""
      )
      .replace(
        /₹/g,
        ""
      )
      .trim();

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
    "of",
    "a",
    "an",
  ];

  /*
   * IMPORTANT:
   *
   * length > 1 hata diya hai.
   *
   * Ab:
   *
   * "x"
   *
   * bhi valid search hai.
   */

  const searchWords =
    keywordText
      .split(/\s+/)
      .map(
        (word) =>
          word.trim()
      )
      .filter(Boolean)
      .filter(
        (word) =>
          !ignoredWords.includes(
            word
          )
      );

  return {
    searchText,
    searchWords,
    maxPrice,
  };
};

// ======================================================
// SEARCH PRODUCTS
// CLIENT-SIDE SEARCH
//
// Supports:
//
// x
// lap
// laptop
// iphone
// samsung
// sunglasses
// laptop under 70000
// dell laptop under 70000
// mobile under 30000
// ======================================================

export const searchProducts =
  async (query) => {
    const {
      searchWords,
      maxPrice,
    } =
      extractSearchData(
        query
      );

    if (
      searchWords.length === 0 &&
      maxPrice === null
    ) {
      return [];
    }

    /*
     * IMPORTANT:
     *
     * Backend /products/search ko use nahi kar rahe.
     *
     * Pehle complete product list lenge.
     * Phir frontend par accurate matching.
     *
     * Isse backend ke incorrect search result ka
     * problem solve hota hai.
     */

    const allProducts =
      await getProducts();

    if (
      !Array.isArray(
        allProducts
      )
    ) {
      return [];
    }

    const results =
      allProducts
        .map((product) => {
          const name =
            normalizeText(
              product?.name
            );

          const brand =
            normalizeText(
              product?.brand
            );

          const category =
            normalizeText(
              getCategoryName(
                product
              )
            );

          const subCategory =
            normalizeText(
              getSubCategoryName(
                product
              )
            );

          const description =
            normalizeText(
              product?.description
            );

          const searchableText =
            `${name} ${brand} ${category} ${subCategory} ${description}`;

          // ==========================================
          // PRICE FILTER
          // ==========================================

          const price =
            Number(
              product?.price || 0
            );

          if (
            maxPrice !== null &&
            price > maxPrice
          ) {
            return null;
          }

          // ==========================================
          // ALL WORDS MUST MATCH
          // ==========================================

          const matches =
            searchWords.every(
              (word) =>
                searchableText.includes(
                  normalizeText(word)
                )
            );

          if (!matches) {
            return null;
          }

          // ==========================================
          // SEARCH RANKING
          // ==========================================

          let score = 0;

          searchWords.forEach(
            (word) => {
              const normalizedWord =
                normalizeText(
                  word
                );

              // Exact name
              if (
                name ===
                normalizedWord
              ) {
                score += 100;
              }

              // Name starts with word
              if (
                name.startsWith(
                  normalizedWord
                )
              ) {
                score += 80;
              }

              // Name contains word
              if (
                name.includes(
                  normalizedWord
                )
              ) {
                score += 60;
              }

              // Brand
              if (
                brand.includes(
                  normalizedWord
                )
              ) {
                score += 50;
              }

              // Subcategory
              if (
                subCategory.includes(
                  normalizedWord
                )
              ) {
                score += 45;
              }

              // Category
              if (
                category.includes(
                  normalizedWord
                )
              ) {
                score += 35;
              }

              // Description
              if (
                description.includes(
                  normalizedWord
                )
              ) {
                score += 10;
              }
            }
          );

          return {
            product,
            score,
          };
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.score -
            a.score
        )
        .map(
          (item) =>
            item.product
        );

    return results;
  };

// ======================================================
// ADD TO CART
// ======================================================

export const addToCart =
  async (product) => {
    if (!product?.id) {
      throw new Error(
        "Invalid product"
      );
    }

    if (USE_LOCAL_DATA) {
      let cart =
        JSON.parse(
          localStorage.getItem(
            "cart"
          )
        ) || [];

      const existing =
        cart.find(
          (item) =>
            Number(item.id) ===
            Number(product.id)
        );

      if (existing) {
        existing.quantity =
          (existing.quantity || 1) +
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

      window.dispatchEvent(
        new Event(
          "storage"
        )
      );

      window.dispatchEvent(
        new Event(
          "cartChanged"
        )
      );

      return {
        success: true,
      };
    }

    let userId =
      localStorage.getItem(
        "userId"
      );

    if (!userId) {
      const storedUser =
        localStorage.getItem(
          "loggedInUser"
        ) ||
        localStorage.getItem(
          "user"
        ) ||
        localStorage.getItem(
          "currentUser"
        );

      if (storedUser) {
        try {
          const parsedUser =
            JSON.parse(
              storedUser
            );

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

    if (
      userId === null ||
      userId === undefined ||
      userId === ""
    ) {
      throw new Error(
        "Please login before adding products to cart."
      );
    }

    const response =
      await API.post(
        "/cart/add",
        null,
        {
          params: {
            userId:
              Number(userId),

            productId:
              Number(
                product.id
              ),

            quantity: 1,
          },
        }
      );

    return response.data;
  };