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
