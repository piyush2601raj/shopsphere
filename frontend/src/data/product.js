import { products as electronicsProducts } from "./data";
import { Clothingproduct } from "./clothingData";
import { BooksProduct } from "./booksData";
import { HomeProduct } from "./homeData";
import { FashionProduct } from "./fashionData";
import { homeAppliancesData } from "./homeAppliancesData";
import { SportsProduct } from "./sportsData";
import { GamingProduct } from "./gamingData";

export const products = [
  ...electronicsProducts,
  ...Clothingproduct,
  ...BooksProduct,
  ...HomeProduct,
  ...FashionProduct,
  ...homeAppliancesData,
  ...SportsProduct,
  ...GamingProduct,
];