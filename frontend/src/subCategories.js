/*import laptop from "./Laptop.png";
import mobile from "./mobile.png";
//CLOTHING
import tshirt from "./clothes/tshirt.png";
import shirt from "./clothes/shirt.png";
import jeans from "./clothes/jeans.png";
import shoes from "./clothes/shoes.png";
import dress from "./clothes/dress.png";
import handbag from "./clothes/handbag.png";
import hoodie from "./clothes/hoodie.png";
import jacket from "./clothes/jacket.png";
//BOOKS
import fiction from "./books/fiction.png";
import selfhelp from "./books/selfhelp.png";
import business from "./books/business.png";
import biography from "./books/biography.png";
import education from "./books/education.png";
import children from "./books/children.png";
import comics from "./books/comics.png";
import religion from "./books/religion.png";
//HOME APPLIANCES
import furniture from "./home/furniture.png";
import kitchen from "./home/kitchen.png";
import cookware from "./home/cookware.png";
import appliances from "./home/appliances.png";
import decor from "./home/decor.png";
import storage from "./home/storage.png";
import bedding from "./home/bedding.png";
import cleaning from "./home/cleaning.png";
//FASHIONDATA
import watches from "./fashion/watches.png";
import sunglasses from "./fashion/sunglasses.png";
import wallets from "./fashion/wallets.png";
import belts from "./fashion/belts.png";
import caps from "./fashion/caps.png";
import perfumes from "./fashion/perfumes.png";
import jewellery from "./fashion/jewellery.png";
import luggage from "./fashion/luggage.png";
// HOME APPLIANCES
import refrigerator from "./appliances/refrigerator.png";
import washingmachine from "./appliances/washingmachine.png";
import airconditioner from "./appliances/airconditioner.png";
import television from "./appliances/television.png";
import microwave from "./appliances/microwave.png";
import waterpurifier from "./appliances/waterpurifier.png";
import vacuumcleaner from "./appliances/vacuumcleaner.png";
import geyser from "./appliances/geyser.png";

import cricketImg from "./sports/cricket.png";
import footballImg from "./sports/football.png";
import badmintonImg from "./sports/badminton.png";
import gymImg from "./sports/gym.png";
import yogaImg from "./sports/yoga.png";
import cyclingImg from "./sports/cycling.png";
import runningImg from "./sports/running.png";
import swimmingImg from "./sports/swimming.png";

import gamingLaptopImg from "./gaming/laptop.png";
import consoleImg from "./gaming/console.png";
import keyboardImg from "./gaming/keyboard.png";
import mouseImg from "./gaming/mouse.png";
import headsetImg from "./gaming/headset.png";
import chairImg from "./gaming/chair.png";
import vrImg from "./gaming/vr.png";
import controllerImg from "./gaming/controller.png";*/


const subCategories = [

  // ================= Electronics =================

  {
    id: 30,
    name: "Laptop",
    categoryId: 1
  },
  {
    id: 31,
    name: "Mobile",
    categoryId: 1
  },
  {
    id: 32,
    name: "Monitor",
    categoryId: 1
  },
  {
    id: 33,
    name: "Mouse",
    categoryId: 1
  },
  {
    id: 34,
    name: "Keyboard",
    categoryId: 1
  },
  {
    id: 35,
    name: "Tablet",
    categoryId: 1
  },
  {
    id: 36,
    name: "Smart Watch",
    categoryId: 1
  },
  {
    id: 37,
    name: "Headphones",
    categoryId: 1
  },


  // ================= Clothing =================

  {
    id: 40,
    name: "T-Shirts",
    categoryId: 2
  },
  {
    id: 41,
    name: "Shirts",
    categoryId: 2
  },
  {
    id: 42,
    name: "Jeans",
    categoryId: 2
  },
  {
    id: 43,
    name: "Shoes",
    categoryId: 2
  },
  {
    id: 44,
    name: "Dresses",
    categoryId: 2
  },
  {
    id: 45,
    name: "Handbags",
    categoryId: 2
  },
  {
    id: 46,
    name: "Hoodies",
    categoryId: 2
  },
  {
    id: 47,
    name: "Jackets",
    categoryId: 2
  },


  // ================= Books =================

  {
    id: 50,
    name: "Fiction",
    categoryId: 3
  },
  {
    id: 51,
    name: "Self Help",
    categoryId: 3
  },
  {
    id: 52,
    name: "Business",
    categoryId: 3
  },
  {
    id: 53,
    name: "Biography",
    categoryId: 3
  },
  {
    id: 54,
    name: "Education",
    categoryId: 3
  },
  {
    id: 56,
    name: "Children's Books",
    categoryId: 3
  },
  {
    id: 57,
    name: "Comics & Manga",
    categoryId: 3
  },
  {
    id: 58,
    name: "Religion & Spirituality",
    categoryId: 3
  },


  // ================= Home & Kitchen =================

  {
    id: 60,
    name: "Furniture",
    categoryId: 4
  },
  {
    id: 61,
    name: "Kitchen Essentials",
    categoryId: 4
  },
  {
    id: 62,
    name: "Cookware",
    categoryId: 4
  },
  {
    id: 63,
    name: "Home Appliances",
    categoryId: 4
  },
  {
    id: 64,
    name: "Home Decor",
    categoryId: 4
  },
  {
    id: 65,
    name: "Storage & Organization",
    categoryId: 4
  },
  {
    id: 66,
    name: "Bedsheets & Bedding",
    categoryId: 4
  },
  {
    id: 67,
    name: "Cleaning Supplies",
    categoryId: 4
  },


  // ================= Fashion =================

  {
    id: 90,
    name: "Watches",
    categoryId: 15
  },
  {
    id: 91,
    name: "Sunglasses",
    categoryId: 15
  },
  {
    id: 92,
    name: "Wallets",
    categoryId: 15
  },
  {
    id: 93,
    name: "Belts",
    categoryId: 15
  },
  {
    id: 94,
    name: "Caps",
    categoryId: 15
  },
  {
    id: 95,
    name: "Perfumes",
    categoryId: 15
  },
  {
    id: 96,
    name: "Jewellery",
    categoryId: 15
  },
  {
    id: 97,
    name: "Luggage & Bags",
    categoryId: 15
  },


  // ================= Home Appliances =================

  {
    id: 110,
    name: "Refrigerators",
    categoryId: 16
  },
  {
    id: 111,
    name: "Washing Machines",
    categoryId: 16
  },
  {
    id: 112,
    name: "Air Conditioners",
    categoryId: 16
  },
  {
    id: 113,
    name: "Televisions",
    categoryId: 16
  },
  {
    id: 114,
    name: "Microwave Ovens",
    categoryId: 16
  },
  {
    id: 115,
    name: "Water Purifiers",
    categoryId: 16
  },
  {
    id: 116,
    name: "Vacuum Cleaners",
    categoryId: 16
  },
  {
    id: 117,
    name: "Geysers",
    categoryId: 16
  },


  // ================= Sports & Fitness =================

  {
    id: 120,
    name: "Cricket",
    categoryId: 19
  },
  {
    id: 121,
    name: "Football",
    categoryId: 19
  },
  {
    id: 122,
    name: "Badminton",
    categoryId: 19
  },
  {
    id: 123,
    name: "Gym Equipment",
    categoryId: 19
  },
  {
    id: 124,
    name: "Yoga",
    categoryId: 19
  },
  {
    id: 125,
    name: "Cycling",
    categoryId: 19
  },
  {
    id: 126,
    name: "Running",
    categoryId: 19
  },
  {
    id: 127,
    name: "Swimming",
    categoryId: 19
  },


  // ================= Gaming =================

  {
    id: 130,
    name: "Gaming Laptops",
    categoryId: 18
  },
  {
    id: 131,
    name: "Gaming Consoles",
    categoryId: 18
  },
  {
    id: 132,
    name: "Gaming Keyboards",
    categoryId: 18
  },
  {
    id: 133,
    name: "Gaming Mouse",
    categoryId: 18
  },
  {
    id: 134,
    name: "Gaming Headsets",
    categoryId: 18
  },
  {
    id: 135,
    name: "Gaming Chairs",
    categoryId: 18
  },
  {
    id: 136,
    name: "VR Headsets",
    categoryId: 18
  },
  {
    id: 137,
    name: "Gaming Controllers",
    categoryId: 18
  }

];

export default subCategories;