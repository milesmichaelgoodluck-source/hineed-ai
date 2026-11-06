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
  { id: "shop-lagosjollof", name: "Lagos Jollof House", kind: "Meals & dishes", area: "Lagos", rating: 4.8, avatar: "L", color: "a4" },
  { id: "shop-abujabites", name: "Abuja Grill & Bites", kind: "Meals & dishes", area: "Abuja", rating: 4.6, avatar: "A", color: "a2" },
  { id: "shop-pepperpalace", name: "Pepper Palace", kind: "Meals & dishes", area: "Woji", rating: 4.9, avatar: "P", color: "a1" },
];
export const FOOD_PRODUCTS = [
  { id: "fp-poundedyam", ownerId: "shop-mamankem", shop: "Mama Nkem's Kitchen", name: "Pounded yam + egusi", price: "₦3,200", category: "Meals & dishes", description: "Smooth pounded yam with rich egusi soup and assorted meat." },
  { id: "fp-peppersoup", ownerId: "shop-mamankem", shop: "Mama Nkem's Kitchen", name: "Catfish pepper soup", price: "₦3,500", category: "Meals & dishes", description: "Hot, spicy fresh catfish pepper soup. Perfect for the evening." },
  { id: "fp-shawarma",  ownerId: "shop-chop",     shop: "Chop Republic",       name: "Large chicken shawarma", price: "₦2,500", category: "Meals & dishes", description: "Loaded chicken shawarma with sausage, veggies and special sauce." },
  { id: "fp-smallchops",ownerId: "shop-chop",     shop: "Chop Republic",       name: "Small chops platter", price: "₦5,000", category: "Meals & dishes", description: "Puff-puff, spring rolls, samosa, gizzard and peppered chicken." },
  { id: "fp-meatpie",   ownerId: "shop-chop",     shop: "Chop Republic",       name: "Meat pie (pack of 2)", price: "₦1,500", category: "Meals & dishes", description: "Flaky, well-filled meat pies baked fresh daily." },
  { id: "fp-smoothie",  ownerId: "shop-chop",     shop: "Chop Republic",       name: "Fruit smoothie bowl", price: "₦2,000", category: "Meals & dishes", description: "Blended banana, mango and berries topped with granola." },
  { id: "fp-ljollof",   ownerId: "shop-lagosjollof", shop: "Lagos Jollof House", name: "Party jollof + turkey", price: "₦4,500", category: "Meals & dishes", description: "Smoky Lagos party jollof with grilled turkey and fried plantain." },
  { id: "fp-lasun",     ownerId: "shop-lagosjollof", shop: "Lagos Jollof House", name: "Asun (spicy goat)", price: "₦5,000", category: "Meals & dishes", description: "Peppered, smoky goat meat tossed with onions and scotch bonnet." },
  { id: "fp-asuya",     ownerId: "shop-abujabites",  shop: "Abuja Grill & Bites", name: "Suya platter (large)", price: "₦3,500", category: "Meals & dishes", description: "Northern-style beef suya with yaji spice, onions and tomatoes." },
  { id: "fp-amasa",     ownerId: "shop-abujabites",  shop: "Abuja Grill & Bites", name: "Masa & miyan taushe", price: "₦2,800", category: "Meals & dishes", description: "Soft rice cakes with a rich pumpkin and groundnut soup." },
  { id: "fp-pfish",     ownerId: "shop-pepperpalace", shop: "Pepper Palace", name: "Grilled fish & plantain", price: "₦4,200", category: "Meals & dishes", description: "Whole grilled croaker with spicy sauce and fried plantain." },
  { id: "fp-pchicken",  ownerId: "shop-pepperpalace", shop: "Pepper Palace", name: "Peppered chicken & chips", price: "₦3,800", category: "Meals & dishes", description: "Golden peppered chicken with seasoned fries and coleslaw." },
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
  { id: "tal-chidi",  name: "Chidi N.",  role: "Frontend Developer", exp: "4 yrs",     rate: "₦500k/mo", color: "a3", location: "Port Harcourt", phone: "+2348060000001",
    skills: ["React", "Next.js", "TypeScript", "UI design"], available: "Full-time / remote",
    jobsWorked: ["Built an e-commerce site for a Lagos retailer", "Dashboard for a fintech startup", "Portfolio sites for 10+ SMEs"],
    bio: "Frontend developer with 4 years building fast, clean web apps. Comfortable owning a product from design to launch." },
  { id: "tal-zainab", name: "Zainab A.", role: "Sales Lead",         exp: "6 yrs",     rate: "₦350k/mo", color: "a4", location: "Abuja", phone: "+2348060000002",
    skills: ["B2B sales", "Team leadership", "CRM", "Negotiation"], available: "Full-time",
    jobsWorked: ["Grew retail revenue 40% in one year", "Led a 12-person sales team", "Opened 3 new regional markets"],
    bio: "Results-driven sales leader with 6 years closing deals and building high-performing teams across Nigeria." },
  { id: "tal-tobi",   name: "Tobi E.",   role: "Electrician",        exp: "certified", rate: "₦40k/job", color: "a1", location: "Port Harcourt", phone: "+2348060000003",
    skills: ["Wiring & rewiring", "Solar install", "Inverter setup", "Fault diagnosis"], available: "Gigs / contract",
    jobsWorked: ["Wired a 5-bedroom duplex in GRA", "Installed solar for 20+ homes", "Inverter setup for a clinic"],
    bio: "Certified electrician trusted for safe, neat installations. Solar and inverter specialist." },
  { id: "tal-ada",    name: "Ada O.",    role: "Accountant",         exp: "ICAN",      rate: "₦420k/mo", color: "a5", location: "Lagos", phone: "+2348060000004",
    skills: ["Bookkeeping", "Tax filing", "Payroll", "Financial reporting"], available: "Full-time / part-time",
    jobsWorked: ["Managed books for 5 SMEs", "Filed taxes for a logistics firm", "Set up payroll for a 30-staff company"],
    bio: "ICAN-certified accountant keeping small businesses compliant and clear on their numbers." },
];

// Available drivers shown on the ride screen (Uber-style). Real drivers who
// sign up appear alongside these.
export const RIDERS = [
  { id: "drv-emeka",  name: "Emeka U.",   vehicle: "Toyota Corolla",   plate: "RSH-241-KJ", rating: 4.9, trips: 1240, eta: "3 min",  type: "car",   price: "₦1,800", online: true,  phone: "+2348030000001", areas: ["GRA", "D-Line", "Trans-Amadi", "Rumuola"] },
  { id: "drv-blessing",name: "Blessing A.",vehicle: "Kia Rio",          plate: "GRA-882-AB", rating: 4.8, trips: 870,  eta: "5 min",  type: "car",   price: "₦1,650", online: true,  phone: "+2348030000002", areas: ["GRA Phase 2", "Old GRA", "Woji", "Eliozu"] },
  { id: "drv-tunde",  name: "Tunde O.",    vehicle: "Bajaj (keke)",     plate: "PH-5521-TR", rating: 4.7, trips: 2100, eta: "2 min",  type: "keke",  price: "₦900",   online: true,  phone: "+2348030000003", areas: ["Mile 1", "Mile 3", "Diobu", "Town"] },
  { id: "drv-grace",  name: "Grace N.",    vehicle: "Honda bike",       plate: "DSP-120-GN", rating: 4.9, trips: 3050, eta: "4 min",  type: "bike",  price: "₦1,200", online: true,  phone: "+2348030000004", areas: ["Rumuokoro", "Eliozu", "Eneka", "Airport Rd"] },
  { id: "drv-sam",    name: "Samuel K.",   vehicle: "Toyota Sienna",    plate: "RSH-770-SK", rating: 4.8, trips: 540,  eta: "7 min",  type: "car",   price: "₦2,400", online: false, phone: "+2348030000005", areas: ["Peter Odili Rd", "Trans-Amadi", "Woji"] },
];

// ===== Logistics & freight partners (international shipping) =====
export const FREIGHT = [
  { id: "frt-swiftcargo", name: "SwiftCargo Logistics", color: "a2", modes: ["Air", "Sea"], rating: 4.8, reviews: 212, eta: "7–14 days", priceFrom: "₦4,500/kg", phone: "+2348040000001",
    from: ["Nigeria"], to: ["United Kingdom", "United States", "China", "Ghana", "Canada"],
    bio: "Door-to-door export from Nigeria to the UK, US and Asia. Air & sea freight, customs clearing included." },
  { id: "frt-globallink", name: "GlobalLink Freight", color: "a1", modes: ["Sea", "Air"], rating: 4.7, reviews: 168, eta: "10–30 days", priceFrom: "$120/CBM", phone: "+2348040000002",
    from: ["China", "United States", "United Kingdom", "Dubai"], to: ["Nigeria"],
    bio: "Import specialist — China, US, UK & Dubai into Nigeria. Consolidation, sea containers and air cargo." },
  { id: "frt-naijaship", name: "NaijaShip Express", color: "a4", modes: ["Air"], rating: 4.9, reviews: 340, eta: "5–9 days", priceFrom: "₦6,000/kg", phone: "+2348040000003",
    from: ["Nigeria"], to: ["United States", "Canada", "United Kingdom"],
    bio: "Fast air export to the US, Canada and UK. Perfect for documents, fashion and small parcels." },
  { id: "frt-phcargo", name: "Port Harcourt Cargo Co", color: "a6", modes: ["Road", "Sea"], rating: 4.6, reviews: 95, eta: "2–6 days", priceFrom: "₦2,800/kg", phone: "+2348040000004",
    from: ["Nigeria"], to: ["Ghana", "Benin", "Togo", "Cameroon"],
    bio: "Regional road & coastal freight across West Africa. Reliable cross-border haulage and clearing." },
  { id: "frt-oceanbridge", name: "OceanBridge International", color: "a5", modes: ["Sea"], rating: 4.7, reviews: 140, eta: "21–35 days", priceFrom: "$95/CBM", phone: "+2348040000005",
    from: ["China", "Dubai", "Turkey"], to: ["Nigeria"],
    bio: "Full & shared container imports from China, Dubai and Turkey. Great rates for bulk goods." },
  { id: "frt-aerofreight", name: "AeroFreight Nigeria", color: "a3", modes: ["Air", "Sea"], rating: 4.8, reviews: 201, eta: "6–12 days", priceFrom: "₦5,200/kg", phone: "+2348040000006",
    from: ["Nigeria", "Dubai"], to: ["United Kingdom", "United States", "Dubai", "South Africa"],
    bio: "Two-way air & sea freight between Nigeria, Dubai and the West. Business cargo a speciality." },
];

// ===== Moving & relocation companies =====
export const MOVERS = [
  { id: "mov-phpackers", name: "PH Movers & Packers", color: "a1", rating: 4.8, reviews: 180, priceFrom: "₦60,000", phone: "+2348050000001",
    areas: ["Port Harcourt", "Lagos", "Abuja", "Owerri"], services: ["Home moves", "Office moves", "Packing"],
    jobs: ["3-bed flat, GRA → Lagos", "Full office relocation, Trans-Amadi", "Studio move, D-Line → Woji"],
    bio: "Careful home & office relocations across Nigeria. Trained packers, padded trucks, insured goods." },
  { id: "mov-safehands", name: "SafeHands Relocation", color: "a4", rating: 4.9, reviews: 260, priceFrom: "₦85,000", phone: "+2348050000002",
    areas: ["Lagos", "Abuja", "Port Harcourt"], services: ["Home moves", "International", "Storage"],
    jobs: ["4-bed duplex, Lekki → Abuja", "Expat relocation, Lagos → Accra", "Short-let storage, 3 months"],
    bio: "Premium movers for homes and expats. Door-to-door, storage and international relocation support." },
  { id: "mov-quickshift", name: "QuickShift Movers", color: "a2", rating: 4.6, reviews: 110, priceFrom: "₦45,000", phone: "+2348050000003",
    areas: ["Port Harcourt", "Owerri", "Aba", "Uyo"], services: ["Home moves", "Single items", "Same-day"],
    jobs: ["2-bed flat, Eliozu → Aba", "Single fridge + bed, same-day", "Shop relocation, Mile 3"],
    bio: "Affordable same-day moves in the South-East & South-South. Great for small flats and single items." },
  { id: "mov-eliteoffice", name: "Elite Office Movers", color: "a6", rating: 4.7, reviews: 88, priceFrom: "₦120,000", phone: "+2348050000004",
    areas: ["Abuja", "Lagos", "Port Harcourt"], services: ["Office moves", "IT equipment", "Fit-out"],
    jobs: ["50-staff office, Victoria Island", "Bank branch relocation, Abuja", "Server room move, insured"],
    bio: "Corporate relocation experts. Minimise downtime, handle IT and furniture, weekend moves available." },
];
