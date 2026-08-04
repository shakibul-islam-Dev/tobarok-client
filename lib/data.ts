export const CURRENCY = "৳";

const img = (id: string, w = 800, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&q=75&auto=format&fit=crop`;

export const images = {
  tees: img("photo-1521572163474-6864f9cf17ab"),
  manGrey: img("photo-1503341504253-dff4815485f1"),
  manWhite: img("photo-1583743814966-8936f5b7be1a"),
  manTee: img("photo-1576566588028-4147f3842f27"),
  pinkTee: img("photo-1556906781-9a412961c28c"),
  rack: img("photo-1523381210434-271e8be1f52b"),
  store: img("photo-1441986300917-64674bd600d8"),
  fashion: img("photo-1490481651871-ab68de25d43d"),
  rack2: img("photo-1445205170230-053b83016050"),
  shirts: img("photo-1562157873-818bc0726f68"),
  hoodie: img("photo-1556905055-8f358a7a47b2"),
  teeMock: img("photo-1622445275576-721325763afe"),
  foldedTees: img("photo-1578681994506-b8f463449011"),
  hoodieMan: img("photo-1543076447-215ad9ba6923"),
  whiteTee: img("photo-1596755094514-f87e34085b2c"),
  teeHanger: img("photo-1583744946564-b52ac1c389c8"),
};

export const heroSlides = [
  {
    id: 1,
    eyebrow: "Big Sale",
    title: "BD's Biggest Drop Shoulder Lineup",
    subtitle:
      "Fresh drops, premium fabrics and the most wanted fits — all at unbeatable prices.",
    cta: "Shop the Sale",
    link: "/big-sale",
    image: img("photo-1441986300917-64674bd600d8", 1920, 1080),
  },
  {
    id: 2,
    eyebrow: "New In",
    title: "Drop Shoulder T-Shirts",
    subtitle:
      "Oversized, comfortable and made for everyday swag. Explore the full collection.",
    cta: "Shop Drop Shoulder",
    link: "/collections/drop-shoulder",
    image: img("photo-1523381210434-271e8be1f52b", 1920, 1080),
  },
  {
    id: 3,
    eyebrow: "Signature Series",
    title: "Wear Bangladesh",
    subtitle:
      "Deshi pride, bold statements and quality you can trust. Signature series drops.",
    cta: "Explore Signature",
    link: "/signature-series",
    image: img("photo-1490481651871-ab68de25d43d", 1920, 1080),
  },
  {
    id: 4,
    eyebrow: "Polo Perfection",
    title: "Premium Solid Polos",
    subtitle:
      "Classic collars, premium cotton and colours that pop. From ৳499.",
    cta: "Shop Polos",
    link: "/collections/polo",
    image: img("photo-1503341504253-dff4815485f1", 1920, 1080),
  },
];

export interface Category {
  title: string;
  image: string;
  link: string;
}

export const categories: Category[] = [
  { title: "Drop Shoulder", image: images.manGrey, link: "/collections/drop-shoulder" },
  { title: "Wear Bangladesh", image: images.rack2, link: "/signature-series" },
  { title: "Banglar Khadok", image: images.foldedTees, link: "/collections/banglar-khadok" },
  { title: "Ekdom Solid", image: images.tees, link: "/collections/solid" },
  { title: "Printed Tees", image: images.teeMock, link: "/collections/printed" },
  { title: "Better Together", image: images.fashion, link: "/collections/better-together" },
  { title: "Lifestyle Series", image: images.hoodieMan, link: "/collections/lifestyle" },
  { title: "Sweatpants", image: images.shirts, link: "/collections/sweatpant" },
  { title: "Full Sleeves", image: images.manWhite, link: "/collections/full-sleeves" },
  { title: "Polo Perfection", image: images.pinkTee, link: "/collections/polo" },
  { title: "Kiddo", image: images.teeHanger, link: "/collections/kiddo" },
  { title: "See Everything", image: images.store, link: "/shop" },
];

export interface Highlight {
  title: string;
  image: string;
  link: string;
}

export const highlights: Highlight[] = [
  { title: "Bangladesh Heritage", image: images.rack2, link: "/shop" },
  { title: "Igris Shadow Blade", image: images.teeMock, link: "/shop" },
  { title: "Pure Black", image: images.manGrey, link: "/collections/solid" },
  { title: "For Her", image: images.fashion, link: "/shop" },
  { title: "Wear Bangladesh", image: images.foldedTees, link: "/signature-series" },
];

export const inspire = [
  { image: images.hoodie, link: "/shop", label: "Fresh Drop" },
  { image: images.store, link: "/shop", label: "Outlets" },
  { image: images.manWhite, link: "/shop", label: "Best Sellers" },
  { image: images.pinkTee, link: "/collections/polo", label: "Polo Perfection" },
];

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  badge?: string;
}

type Spec = [string, string, number, number?];

let nextId = 0;

function buildProducts(specs: Spec[], badge?: string): Product[] {
  return specs.map(([title, image, price, originalPrice]) => ({
    id: ++nextId,
    title,
    image: img(image),
    price,
    originalPrice,
    badge,
  }));
}

export const vibeProducts: Product[] = buildProducts(
  [
    ["Classic Yellow Polo with Black Collar", "photo-1503341504253-dff4815485f1", 720, 890],
    ["Drop Shoulder T-Shirt (Spiderman BND)", "photo-1622445275576-721325763afe", 560, 590],
    ["Kids Solid T-Shirt - Pink", "photo-1556906781-9a412961c28c", 250, 299],
    ["Drop Shoulder T-Shirt (I'm Busybin)", "photo-1521572163474-6864f9cf17ab", 560, 590],
    ["Drop Shoulder T-Shirt (Wings of Freedom)", "photo-1583744946564-b52ac1c389c8", 560, 590],
    ["Drop Shoulder T-Shirt (Style Grovy)", "photo-1578681994506-b8f463449011", 560, 590],
    ["Drop Shoulder T-Shirt (Sea Flower)", "photo-1583743814966-8936f5b7be1a", 560, 590],
    ["Drop Shoulder T-Shirt (Pink Panther 03)", "photo-1556905055-8f358a7a47b2", 560, 590],
    ["Premium Solid Polo: Deep Brown", "photo-1562157873-818bc0726f68", 499, 790],
    ["Solid Drop Shoulder T-Shirt (Maroon)", "photo-1543076447-215ad9ba6923", 360, 390],
    ["Solid T Shirt - Pure Black", "photo-1596755094514-f87e34085b2c", 320, 350],
    ["Half Sleeve Turtle Neck (Black)", "photo-1441986300917-64674bd600d8", 399],
  ],
  "Half/Drop Available"
);

export const mostWanted: Product[] = buildProducts(
  [
    ["Drop Shoulder T-Shirt (Ragnar Lothbrok)", "photo-1503341504253-dff4815485f1", 560, 590],
    ["Solid Drop Shoulder T-Shirt (Maroon)", "photo-1521572163474-6864f9cf17ab", 360, 390],
    ["Solid Drop Shoulder T-Shirt (Black)", "photo-1583744946564-b52ac1c389c8", 360, 390],
    ["Solid Drop Shoulder T-Shirt (Olive Green)", "photo-1556906781-9a412961c28c", 360, 390],
    ["Drop Shoulder T-Shirt (Birds)", "photo-1576566588028-4147f3842f27", 560, 590],
    ["Drop Shoulder T-Shirt (Multi Band 02)", "photo-1622445275576-721325763afe", 560, 590],
    ["Drop Shoulder T-Shirt (Owl)", "photo-1583743814966-8936f5b7be1a", 560, 590],
    ["Solid Drop Shoulder T-Shirt (White)", "photo-1596755094514-f87e34085b2c", 360, 390],
    ["Drop Shoulder T-Shirt (Art 03)", "photo-1556905055-8f358a7a47b2", 560, 590],
    ["Drop Shoulder T-Shirt (Sherlock x Starry Night)", "photo-1523381210434-271e8be1f52b", 560, 590],
    ["Solid T Shirt - Pure Black", "photo-1543076447-215ad9ba6923", 320, 350],
    ["Half Sleeve Turtle Neck (Black)", "photo-1441986300917-64674bd600d8", 399],
  ],
  "Most Wanted"
);

export const newIn: Product[] = buildProducts(
  [
    ["Classic Yellow Polo with Black Collar", "photo-1503341504253-dff4815485f1", 720, 890],
    ["Classic Melange Polo with Black Collar", "photo-1562157873-818bc0726f68", 720, 890],
    ["Kids Solid T-Shirt - Pink", "photo-1556906781-9a412961c28c", 250, 299],
    ["Kids Solid T-Shirt - Maroon", "photo-1583744946564-b52ac1c389c8", 250, 299],
    ["Premium Solid Polo: Navy Blue", "photo-1521572163474-6864f9cf17ab", 499, 790],
    ["Premium Solid Polo: Royal Blue", "photo-1622445275576-721325763afe", 499, 790],
    ["Premium Solid Polo: Bottle Green", "photo-1576566588028-4147f3842f27", 499, 790],
    ["Premium Solid Polo: Red", "photo-1583743814966-8936f5b7be1a", 499, 790],
    ["Premium Solid Polo: White", "photo-1596755094514-f87e34085b2c", 499, 790],
    ["Premium Solid Polo: Black", "photo-1543076447-215ad9ba6923", 499, 790],
    ["Solid T Shirt - Yellow", "photo-1556905055-8f358a7a47b2", 320, 350],
    ["Solid T Shirt - Urban Grey", "photo-1578681994506-b8f463449011", 320, 350],
  ]
);

export const bestDeal: Product[] = buildProducts(
  [
    ["Best Deal: Solid Polo (3 Pieces)", "photo-1562157873-818bc0726f68", 1299, 2370],
    ["Best Deal: Solid Half Sleeve (3 Pieces)", "photo-1521572163474-6864f9cf17ab", 899, 1050],
    ["Basic T-Shirt Combo", "photo-1441986300917-64674bd600d8", 1099, 1290],
    ["Premium Solid Polo: Deep Brown", "photo-1503341504253-dff4815485f1", 499, 790],
    ["Premium Solid Polo: Navy Blue", "photo-1576566588028-4147f3842f27", 499, 790],
    ["Premium Solid Polo: Royal Blue", "photo-1556906781-9a412961c28c", 499, 790],
    ["Premium Solid Polo: Bottle Green", "photo-1583743814966-8936f5b7be1a", 499, 790],
    ["Premium Solid Polo: Red", "photo-1622445275576-721325763afe", 499, 790],
    ["Premium Solid Polo: White", "photo-1543076447-215ad9ba6923", 499, 790],
    ["Premium Solid Polo: Black", "photo-1596755094514-f87e34085b2c", 499, 790],
    ["Solid T Shirt - Yellow", "photo-1556905055-8f358a7a47b2", 320, 350],
    ["Solid T Shirt - Urban Grey", "photo-1578681994506-b8f463449011", 320, 350],
  ],
  "Best Deal"
);

export const deshiTalk: Product[] = buildProducts(
  [
    ["Deshi Talk T Shirt: Asol", "photo-1583743814966-8936f5b7be1a", 560, 590],
    ["Deshi Talk T Shirt: Gorib", "photo-1521572163474-6864f9cf17ab", 560, 590],
    ["Deshi Talk T Shirt: Premik", "photo-1556906781-9a412961c28c", 560, 590],
    ["Deshi Talk T Shirt: Porashuna", "photo-1583744946564-b52ac1c389c8", 560, 590],
    ["Deshi Talk T Shirt: Prem", "photo-1503341504253-dff4815485f1", 560, 590],
    ["Deshi Talk T Shirt: Valobasa", "photo-1622445275576-721325763afe", 560, 590],
    ["Deshi Talk T Shirt: Sopno Vasai", "photo-1596755094514-f87e34085b2c", 560, 590],
    ["Deshi Talk T Shirt: Tumi", "photo-1543076447-215ad9ba6923", 560, 590],
    ["Deshi Talk T Shirt: Shanti Nai", "photo-1578681994506-b8f463449011", 560, 590],
    ["Deshi Talk T Shirt: Moner Agun", "photo-1441986300917-64674bd600d8", 560, 590],
    ["Deshi Talk T Shirt: Nosto Chatri", "photo-1556905055-8f358a7a47b2", 560, 590],
    ["Deshi Talk T Shirt: Drama", "photo-1562157873-818bc0726f68", 560, 590],
  ],
  "Half/Drop Available"
);

export const seeProducts: Product[] = [
  vibeProducts[0],
  mostWanted[1],
  deshiTalk[0],
  mostWanted[0],
  newIn[0],
];

export const newInList: Product[] = [
  newIn[0],
  newIn[1],
  newIn[2],
  newIn[3],
  newIn[9],
];

export const influencers = [
  "Sabnam Faria, Actor",
  "Emon, ATC",
  "Nidra Dey Neha, Actor",
  "Munem Shahrriar, Dads In The Park",
  "FK, Content Creator",
  "Jannat Ul Ferdous Bismee, Model",
  "Metro Man, Content Creator",
  "Liliput Farhan, Content Creator",
  "Badshaa The Mafiz, Content Creator",
  "Rafayat Rakib, Content Creator",
  "Ferdous Ahsan Orko, Makeup Artist",
  "PC Builder Bangladesh",
  "ENCORE, Music Band",
  "BitiK BaaZ, Content Creator",
  "Shameem Hossen, Public Figure",
  "Tech to the Point, Content Creator",
  "Sudipto Sinha, Shironamhin",
  "Tanmoy Cartoons, Artist",
  "Arfan Mredha Shiblu, Bachelor Point",
  "Hasin Aryan, Firoze Jong",
  "Mahim Azad Prem, Content Creator",
  "Dads In The Park, Music Band",
  "Shamima Afrin Omi",
];

export interface NavLink {
  title: string;
  link?: string;
  submenu?: { title: string; link: string }[];
  columns?: { title: string; items: { title: string; link: string }[] }[];
}

export const navigationLinks: NavLink[] = [
  { title: "Big Sale", link: "/big-sale" },
  { title: "NEW", link: "/new" },
  { title: "Most Wanted", link: "/most-wanted" },
  {
    title: "Budget Pick",
    submenu: [
      { title: "Iconic T-Shirt", link: "/budget/iconic" },
      { title: "3 FOR 899", link: "/budget/3-for-899" },
      { title: "Flash Sale", link: "/budget/flash-sale" },
      { title: "Best Deal", link: "/budget/best-deal" },
      { title: "Summer Pack", link: "/budget/summer-pack" },
    ],
  },
];

const rawProducts = [
  ...vibeProducts,
  ...mostWanted,
  ...newIn,
  ...bestDeal,
  ...deshiTalk,
];

export const allProducts = rawProducts.filter(
  (p, i, arr) => arr.findIndex((x) => x.title === p.title) === i
);

const productById = new Map(allProducts.map((p) => [p.id, p]));

export function getProduct(id: number): Product | undefined {
  return productById.get(id);
}

export interface ShopMeta {
  title: string;
  description: string;
  products: Product[];
}

export const collectionPages: Record<string, ShopMeta> = {
  "drop-shoulder": {
    title: "Drop Shoulder T-Shirts",
    description:
      "Oversized fits, premium cotton and everyday swag. The most wanted silhouette in BD.",
    products: vibeProducts.slice(0, 9),
  },
  "half-sleeves": {
    title: "Printed Half Sleeves",
    description: "Bold prints on classic half sleeves — made to turn heads.",
    products: newIn.slice(0, 8),
  },
  "full-sleeves": {
    title: "Full Sleeves",
    description: "Layered looks and long sleeves for every mood.",
    products: mostWanted.slice(0, 8),
  },
  "solid-sweatpant": {
    title: "Solid Sweatpants",
    description: "Clean, comfy sweatpants in solid colours.",
    products: mostWanted.slice(2, 10),
  },
  sweatpant: {
    title: "Sweatpants",
    description: "Everyday bottoms built for comfort and style.",
    products: newIn.slice(2, 10),
  },
  hoodie: {
    title: "Hoodies",
    description: "Warm, cozy and effortlessly cool.",
    products: mostWanted.slice(4, 12),
  },
  sweatshirt: {
    title: "Sweatshirts",
    description: "Chunky comfort for the colder days.",
    products: bestDeal.slice(2, 10),
  },
  "turtle-neck": {
    title: "Turtle Necks",
    description: "Classic turtle necks, redefined for the streets.",
    products: vibeProducts.slice(3, 11),
  },
  kiddo: {
    title: "Kiddo T-Shirts",
    description: "Fun, durable tees for the little ones.",
    products: newIn.slice(2, 9),
  },
  "kiddo-solid": {
    title: "Kiddo Solid",
    description: "Solid colour tees for kids — soft and strong.",
    products: bestDeal.slice(3, 11),
  },
  solid: {
    title: "Pure Solid",
    description: "Ekdom solid. No prints, no fuss — just premium cotton.",
    products: mostWanted.slice(0, 8),
  },
  "solid-half": {
    title: "Solid Half Sleeves",
    description: "The classic half sleeve tee in every essential colour.",
    products: newIn.slice(5, 12),
  },
  "solid-hoodie": {
    title: "Solid Hoodies",
    description: "Minimal hoodies in the shades you need.",
    products: vibeProducts.slice(4, 12),
  },
  polo: {
    title: "Polo Perfection",
    description: "Premium solid polos — classic collars, modern fits. From ৳499.",
    products: bestDeal.slice(0, 9),
  },
  winter: {
    title: "Winter Essentials",
    description: "Hoodies, sweatshirts and turtlenecks to beat the cold.",
    products: mostWanted.slice(3, 12),
  },
  printed: {
    title: "Printed T-Shirts",
    description: "Fandom, art and attitude — printed tees that speak.",
    products: vibeProducts.slice(0, 10),
  },
  "banglar-khadok": {
    title: "Banglar Khadok",
    description: "Deshi flavours, bold statements.",
    products: deshiTalk.slice(0, 9),
  },
  "better-together": {
    title: "Better Together",
    description: "Couple tees and matching sets made for two.",
    products: vibeProducts.slice(2, 10),
  },
  lifestyle: {
    title: "Lifestyle Series",
    description: "Beyond the basics — pieces for every part of life.",
    products: mostWanted.slice(1, 10),
  },
};

export const collectionAllProducts = Array.from(
  new Set(Object.values(collectionPages).flatMap((m) => m.products))
);

export const signaturePages: Record<string, ShopMeta> = {
  "tobarok-squad": {
    title: "Iconic tobarok Squad",
    description: "The tees that started it all.",
    products: mostWanted.slice(0, 8),
  },
  "bangla-verse": {
    title: "Bangla Verse",
    description: "Bangla words worn with pride.",
    products: deshiTalk.slice(1, 9),
  },
  "deshi-talk": {
    title: "Deshi Talk",
    description: "Real talk, deshi style.",
    products: deshiTalk,
  },
  "banglar-khadok": {
    title: "Banglar Khadok",
    description: "Big claims, bigger fits.",
    products: deshiTalk.slice(2, 10),
  },
  premium: {
    title: "Premium Items",
    description: "The best of the best. Limited drops, premium quality.",
    products: bestDeal.slice(0, 8),
  },
};

export const signatureAllProducts = Array.from(
  new Set(Object.values(signaturePages).flatMap((m) => m.products))
);

export const budgetPages: Record<string, ShopMeta> = {
  iconic: {
    title: "Iconic T-Shirt",
    description: "The iconic tobarok fit at a price you'll love.",
    products: mostWanted.slice(0, 9),
  },
  "3-for-899": {
    title: "3 FOR 899",
    description: "Pick any 3 tees for only ৳899.",
    products: vibeProducts.slice(0, 9),
  },
  "flash-sale": {
    title: "Flash Sale",
    description: "Limited time. Limited stock. Huge savings.",
    products: bestDeal.slice(0, 10),
  },
  "best-deal": {
    title: "Best Deal",
    description: "Our best combos and bundles, all in one place.",
    products: bestDeal,
  },
  "summer-pack": {
    title: "Summer Pack",
    description: "Everything you need to beat the heat.",
    products: newIn.slice(0, 10),
  },
};

export const budgetAllProducts = Array.from(
  new Set(Object.values(budgetPages).flatMap((m) => m.products))
);

export const accessoryPages: Record<string, ShopMeta> = {
  cap: {
    title: "Caps",
    description: "Finish the fit with a fresh cap.",
    products: newIn.slice(0, 6),
  },
  socks: {
    title: "Socks",
    description: "Socks that show up even when your pants don't.",
    products: newIn.slice(1, 7),
  },
  bandana: {
    title: "Bandana Scarves",
    description: "The detail that pulls everything together.",
    products: vibeProducts.slice(0, 6),
  },
  bag: {
    title: "Bags",
    description: "Carry your essentials in style.",
    products: mostWanted.slice(0, 6),
  },
  sunglasses: {
    title: "Sunglasses",
    description: "Shade with attitude.",
    products: newIn.slice(2, 8),
  },
};

export const accessoryAllProducts = Array.from(
  new Set(Object.values(accessoryPages).flatMap((m) => m.products))
);

export const featuredPages: Record<string, ShopMeta> = {
  new: {
    title: "New In",
    description: "Fresh drops, fresh fits. Be the first to wear them.",
    products: newIn,
  },
  "most-wanted": {
    title: "Most Wanted",
    description: "The pieces everyone is talking about right now.",
    products: mostWanted,
  },
  "big-sale": {
    title: "Big Sale",
    description: "Huge discounts on your favourite fits. While stocks last.",
    products: Array.from(
      new Set([...bestDeal, ...vibeProducts.slice(0, 6)])
    ),
  },
};

export const sizes = ["S", "M", "L", "XL", "XXL"];

export const faqs = [
  {
    q: "How long does delivery take?",
    a: "Dhaka deliveries arrive within 24–72 hours. Outside Dhaka, allow 3–5 business days depending on your location.",
  },
  {
    q: "What is your return/exchange policy?",
    a: "You can exchange any unworn item with tags intact within 7 days of delivery. Clearance sale items are not eligible for exchange.",
  },
  {
    q: "How do I track my order?",
    a: "Head to the Track Order page and enter your order ID and phone number. You'll see live delivery updates there.",
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Yes, we offer cash on delivery across Bangladesh on all orders.",
  },
  {
    q: "Can I order in bulk or customise t-shirts?",
    a: "Absolutely. Visit the Custom/Bulk page and share your requirement — our team will get back to you within 24 hours.",
  },
  {
    q: "How do I find my size?",
    a: "Check the Size Chart page for detailed measurements of every fit.",
  },
];

export const outlets = [
  {
    name: "Mirpur Flagship Store",
    area: "Mirpur 10, Dhaka",
    hours: "10:00 AM – 10:00 PM",
    phone: "+880 1XXX-XXXXXX",
  },
  {
    name: "Dhanmondi Store",
    area: "Road 27, Dhanmondi, Dhaka",
    hours: "10:00 AM – 10:00 PM",
    phone: "+880 1XXX-XXXXXX",
  },
  {
    name: "Gulshan Store",
    area: "Gulshan 2, Dhaka",
    hours: "11:00 AM – 9:00 PM",
    phone: "+880 1XXX-XXXXXX",
  },
  {
    name: "Uttara Store",
    area: "Uttara Sector 7, Dhaka",
    hours: "10:00 AM – 10:00 PM",
    phone: "+880 1XXX-XXXXXX",
  },
  {
    name: "Chattogram Store",
    area: "GEC Circle, Chattogram",
    hours: "10:00 AM – 9:30 PM",
    phone: "+880 1XXX-XXXXXX",
  },
  {
    name: "Sylhet Store",
    area: "Zindabazar, Sylhet",
    hours: "10:00 AM – 9:00 PM",
    phone: "+880 1XXX-XXXXXX",
  },
];
