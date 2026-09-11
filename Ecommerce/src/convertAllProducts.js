import { BooksProduct } from "./data/booksData.js";
import { HomeProduct } from "./data/homeData.js";
import { FashionProduct } from "./data/fashionData.js";
import { HomeAppliancesProduct } from "./data/homeAppliancesData.js";
import { GamingProduct } from "./data/gamingData.js";
import { SportsProduct } from "./data/sportsData.js";

const products = [
  ...BooksProduct,
  ...HomeProduct,
  ...FashionProduct,
  ...HomeAppliancesProduct,
  ...GamingProduct,
  ...SportsProduct,
];

const backendProducts = products.filter(Boolean).map((product) => ({
  name: product.name,
  brand: product.brand,
  description: product.description,

  price: product.price,
  originalPrice: product.originalPrice,
  discount: product.discount,

  stock: product.stock,
  rating: product.rating,
  reviews: product.reviews,

  seller: product.seller,
  delivery: product.delivery,
  emi: product.emi,
  warranty: product.warranty,

  imageUrl: product.image,

  categoryName: product.category,
  subCategoryName: product.subCategory,
}));

console.log(JSON.stringify(backendProducts, null, 2));