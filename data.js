/* ==========================================================
   Ridwan Rotan - data.js
   All business data lives here (products, variants, shipping,
   FAQ and contact details). Prices are in Australian dollars.
   ========================================================== */

"use strict";

/* ---------- Contact details (edit these with the real ones) ---------- */
const CONTACT = {
  email: "sales@ridwanrotan.com",
  whatsapp: "6281200000000", // international format, no "+" sign
  phoneDisplay: "+62 812-0000-0000",
  address: "Cirebon, West Java, Indonesia"
};

/* ---------- Handling time (days) before an in-stock order leaves the workshop ---------- */
const READY_HANDLING_DAYS = 3;

/* ---------- Products ----------
   status "ready"    -> in stock, ships after READY_HANDLING_DAYS
   status "preorder" -> made to order, needs leadDays of production first
   weightKg          -> packed shipping weight of ONE unit
*/
const PRODUCTS = [
  {
    id: "chair",
    name: "Rattan Chair",
    category: "Furniture",
    image: "images/rattan-chair.jpg",
    description: "Round-seat chair with a hand-wound rattan frame. Light, strong and comfortable for lounge corners, verandas and cafes.",
    variants: [
      { id: "chair-natural", name: "Natural finish, standard", price: 85, weightKg: 6, status: "ready", stock: 24 },
      { id: "chair-honey", name: "Honey brown finish, standard", price: 95, weightKg: 6, status: "ready", stock: 12 },
      { id: "chair-large", name: "Natural finish, large with seat pad", price: 120, weightKg: 8, status: "preorder", leadDays: 10 }
    ]
  },
  {
    id: "dining-set",
    name: "Rattan Dining Set",
    category: "Furniture",
    image: "images/rattan-dining-set.jpg",
    description: "Solid timber table with woven rattan-back chairs. A warm, modern dining set sold as a complete table and chair package.",
    variants: [
      { id: "set-2", name: "Table + 2 chairs", price: 290, weightKg: 32, status: "ready", stock: 8 },
      { id: "set-4", name: "Table + 4 chairs", price: 520, weightKg: 52, status: "ready", stock: 6 },
      { id: "set-6", name: "Table + 6 chairs", price: 740, weightKg: 75, status: "preorder", leadDays: 14 }
    ]
  },
  {
    id: "sofa",
    name: "Rattan Sofa",
    category: "Furniture",
    image: "images/rattan-sofa.jpg",
    description: "Curved wicker sofa with a seat cushion and three scatter cushions. Suited to patios, living rooms and resort lounges.",
    variants: [
      { id: "sofa-2", name: "2-seater, sand cushions", price: 380, weightKg: 28, status: "ready", stock: 5 },
      { id: "sofa-3", name: "3-seater, sand cushions", price: 520, weightKg: 38, status: "ready", stock: 4 },
      { id: "sofa-3-grey", name: "3-seater, grey cushions", price: 540, weightKg: 38, status: "preorder", leadDays: 14 }
    ]
  },
  {
    id: "mirror",
    name: "Rattan Mirror",
    category: "Decor",
    image: "images/rattan-mirror.jpg",
    description: "Flower-shaped wall mirror with hand-bent rattan petals. Each petal is woven by hand, so no two mirrors are exactly alike.",
    variants: [
      { id: "mirror-40", name: "40 cm diameter", price: 45, weightKg: 1.5, status: "ready", stock: 40 },
      { id: "mirror-60", name: "60 cm diameter", price: 65, weightKg: 2.5, status: "ready", stock: 22 },
      { id: "mirror-80", name: "80 cm diameter", price: 95, weightKg: 4, status: "preorder", leadDays: 7 }
    ]
  },
  {
    id: "lamp",
    name: "Rattan Lamp",
    category: "Lighting",
    image: "images/rattan-lamp.jpg",
    description: "Scalloped pendant lamp shade in woven cane webbing. It throws a soft, patterned glow across the room.",
    variants: [
      { id: "lamp-30", name: "30 cm shade", price: 55, weightKg: 1.8, status: "ready", stock: 30 },
      { id: "lamp-45", name: "45 cm shade", price: 79, weightKg: 2.8, status: "ready", stock: 15 },
      { id: "lamp-60", name: "60 cm shade", price: 110, weightKg: 4, status: "preorder", leadDays: 10 }
    ]
  },
  {
    id: "wall-decor",
    name: "Rattan Wall Decor",
    category: "Decor",
    image: "images/rattan-wall-decor.jpg",
    description: "Woven flower wall piece in natural pale rattan. Works alone or in groups on feature walls and in nurseries.",
    variants: [
      { id: "wall-25", name: "Single flower, 25 cm", price: 18, weightKg: 0.4, status: "ready", stock: 80 },
      { id: "wall-35", name: "Single flower, 35 cm", price: 26, weightKg: 0.6, status: "ready", stock: 50 },
      { id: "wall-set3", name: "Set of 3 (25, 35 and 45 cm)", price: 55, weightKg: 1.6, status: "preorder", leadDays: 7 }
    ]
  },
  {
    id: "waste-basket",
    name: "Rattan Waste Basket",
    category: "Home Storage",
    image: "images/rattan-waste-basket.jpg",
    description: "Tall woven basket with a fitted lid. Also works as a laundry hamper or toy storage.",
    variants: [
      { id: "basket-s", name: "Small, 30 cm tall, with lid", price: 38, weightKg: 1.8, status: "ready", stock: 35 },
      { id: "basket-l", name: "Large, 45 cm tall, with lid", price: 52, weightKg: 2.8, status: "ready", stock: 20 }
    ]
  },
  {
    id: "plant-pot",
    name: "Rattan Plant Pot Stand",
    category: "Garden",
    image: "images/rattan-plant-stand.jpg",
    description: "Ribbed rattan pot holder on a tall tripod stand, wrapped and tied by hand. Fits a standard plastic pot.",
    variants: [
      { id: "pot-40", name: "40 cm tall, fits 20 cm pot", price: 48, weightKg: 3, status: "ready", stock: 18 },
      { id: "pot-60", name: "60 cm tall, fits 25 cm pot", price: 65, weightKg: 4.5, status: "preorder", leadDays: 8 }
    ]
  },
  {
    id: "tissue-box",
    name: "Rattan Tissue Box",
    category: "Home Storage",
    image: "images/rattan-tissue-box.jpg",
    description: "Lidded woven tissue holder with a rattan loop closure. A small gift item that sells well in home stores.",
    variants: [
      { id: "tissue-std", name: "Standard, 25 x 14 cm", price: 24, weightKg: 0.7, status: "ready", stock: 60 },
      { id: "tissue-lg", name: "Large, 30 x 18 cm", price: 32, weightKg: 1, status: "ready", stock: 35 }
    ]
  }
];

/* ---------- Shipping ----------
   Cost = base fee + (chargeable kg x rate per kg x zone multiplier)
   Transit days are door-to-door from the Cirebon workshop to the Australian address.
*/
const SHIPPING_METHODS = [
  {
    id: "sea",
    name: "Sea freight",
    note: "Best price for furniture and large orders",
    baseFee: 45,
    ratePerKg: 1.8,
    transitMin: 21,
    transitMax: 32
  },
  {
    id: "air",
    name: "Air freight",
    note: "Faster, best for small and light items",
    baseFee: 60,
    ratePerKg: 6.5,
    transitMin: 6,
    transitMax: 10
  }
];

const DESTINATIONS = [
  { id: "NSW", name: "New South Wales (Sydney)", multiplier: 1.0, extraDays: 0 },
  { id: "VIC", name: "Victoria (Melbourne)", multiplier: 1.0, extraDays: 1 },
  { id: "QLD", name: "Queensland (Brisbane)", multiplier: 1.0, extraDays: 1 },
  { id: "ACT", name: "Australian Capital Territory (Canberra)", multiplier: 1.1, extraDays: 2 },
  { id: "SA", name: "South Australia (Adelaide)", multiplier: 1.15, extraDays: 2 },
  { id: "TAS", name: "Tasmania (Hobart)", multiplier: 1.25, extraDays: 4 },
  { id: "WA", name: "Western Australia (Perth)", multiplier: 1.3, extraDays: 3 },
  { id: "NT", name: "Northern Territory (Darwin)", multiplier: 1.4, extraDays: 4 }
];

/* ---------- FAQ ---------- */
const FAQS = [
  {
    question: "How do I know if a product is in stock?",
    answer: "Each variant on the Products section shows a status. \"Ready stock\" means the item is made and waiting in our workshop, with the number of units left. \"Pre-order\" means we make it for you, and the production time is shown on the card."
  },
  {
    question: "What variants are available?",
    answer: "Every product comes in several sizes, finishes or set options. Pick the variant from the drop-down on the product card to see its price, weight and availability."
  },
  {
    question: "How is the total price calculated?",
    answer: "Add your chosen variants to the order list, set the quantity, then choose your Australian state and shipping method. The Order Calculator adds the product subtotal and the shipping cost and shows the total in Australian dollars (AUD)."
  },
  {
    question: "How much does shipping cost?",
    answer: "Shipping is a base fee plus a rate per kilogram, adjusted for your state. Sea freight starts at AUD 45 plus AUD 1.80 per kg. Air freight starts at AUD 60 plus AUD 6.50 per kg. The Shipping section has the full table, and the calculator gives your exact figure."
  },
  {
    question: "How long until my order arrives?",
    answer: "The estimate is production or handling time plus transit time. Ready stock leaves our workshop within 3 days. Pre-order items need their listed production time first. Sea freight then takes about 21 to 32 days and air freight about 6 to 10 days, plus 0 to 4 extra days depending on your state."
  },
  {
    question: "Do you ship to all of Australia?",
    answer: "Yes. We ship to all eight states and territories. Remote and regional addresses can take longer than the capital-city estimate."
  },
  {
    question: "Is the rattan natural?",
    answer: "Yes. Our products are made from natural rattan cane by craftspeople in Cirebon, West Java, one of Indonesia's best-known rattan regions. The dining set uses a solid timber table with rattan-back chairs, and the sofa uses a woven rattan-style wicker with cushions."
  },
  {
    question: "Can I order in bulk for a shop or cafe?",
    answer: "Yes. Send us the products and quantities using the order form and we will confirm the final price and shipping. Large orders are usually best sent by sea freight."
  },
  {
    question: "What happens after I send my order?",
    answer: "You get an order reference with a summary. Send it to us by WhatsApp or email, and we reply to confirm stock, the final total, and how to pay. Production starts after payment is confirmed."
  }
];
