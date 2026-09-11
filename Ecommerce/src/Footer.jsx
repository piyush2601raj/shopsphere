const Footer = () => {
  return (
    <div className="bg-light mt-5 p-4">

      {/* 🔥 BIG TEXT SECTION */}
      <div style={{ fontSize: "12px", color: "#555" }}>

        <h6>Top Stories: Brand Directory</h6>

        <p>
          MOST SEARCHED FOR ON FLIPKART: iPhone 15 | Samsung Galaxy S24 | Vivo V30 | Oppo F21 Pro |
          Realme Narzo | OnePlus Nord | Redmi Note Series | Poco X Series | Gaming Laptops | Smart TVs |
          Bluetooth Headphones | Smart Watches | Washing Machines | Refrigerators | Air Conditioners
        </p>

        <p>
          MOBILES: Apple iPhone | Samsung Galaxy | Vivo Smartphones | Oppo Mobiles | Realme Phones |
          Xiaomi Redmi | OnePlus Mobiles | Google Pixel
        </p>

        <p>
          ELECTRONICS: Laptops | Cameras | Printers | Tablets | Speakers | Power Banks |
          Gaming Consoles | Monitors | Routers
        </p>

        <p>
          FASHION: Men's T-Shirts | Shirts | Jeans | Shoes | Women's Dresses | Sarees |
          Handbags | Watches | Sunglasses
        </p>

        <p>
          HOME & KITCHEN: Furniture | Beds | Sofas | Dining Tables | Kitchen Appliances |
          Cookware | Storage | Home Decor
        </p>

        <p>
          BEAUTY & HEALTH: Makeup | Skincare | Haircare | Perfumes | Grooming |
          Health Supplements | Fitness Equipment
        </p>

        <p>
          SPORTS & FITNESS: Cricket Kits | Football | Gym Equipment | Yoga Mats |
          Running Shoes | Cycling Gear
        </p>

      </div>

      {/* 🔥 DESCRIPTION LIKE FLIPKART */}
      <div style={{ fontSize: "12px", color: "#555" }} className="mt-3">

        <h6>Flipkart: The One-stop Shopping Destination</h6>

        <p>
          Flipkart is India's leading e-commerce marketplace offering a wide range of products across
          categories like electronics, fashion, home essentials, and more. With a seamless shopping
          experience, fast delivery, and secure payment options, Flipkart makes online shopping easy and convenient.
        </p>

        <p>
          From mobiles and laptops to clothing and home appliances, explore millions of products at the
          best prices. Enjoy deals, discounts, and exclusive offers every day.
        </p>

      </div>

      {/* 🔥 FOOTER LINKS */}
      <div className="row mt-4 text-center text-md-start">

        <div className="col-md-3">
          <h6>About</h6>
          <p>Contact Us</p>
          <p>Careers</p>
          <p>Stories</p>
        </div>

        <div className="col-md-3">
          <h6>Help</h6>
          <p>Payments</p>
          <p>Shipping</p>
          <p>Returns</p>
        </div>

        <div className="col-md-3">
          <h6>Policy</h6>
          <p>Terms Of Use</p>
          <p>Security</p>
          <p>Privacy</p>
        </div>

        <div className="col-md-3">
          <h6>Social</h6>
          <p>Facebook</p>
          <p>Twitter</p>
          <p>YouTube</p>
        </div>

      </div>

      {/* 🔥 COPYRIGHT */}
      <div className="text-center mt-4">
        <small>© 2026 Flipkart Clone | Made by You 🚀</small>
      </div>

    </div>
  );
};

export default Footer;