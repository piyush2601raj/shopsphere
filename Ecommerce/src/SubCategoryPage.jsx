import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { getProductsBySubCategory } from "./dataService";
import ProductImage from "./ProductImage";

const subCategoryImageMap = {

  Laptop: "Laptop.png",
  Mobile: "mobile.png",
  Monitor: "monitor.png",
  Mouse: "mouse.png",
  Keyboard: "keyboard.png",
  Tablet: "tablet.png",
  "Smart Watch": "smartwatch.png",
  Headphones: "headphones.png",
  Lighting: "lighting.png",

  "T-Shirts": "tshirt.png",
  Shirts: "shirt.png",
  Jeans: "jeans.png",
  Shoes: "shoes.png",
  Dresses: "dress.png",
  Handbags: "handbag.png",
  Hoodies: "hoodie.png",
  Jackets: "jacket.png",

  Fiction: "fiction.png",
  "Self Help": "selfhelp.png",
  Business: "business.png",
  Biography: "biography.png",
  Education: "education.png",

  Furniture: "furniture.png",
  "Kitchen Essentials": "kitchen.png",
  Cookware: "cookware.png",

  Watches: "watches.png",
  Sunglasses: "sunglasses.png",
  Wallets: "wallets.png",

  Refrigerators: "refrigerator.png",
  "Washing Machines": "washingmachine.png",
  "Air Conditioners": "airconditioner.png",

  Cricket: "cricket.png",
  Football: "football.png",
  Badminton: "badminton.png",

  "Gaming Laptops": "laptop.png",
  "Gaming Consoles": "console.png",
  "Gaming Keyboards": "keyboard.png",
  "Gaming Mouse": "mouse.png"
};
function SubCategoryPage() {

  const { name } = useParams();

  const navigate = useNavigate();


  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {

    const loadProducts = async () => {

      try {

        setLoading(true);


        const data =
          await getProductsBySubCategory(name);


        setProducts(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          "Error loading products:",
          error
        );


        setProducts([]);


      } finally {

        setLoading(false);

      }

    };


    loadProducts();


  }, [name]);


  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {

    let cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];


    const exists =
      cart.find(
        (item) =>
          item.id === product.id
      );


    if (exists) {

      exists.quantity =
        (exists.quantity || 1) + 1;


      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );


      window.dispatchEvent(
        new Event("storage")
      );


      alert(
        `${product.name} quantity updated to ${exists.quantity}`
      );


      return;
    }


    cart.push({

      ...product,

      quantity: 1

    });


    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );


    window.dispatchEvent(
      new Event("storage")
    );


    alert(
      "Added To Cart Successfully"
    );

  };


  // =====================================================
  // BUY NOW
  // =====================================================

  const buyNow = (product) => {

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify(product)
    );


    navigate(
      `/product/${product.id}`
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="container mt-5 text-center">

        <h3>
          Loading...
        </h3>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="container mt-4">


      <h2 className="mb-4">

        {name} Products

      </h2>


      {/* NO PRODUCTS */}

      {products.length === 0 && (

        <div className="text-center mt-5">

          <h4>
            No Products Found
          </h4>

        </div>

      )}


      <div className="row">


        {products.map((item) => (


          <div

            key={item.id}

            className="
              col-12
              col-sm-6
              col-md-4
              col-lg-3
              mb-4
            "

          >


            <div className="card shadow h-100">


              {/* ========================= */}
              {/* PRODUCT IMAGE */}
              {/* ========================= */}


              <ProductImage

                product={item}

                height="220px"

              />


              {/* ========================= */}
              {/* PRODUCT DETAILS */}
              {/* ========================= */}


              <div className="card-body">


                <h5>

                  {item.name}

                </h5>


                <h6 className="text-success">

                  ₹{item.price}

                </h6>


                {/* ADD TO CART */}


                <button

                  className="
                    btn
                    btn-warning
                    w-100
                    mb-2
                  "

                  onClick={() =>
                    addToCart(item)
                  }

                >

                  Add To Cart

                </button>


                {/* BUY NOW */}


                <button

                  className="
                    btn
                    btn-success
                    w-100
                    mb-2
                  "

                  onClick={() =>
                    buyNow(item)
                  }

                >

                  Buy Now

                </button>


                {/* VIEW DETAILS */}


                <button

                  className="
                    btn
                    btn-primary
                    w-100
                  "

                  onClick={() =>

                    navigate(
                      `/product/${item.id}`
                    )

                  }

                >

                  View Details

                </button>


              </div>


            </div>


          </div>


        ))}


      </div>


    </div>

  );

}


export default SubCategoryPage;