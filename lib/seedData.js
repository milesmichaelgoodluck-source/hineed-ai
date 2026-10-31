// Seed data lifted directly from the Hineed preview so the live app matches
// the design exactly. Edit here (or via the admin API) to change the catalog.

export const CATEGORIES = [
  { id: "cleaner", label: "Cleaning" },
  { id: "painter", label: "Painter" },
  { id: "plumber", label: "Plumber" },
  { id: "electrician", label: "Electrician" },
  { id: "laundry", label: "Laundry" },
  { id: "carwash", label: "Car wash" },
  { id: "waste", label: "Waste mgmt" },
  { id: "mechanic", label: "Mechanic" },
];

export const CHARGES = {
  cleaner: [
    ["Standard home clean", "₦15,000"],
    ["Deep clean (3-bed)", "₦25,000"],
    ["Move-in / move-out", "₦30,000"],
    ["Office cleaning", "from ₦40k/mo"],
  ],
  painter: [
    ["1-bedroom (walls)", "₦40,000"],
    ["Full flat repaint", "₦120,000"],
    ["Exterior / fence", "Quote"],
  ],
  plumber: [
    ["Call-out & diagnosis", "₦8,000"],
    ["Tap / pipe repair", "from ₦12,000"],
    ["Full installation", "Quote"],
  ],
  electrician: [
    ["Call-out & diagnosis", "₦9,000"],
    ["Wiring repair", "from ₦15,000"],
    ["Inverter / solar setup", "Quote"],
  ],
  laundry: [
    ["Wash & fold (per bag)", "₦3,500"],
    ["Ironing (per item)", "₦300"],
    ["Duvet / curtains", "from ₦5,000"],
  ],
  carwash: [
    ["Exterior wash", "₦2,500"],
    ["Full valet (in & out)", "₦6,000"],
    ["Engine wash", "₦4,000"],
  ],
  waste: [
    ["Weekly pickup", "₦5,000/mo"],
    ["One-off haul", "from ₦8,000"],
    ["Commercial contract", "Quote"],
  ],
  mechanic: [
    ["Diagnostic check", "₦7,000"],
    ["Oil & filter service", "from ₦18,000"],
    ["Major repair", "Quote"],
  ],
};

export const PROVIDERS = [
  { id: "brightclean", name: "Chidi Okoro", category: "cleaner", area: "GRA Phase 2", rating: 4.9, reviewCount: 320, bio: "Professional home & office cleaning crew. Deep cleans, move-in/out and post-construction. Background-checked, insured, 4-hour response in GRA." },
  { id: "sparklehome", name: "Blessing Eze", category: "cleaner", area: "D-Line", rating: 4.7, reviewCount: 180, bio: "Friendly, detail-focused home cleaning. Flexible scheduling and eco-friendly products." },
  { id: "freshspace", name: "Ifeoma Nwankwo", category: "cleaner", area: "Rumuola", rating: 4.8, reviewCount: 95, bio: "Residential and office cleaning specialists with a trained, vetted team." },
  { id: "propaint", name: "Emeka Obi", category: "painter", area: "D-Line", rating: 4.8, reviewCount: 140, bio: "Interior and exterior painting with a clean, smooth finish. Free colour consultation." },
  { id: "colorcraft", name: "Samuel Ade", category: "painter", area: "Trans-Amadi", rating: 4.6, reviewCount: 70, bio: "Decorative and standard painting for homes and businesses. Neat and on-time." },
  { id: "fixit", name: "Tochukwu Daniel", category: "plumber", area: "Rumuola", rating: 4.7, reviewCount: 210, bio: "Fast, reliable plumbing repairs and installations. Emergency call-outs available." },
  { id: "aquaflow", name: "Henry Okon", category: "plumber", area: "Woji", rating: 4.8, reviewCount: 130, bio: "Licensed plumbers for leaks, fittings, water systems and full installs." },
  { id: "sparkelec", name: "Uche Bassey", category: "electrician", area: "GRA", rating: 4.9, reviewCount: 260, bio: "Certified electricians for wiring, faults, inverters and solar. Safety-first." },
  { id: "powerpro", name: "David Johnson", category: "electrician", area: "Eliozu", rating: 4.7, reviewCount: 88, bio: "Domestic and commercial electrical work. Honest quotes, tidy jobs." },
  { id: "freshlaundry", name: "Grace Amadi", category: "laundry", area: "Mile 1", rating: 4.6, reviewCount: 150, bio: "Wash, dry, fold and ironing with free pickup and delivery in the area." },
  { id: "cleanpress", name: "Rita Peter", category: "laundry", area: "GRA", rating: 4.8, reviewCount: 110, bio: "Premium laundry and dry-cleaning. Same-day service on request." },
  { id: "shiny", name: "Kelvin Umeh", category: "carwash", area: "Trans-Amadi", rating: 4.8, reviewCount: 300, bio: "Hand car wash and full valeting. Mobile service comes to you." },
  { id: "autoglow", name: "Joseph Ani", category: "carwash", area: "Aba Rd", rating: 4.6, reviewCount: 120, bio: "Interior and exterior detailing that makes your car look new." },
  { id: "greenbin", name: "Victor Eke", category: "waste", area: "PH City", rating: 4.7, reviewCount: 90, bio: "Reliable household and commercial waste collection and disposal." },
  { id: "autofix", name: "Musa Ibrahim", category: "mechanic", area: "Rumuokoro", rating: 4.8, reviewCount: 200, bio: "Full-service garage: diagnostics, servicing and repairs for all makes." },
  { id: "motorcare", name: "Sunday Effiong", category: "mechanic", area: "Aba Rd", rating: 4.7, reviewCount: 140, bio: "Trusted mechanics for servicing, brakes, AC and engine repair." },
];

// Sample reviews attached to every provider (as in the preview).
export const REVIEWS = [
  { author: "Amaka O.", rating: 5, body: "Prompt, professional and very neat. Highly recommend!" },
  { author: "Tunde A.", rating: 5, body: "Great job and fair pricing. Booked again already." },
  { author: "Ngozi E.", rating: 4, body: "Arrived on time and did solid work. Very satisfied." },
];

// Starter marketplace — real shops and products so the marketplace is alive
// from day one. These are real, orderable records (not fake HTML tiles):
// customers can view, order and message them like any seller's listing.
export const SHOPS = [
  { id: "shop-kanotech",   name: "KanoTech Store",       kind: "Electronics",     area: "D-Line",      rating: 4.8, avatar: "K", color: "a2" },
  { id: "shop-mamankem",   name: "Mama Nkem's Kitchen",  kind: "Meals & dishes",  area: "GRA",         rating: 4.9, avatar: "M", color: "a4" },
  { id: "shop-glow",       name: "Glow Hair & Beauty",   kind: "Hair & beauty",   area: "Mile 1",      rating: 4.7, avatar: "G", color: "a3" },
  { id: "shop-homemart",   name: "HomeMart",             kind: "Groceries & home",area: "Trans-Amadi", rating: 4.6, avatar: "H", color: "a1" },
  { id: "shop-riverpharm", name: "RiverPharm",           kind: "Pharmacy",        area: "Rumuola",     rating: 4.9, avatar: "R", color: "a6" },
];

export const PRODUCTS = [
  { id: "sp-fan",      ownerId: "shop-kanotech",   shop: "KanoTech Store",      name: "Rechargeable standing fan", price: "₦42,000", category: "Electronics",    description: "16-inch rechargeable fan with USB charging, LED light and up to 8 hours of backup." },
  { id: "sp-powerbank",ownerId: "shop-kanotech",   shop: "KanoTech Store",      name: "20,000mAh power bank",      price: "₦18,500", category: "Electronics",    description: "Fast-charge power bank with dual USB ports and type-C input." },
  { id: "sp-blender",  ownerId: "shop-kanotech",   shop: "KanoTech Store",      name: "2-litre blender set",       price: "₦24,900", category: "Electronics",    description: "Powerful blender with grinder jar, ideal for smoothies, soups and spices." },
  { id: "sp-jollof",   ownerId: "shop-mamankem",   shop: "Mama Nkem's Kitchen", name: "Jollof rice + plantain",    price: "₦2,900",  category: "Meals & dishes", description: "Smoky party jollof with fried plantain and your choice of protein. Freshly cooked." },
  { id: "sp-friedrice",ownerId: "shop-mamankem",   shop: "Mama Nkem's Kitchen", name: "Fried rice + chicken",      price: "₦3,500",  category: "Meals & dishes", description: "Vegetable fried rice with grilled chicken and coleslaw. Ready in 30 minutes." },
  { id: "sp-wig",      ownerId: "shop-glow",       shop: "Glow Hair & Beauty",  name: "Lace front wig 24\"",       price: "₦35,000", category: "Hair & beauty",  description: "Pre-plucked HD lace front wig, soft and natural, ready to wear." },
  { id: "sp-bundle",   ownerId: "shop-glow",       shop: "Glow Hair & Beauty",  name: "Human hair bundle",         price: "₦28,000", category: "Hair & beauty",  description: "Double-drawn human hair bundle, can be dyed and styled. Long-lasting." },
  { id: "sp-cooker",   ownerId: "shop-homemart",   shop: "HomeMart",            name: "4-burner gas cooker",       price: "₦78,500", category: "Groceries & home",description: "Standing 4-burner gas cooker with oven and grill. Auto-ignition." },
  { id: "sp-chair",    ownerId: "shop-homemart",   shop: "HomeMart",            name: "Ergonomic office chair",    price: "₦55,000", category: "Groceries & home",description: "Adjustable mesh-back office chair with lumbar support and armrests." },
  { id: "sp-rice",     ownerId: "shop-homemart",   shop: "HomeMart",            name: "Rice 50kg bag",             price: "₦82,000", category: "Groceries & home",description: "Premium long-grain parboiled rice, 50kg. Stone-free and well-dried." },
  { id: "sp-gas",      ownerId: "shop-homemart",   shop: "HomeMart",            name: "Cooking gas refill 12.5kg", price: "₦14,000", category: "Groceries & home",description: "12.5kg LPG cooking gas refill with free doorstep delivery." },
  { id: "sp-para",     ownerId: "shop-riverpharm", shop: "RiverPharm",          name: "Paracetamol pack",          price: "₦1,200",  category: "Pharmacy",       description: "Pack of paracetamol 500mg tablets for pain and fever relief." },
  { id: "sp-vitc",     ownerId: "shop-riverpharm", shop: "RiverPharm",          name: "Vitamin C 1000mg (30s)",    price: "₦2,800",  category: "Pharmacy",       description: "Immune-support vitamin C tablets, 1000mg, 30 per bottle." },
];

// One more food vendor + dishes so the Food page is full and orderable.
export const FOOD_SHOPS = [
  { id: "shop-chop", name: "Chop Republic", kind: "Meals & dishes", area: "GRA", rating: 4.7, avatar: "C", color: "a5" },
];
export const FOOD_PRODUCTS = [
  { id: "fp-poundedyam", ownerId: "shop-mamankem", shop: "Mama Nkem's Kitchen", name: "Pounded yam + egusi", price: "₦3,200", category: "Meals & dishes", description: "Smooth pounded yam with rich egusi soup and assorted meat." },
  { id: "fp-peppersoup", ownerId: "shop-mamankem", shop: "Mama Nkem's Kitchen", name: "Catfish pepper soup", price: "₦3,500", category: "Meals & dishes", description: "Hot, spicy fresh catfish pepper soup. Perfect for the evening." },
  { id: "fp-shawarma",  ownerId: "shop-chop",     shop: "Chop Republic",       name: "Large chicken shawarma", price: "₦2,500", category: "Meals & dishes", description: "Loaded chicken shawarma with sausage, veggies and special sauce." },
  { id: "fp-smallchops",ownerId: "shop-chop",     shop: "Chop Republic",       name: "Small chops platter", price: "₦5,000", category: "Meals & dishes", description: "Puff-puff, spring rolls, samosa, gizzard and peppered chicken." },
  { id: "fp-meatpie",   ownerId: "shop-chop",     shop: "Chop Republic",       name: "Meat pie (pack of 2)", price: "₦1,500", category: "Meals & dishes", description: "Flaky, well-filled meat pies baked fresh daily." },
  { id: "fp-smoothie",  ownerId: "shop-chop",     shop: "Chop Republic",       name: "Fruit smoothie bowl", price: "₦2,000", category: "Meals & dishes", description: "Blended banana, mango and berries topped with granola." },
];

// Real-estate listings — real, viewable, and you can message the agent.
export const LISTINGS = [
  { id: "re-flat2",   title: "2-bed serviced flat",      type: "Home rental",   price: "₦1.45m", period: "/yr",    area: "GRA Phase 2",   beds: 2, baths: 2, agentId: "agent-phhomes",  agent: "PH Homes",        verified: true,  desc: "Newly serviced two-bedroom apartment in a quiet, gated compound. 24/7 power, treated water, fitted kitchen and secure parking." },
  { id: "re-duplex",  title: "4-bed detached duplex",    type: "For sale",      price: "₦120m",  period: "",       area: "Peter Odili Rd", beds: 4, baths: 5, agentId: "agent-coastal",  agent: "Coastal Realty",  verified: true,  desc: "Spacious 4-bedroom detached duplex with BQ, ample parking, and a modern finish throughout. C-of-O title available." },
  { id: "re-land",    title: "2 plots of land",          type: "Land leasing",  price: "₦2.5m",  period: "/yr",    area: "Eneka",          beds: 0, baths: 0, agentId: "agent-coastal",  agent: "Coastal Realty",  verified: false, desc: "Two dry plots of land in a fast-developing area, suitable for residential or light commercial use. Lease terms negotiable." },
  { id: "re-shortlet",title: "Luxury shortlet apartment",type: "Hospitality",   price: "₦45,000",period: "/night", area: "Old GRA",        beds: 1, baths: 1, agentId: "agent-staysphc", agent: "Stays PHC",       verified: true,  desc: "Fully furnished 1-bedroom shortlet with fast Wi-Fi, Netflix, 24/7 power and daily housekeeping. Great for business travel." },
  { id: "re-hotel",   title: "Presidential hotel suite", type: "Hotels",        price: "₦85,000",period: "/night", area: "Trans-Amadi",    beds: 1, baths: 1, agentId: "agent-staysphc", agent: "Stays PHC",       verified: true,  desc: "Premium hotel suite with lounge, en-suite, breakfast included, pool and gym access." },
  { id: "re-event",   title: "Grand event centre",       type: "Event centres", price: "₦650,000",period: "/day",  area: "GRA",            beds: 0, baths: 0, agentId: "agent-phhomes",  agent: "PH Homes",        verified: true,  desc: "Elegant 800-capacity event centre with parking, power, AC, staging and catering support available." },
  { id: "re-terrace", title: "3-bed terrace duplex",     type: "Home rental",   price: "₦3.5m",  period: "/yr",    area: "Woji",           beds: 3, baths: 4, agentId: "agent-phhomes",  agent: "PH Homes",        verified: true,  desc: "Modern 3-bedroom terrace in a serviced estate with security, green areas and constant water." },
  { id: "re-office",  title: "Office space (open plan)", type: "For sale",      price: "₦45m",   period: "",       area: "D-Line",         beds: 0, baths: 2, agentId: "agent-coastal",  agent: "Coastal Realty",  verified: true,  desc: "Open-plan office of ~180sqm on a busy road, with parking and backup power. Ideal for a growing team." },
];

// Jobs — real postings, you can apply (sends your application to the poster).
export const JOBS = [
  { id: "job-frontend", title: "Frontend Developer", company: "Flux PH",        type: "Full-time", pay: "₦450k–₦650k/mo", cat: "Tech",   area: "Port Harcourt", posterId: "emp-flux",     desc: "Build and maintain web apps in React/Next.js. 3+ years experience. Hybrid." },
  { id: "job-sales",    title: "Sales Representative",company: "Naija Retail",   type: "Full-time", pay: "₦180k + comm.",  cat: "Sales",  area: "Port Harcourt", posterId: "emp-naija",    desc: "Drive retail sales, build client relationships and hit monthly targets. Commission on top of base." },
  { id: "job-admin",    title: "Admin Officer",       company: "GRA Properties", type: "Full-time", pay: "₦200k/mo",       cat: "Admin",  area: "GRA",           posterId: "emp-graprop",  desc: "Manage office operations, records, scheduling and front-desk duties. Strong organisation skills needed." },
  { id: "job-elec",     title: "Electrician (gig)",   company: "BuildRight",     type: "Contract",  pay: "₦40k/job",       cat: "Trades", area: "Port Harcourt", posterId: "emp-buildright",desc: "Certified electrician for project-based wiring and installations. Paid per completed job." },
  { id: "job-support",  title: "Customer Support",    company: "Hineed",         type: "Full-time", pay: "₦150k/mo",       cat: "Admin",  area: "Remote",        posterId: "emp-hineed",   desc: "Help customers over chat and calls. Friendly, patient and fluent in English. Remote, with equipment provided." },
  { id: "job-rider",    title: "Delivery Rider",      company: "Swift Logistics",type: "Gig",       pay: "₦120k/mo",       cat: "Trades", area: "Port Harcourt", posterId: "emp-swift",    desc: "Own a bike? Deliver parcels around the city and earn weekly. Flexible hours." },
];

export const TALENT = [
  { id: "tal-chidi",  name: "Chidi N.",  role: "Frontend Developer", exp: "4 yrs",     rate: "₦500k/mo", color: "a3" },
  { id: "tal-zainab", name: "Zainab A.", role: "Sales Lead",         exp: "6 yrs",     rate: "₦350k/mo", color: "a4" },
  { id: "tal-tobi",   name: "Tobi E.",   role: "Electrician",        exp: "certified", rate: "₦40k/job", color: "a1" },
  { id: "tal-ada",    name: "Ada O.",    role: "Accountant",         exp: "ICAN",      rate: "₦420k/mo", color: "a5" },
];

// Available drivers shown on the ride screen (Uber-style). Real drivers who
// sign up appear alongside these.
export const RIDERS = [
  { id: "drv-emeka",  name: "Emeka U.",   vehicle: "Toyota Corolla",   plate: "RSH-241-KJ", rating: 4.9, trips: 1240, eta: "3 min",  type: "car",   price: "₦1,800" },
  { id: "drv-blessing",name: "Blessing A.",vehicle: "Kia Rio",          plate: "GRA-882-AB", rating: 4.8, trips: 870,  eta: "5 min",  type: "car",   price: "₦1,650" },
  { id: "drv-tunde",  name: "Tunde O.",    vehicle: "Bajaj (keke)",     plate: "PH-5521-TR", rating: 4.7, trips: 2100, eta: "2 min",  type: "keke",  price: "₦900"   },
  { id: "drv-grace",  name: "Grace N.",    vehicle: "Honda bike",       plate: "DSP-120-GN", rating: 4.9, trips: 3050, eta: "4 min",  type: "bike",  price: "₦1,200" },
  { id: "drv-sam",    name: "Samuel K.",   vehicle: "Toyota Sienna",    plate: "RSH-770-SK", rating: 4.8, trips: 540,  eta: "7 min",  type: "car",   price: "₦2,400" },
];
