import { Clothingproduct } from "./data/clothingData.js";

const backendProducts = Clothingproduct.map((product) => ({
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