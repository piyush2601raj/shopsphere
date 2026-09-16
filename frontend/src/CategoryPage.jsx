import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { getSubCategories } from "./dataService";


// =====================================================
// ALLOWED SUBCATEGORIES
// =====================================================

const allowedSubCategories = {

  Electronics: [
    "Laptop",
    "Monitor",
    "Mouse",
    "Keyboard",
    "Tablet",
    "Smart Watch",
    "Headphones",
    "Mobile",
  ],

  Clothing: [
    "T-Shirts",
    "Shirts",
    "Jeans",
    "Shoes",
    "Dresses",
    "Handbags",
    "Hoodies",
    "Jackets",
  ],

  Books: [
    "Fiction",
    "Self Help",
    "Business",
    "Biography",
    "Education",
    "Children's Books",
    "Comics & Manga",
    "Religion & Spirituality",
  ],

  "Home & Kitchen": [
    "Furniture",
    "Kitchen Essentials",
    "Cookware",
    "Home Appliances",
    "Home Decor",
    "Storage & Organization",
    "Bedsheets & Bedding",
    "Cleaning Supplies",
  ],

  Fashion: [
    "Watches",
    "Sunglasses",
    "Wallets",
    "Belts",
    "Caps",
    "Perfumes",
    "Jewellery",
    "Luggage & Bags",
  ],

  "Home Appliances": [
    "Refrigerators",
    "Washing Machines",
    "Air Conditioners",
    "Televisions",
    "Microwave Ovens",
    "Water Purifiers",
    "Vacuum Cleaners",
    "Geysers",
  ],

  "Sports & Fitness": [
    "Cricket",
    "Football",
    "Badminton",
    "Gym Equipment",
    "Yoga",
    "Cycling",
    "Running",
    "Swimming",
  ],

  Gaming: [
    "Gaming Laptops",
    "Gaming Consoles",
    "Gaming Keyboards",
    "Gaming Mouse",
    "Gaming Headsets",
    "Gaming Chairs",
    "VR Headsets",
    "Gaming Controllers",
  ],

};


// =====================================================
// CATEGORY ID MAP
// =====================================================

const categoryMap = {

  Electronics: 1,

  Clothing: 2,

  Books: 3,

  "Home & Kitchen": 4,

  Fashion: 15,

  "Home Appliances": 16,

  Gaming: 18,

  "Sports & Fitness": 19,

};


// =====================================================
// GET SUBCATEGORY IMAGE URL
// =====================================================

const getSubCategoryImage = (subCategoryName) => {

  const query = encodeURIComponent(
    `${subCategoryName} product`
  );


  return (
    `https://tse2.mm.bing.net/th?q=${query}` +
    `&w=700&h=700&c=7&rs=1&p=0`
  );

};


// =====================================================
// CATEGORY PAGE
// =====================================================

function CategoryPage() {

  const { name } = useParams();

  const navigate = useNavigate();


  const [subCategories, setSubCategories] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD SUBCATEGORIES
  // =====================================================

  useEffect(() => {

    const loadSubCategories = async () => {

      try {

        setLoading(true);

        setError("");

        setSubCategories([]);


        const categoryId =
          categoryMap[name];


        if (!categoryId) {

          setError(
            "Category not found"
          );

          return;

        }


        // =================================================
        // GET SUBCATEGORIES FROM SPRING BOOT
        // =================================================

        const data =
          await getSubCategories(
            categoryId
          );


        console.log(
          "CATEGORY:",
          name
        );


        console.log(
          "BACKEND SUBCATEGORIES:",
          data
        );


        // =================================================
        // GET ALLOWED SUBCATEGORIES
        // =================================================

        const allowed =
          allowedSubCategories[name] || [];


        // =================================================
        // FILTER BACKEND DATA
        // =================================================

        const filteredSubCategories =

          Array.isArray(data)

            ? data.filter((item) =>

                allowed.includes(
                  item?.name
                )

              )

            : [];


        // =================================================
        // KEEP DEFINED ORDER
        // =================================================

        const sortedSubCategories =

          allowed

            .map((allowedName) =>

              filteredSubCategories.find(

                (item) =>

                  item?.name ===
                  allowedName

              )

            )

            .filter(Boolean);


        console.log(
          "FINAL SUBCATEGORIES:",
          sortedSubCategories
        );


        setSubCategories(
          sortedSubCategories
        );

      }

      catch (err) {

        console.error(
          "ERROR LOADING SUBCATEGORIES:",
          err
        );


        setError(
          "Failed to load subcategories"
        );


        setSubCategories([]);

      }

      finally {

        setLoading(false);

      }

    };


    loadSubCategories();


  }, [name]);


  // =====================================================
  // HANDLE IMAGE ERROR
  // =====================================================

  const handleImageError = (
    event,
    itemName
  ) => {

    console.error(
      "SUBCATEGORY IMAGE FAILED:",
      itemName,
      event.currentTarget.src
    );


    event.currentTarget.onerror = null;


    event.currentTarget.src =
      "/Products/fallback.jpg";

  };


  // =====================================================
  // HANDLE SUBCATEGORY CLICK
  // =====================================================

  const handleSubCategoryClick = (
    subCategoryName
  ) => {

    navigate(

      `/subcategory/${encodeURIComponent(
        subCategoryName
      )}`

    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div

        className="
          container
          d-flex
          justify-content-center
          align-items-center
        "

        style={{
          minHeight: "600px",
        }}

      >

        <div className="text-center">


          <div

            className="
              spinner-border
              text-primary
              mb-3
            "

            role="status"

          />


          <h5>

            Loading {name}...

          </h5>


        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div

        className="
          container
          text-center
          py-5
        "

      >

        <h2 className="fw-bold">

          Category Not Available

        </h2>


        <p className="text-muted">

          {error}

        </p>


        <button

          type="button"

          className="
            btn
            btn-primary
          "

          onClick={() =>
            navigate("/")
          }

        >

          Go To Home

        </button>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div

      className="category-page"

      style={{

        minHeight: "100vh",

        background: "#f5f7fb",

      }}

    >


      <div className="container py-5">


        {/* ============================================= */}
        {/* HEADER */}
        {/* ============================================= */}


        <div className="text-center mb-5">


          <h1 className="fw-bold mb-2">

            {name}

          </h1>


          <p className="text-muted mb-0">

            Explore our premium {name} collection

          </p>


        </div>


        {/* ============================================= */}
        {/* SUBCATEGORY GRID */}
        {/* ============================================= */}


        {subCategories.length > 0 ? (


          <div className="row g-4">


            {subCategories.map((item) => {


              // =========================================
              // IMAGE URL FROM SUBCATEGORY NAME
              // =========================================

              const imageSource =
                getSubCategoryImage(
                  item.name
                );


              return (

                <div

                  key={item.id}

                  className="
                    col-12
                    col-sm-6
                    col-lg-3
                  "

                >


                  <div

                    className="
                      card
                      subcategory-card
                      h-100
                      border-0
                      shadow-sm
                    "

                    onClick={() =>

                      handleSubCategoryClick(
                        item.name
                      )

                    }

                  >


                    {/* =============================== */}
                    {/* IMAGE */}
                    {/* =============================== */}


                    <div

                      className="
                        subcategory-image-container
                      "

                    >


                      <img

                        src={imageSource}

                        alt={item.name}

                        title={item.name}

                        loading="lazy"

                        onError={(event) =>

                          handleImageError(
                            event,
                            item.name
                          )

                        }

                      />


                    </div>


                    {/* =============================== */}
                    {/* CARD BODY */}
                    {/* =============================== */}


                    <div

                      className="
                        card-body
                        text-center
                        p-4
                      "

                    >


                      <h4

                        className="
                          fw-bold
                          subcategory-name
                          mb-2
                        "

                      >

                        {item.name}

                      </h4>


                      <p

                        className="
                          text-muted
                          small
                          mb-3
                        "

                      >

                        Discover the best{" "}
                        {item.name} products

                      </p>


                      <button

                        type="button"

                        className="
                          btn
                          btn-outline-primary
                          rounded-pill
                          px-4
                        "

                        onClick={(event) => {

                          event.stopPropagation();


                          handleSubCategoryClick(
                            item.name
                          );

                        }}

                      >

                        View Products →

                      </button>


                    </div>


                  </div>


                </div>

              );

            })}


          </div>


        ) : (


          <div className="text-center py-5">


            <h3 className="fw-bold">

              No Subcategories Found

            </h3>


            <p className="text-muted">

              No subcategories are available for {name}.

            </p>


          </div>


        )}


      </div>


      {/* ================================================= */}
      {/* CSS */}
      {/* ================================================= */}


      <style>{`


        .subcategory-card {

          cursor: pointer;

          border-radius: 18px;

          overflow: hidden;

          background: white;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;

        }


        .subcategory-card:hover {

          transform:
            translateY(-7px);

          box-shadow:
            0 14px 35px
            rgba(0, 0, 0, 0.13)
            !important;

        }


        .subcategory-image-container {

          width: 100%;

          height: 230px;

          padding: 25px;

          display: flex;

          align-items: center;

          justify-content: center;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #f8faff,
              #eef3ff
            );

        }


        .subcategory-image-container img {

          width: 100%;

          height: 100%;

          display: block;

          object-fit: contain;

          transition:
            transform 0.3s ease;

        }


        .subcategory-card:hover
        .subcategory-image-container img {

          transform:
            scale(1.07);

        }


        .subcategory-name {

          color: #111827;

          font-size: 20px;

        }


        @media (max-width: 768px) {


          .subcategory-image-container {

            height: 190px;

            padding: 20px;

          }


          .subcategory-name {

            font-size: 18px;

          }


        }


      `}</style>


    </div>

  );

}


export default CategoryPage;