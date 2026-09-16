const ProductImage = ({ product, height = "220px" }) => {
  const imageMap = {
    Laptop: "laptop.png",
    Mobile: "mobile.png",
    Monitor: "monitor.png",
    Mouse: "mouse.png",
    Keyboard: "keyboard.png",
    Tablet: "tablet.png",
    "Smart Watch": "smartwatch.png",

    "T-Shirts": "tshirt.png",
    Shirts: "shirt.png",
    Jeans: "jeans.png",
    Shoes: "shoes.png",
    Dresses: "dress.png",
    Hoodies: "hoodie.png",
    Jackets: "jacket.png",

    Handbags: "handbag.png",
    Belts: "belts.png",
    Caps: "caps.png",
    Jewellery: "jewellery.png",
    Perfumes: "perfumes.png",
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

  const subCategoryName =
    product?.subCategoryName ||
    product?.subcategoryName ||
    product?.subCategory?.name ||
    product?.subcategory?.name ||
    product?.subCategory ||
    "";

  const productName = product?.name || "product";

  const existingImage =
    product?.image ||
    product?.imageUrl ||
    null;

  const automaticProductImage =
    `https://tse2.mm.bing.net/th?q=${encodeURIComponent(
      productName
    )}&w=700&h=700&c=7&rs=1&p=0`;

  const imageFile = imageMap[subCategoryName];

  const fallbackSubCategoryImage = imageFile
    ? `/Products/${imageFile}`
    : "/Products/fallback.jpg";

  const imageSrc =
    existingImage ||
    automaticProductImage;

  return (
    <img
      src={imageSrc}
      alt={productName}
      title={productName}
      loading="lazy"
      onError={(event) => {
        const currentSrc = event.currentTarget.src;

        if (
          existingImage &&
          !currentSrc.includes("tse2.mm.bing.net")
        ) {
          event.currentTarget.src = automaticProductImage;
          return;
        }

        if (
          !currentSrc.includes(fallbackSubCategoryImage)
        ) {
          event.currentTarget.src = fallbackSubCategoryImage;
          return;
        }

        event.currentTarget.onerror = null;
        event.currentTarget.src = "/Products/fallback.jpg";
      }}
      style={{
        width: "100%",
        height: "100%",
        maxHeight: height,
        objectFit: "contain",
        boxSizing: "border-box",
        display: "block",
        margin: "0 auto",
      }}
    />
  );
};

export default ProductImage;