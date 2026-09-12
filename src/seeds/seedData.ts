import { DUBAI_COMMUNITIES } from '../shared/constants/dubaiLocations.js';

export const SEED_USERS = [
  {
    name: 'Alexander Sterling',
    email: 'admin@nestandkey.com',
    role: 'ADMIN',
    phone: '+971 4 456 7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Omar Farooq',
    email: 'omar.farooq@nestandkey.com',
    role: 'BROKER',
    phone: '+971 50 112 3456',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    brokerProfile: {
      reraNumber: 'RERA-48291',
      brn: 'BRN-31920',
      title: 'Senior Director of Prime Residences',
      languages: ['English', 'Arabic', 'French'],
      specializations: ['Palm Jumeirah', 'Super-Mansions', 'Waterfront'],
      experienceYears: 12,
      totalSalesVolumeAED: 850000000,
      commissionSplitPct: 65,
      rating: 4.98,
      reviewsCount: 42,
      whatsappNumber: '+971501123456'
    }
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@nestandkey.com',
    role: 'BROKER',
    phone: '+971 52 987 6543',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    brokerProfile: {
      reraNumber: 'RERA-51204',
      brn: 'BRN-42811',
      title: 'Head of Branded Residences & Penthouses',
      languages: ['English', 'Russian', 'German'],
      specializations: ['Downtown Dubai', 'Branded Residences', 'Jumeirah Bay'],
      experienceYears: 9,
      totalSalesVolumeAED: 620000000,
      commissionSplitPct: 60,
      rating: 4.95,
      reviewsCount: 38,
      whatsappNumber: '+971529876543'
    }
  },
  {
    name: 'Tariq Mansoor',
    email: 'tariq.mansoor@nestandkey.com',
    role: 'BROKER',
    phone: '+971 55 432 1098',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    brokerProfile: {
      reraNumber: 'RERA-39821',
      brn: 'BRN-28410',
      title: 'Golf Course Estates & Villa Specialist',
      languages: ['English', 'Arabic'],
      specializations: ['Dubai Hills Estate', 'Emirates Hills', 'Golf Fairways'],
      experienceYears: 14,
      totalSalesVolumeAED: 940000000,
      commissionSplitPct: 70,
      rating: 4.99,
      reviewsCount: 56,
      whatsappNumber: '+971554321098'
    }
  },
  {
    name: 'Lord Marcus Kensington',
    email: 'client@nestandkey.com',
    role: 'CLIENT',
    phone: '+44 7700 900123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  }
];

export const SEED_PROPERTIES = [
  {
    title: 'The Solstice Sanctuary — Palm Jumeirah Signature Beachfront Villa',
    slug: 'the-solstice-sanctuary-palm-jumeirah',
    referenceNumber: 'NK-PJ-8821',
    description: 'An architectural magnum opus positioned on the ultra-prime Frond N of Palm Jumeirah. Boasting 180 feet of private white sand beach frontage, double-height travertine entryways, bespoke Italian marble flooring, and panoramic sunset vistas overlooking the Atlantis Royal and Arabian Gulf.',
    purpose: 'BUY',
    propertyType: 'Mansion',
    priceAED: 145000000,
    bedrooms: 6,
    bathrooms: 8,
    builtUpAreaSqFt: 16500,
    plotAreaSqFt: 22000,
    location: 'Dubai',
    community: 'Palm Jumeirah',
    subCommunity: 'Frond N',
    developer: 'Nakheel',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'READY',
    amenities: [
      'Private Beach Access',
      'Private Infinity Pool',
      'Temperature-Controlled Wine Cellar',
      'Private Cinema',
      'Spa & Hammam Room',
      'Smart Home Automation',
      'Full Sea & Marina View',
      'Underground Garage (4+ Cars)'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85'
    ],
    floorPlans: [
      { title: 'Ground Floor & Garden Pavilions', bedrooms: 1, bathrooms: 2, totalAreaSqFt: 8500, imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80' },
      { title: 'First Floor Master Suites & Terraces', bedrooms: 5, bathrooms: 6, totalAreaSqFt: 8000, imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80' }
    ],
    nearbyPlaces: [
      { name: 'Atlantis The Royal', category: 'LANDMARK', distanceMinutes: 4 },
      { name: 'Nakheel Mall & The View', category: 'MALL', distanceMinutes: 7 },
      { name: 'Dubai Marina Yacht Club', category: 'BEACH', distanceMinutes: 12 }
    ],
    status: 'ACTIVE',
    isFeatured: true,
    isNewLaunch: false,
    luxuryCollection: 'Waterfront Villas',
    views: ['Full Sea & Marina View', 'Sunset Horizon'],
    seo: {
      metaTitle: 'Palm Jumeirah Signature Beachfront Villa | Nestandkey Dubai',
      metaDescription: 'Discover The Solstice Sanctuary, an AED 145M beachfront villa on Palm Jumeirah with private infinity pool and designer interiors.'
    }
  },
  {
    title: 'The Sky Palace — Bulgari Lighthouse Penthouse',
    slug: 'the-sky-palace-bulgari-lighthouse-jumeirah-bay',
    referenceNumber: 'NK-JB-9014',
    description: 'Perched in Dubai’s most coveted private island sanctuary, Jumeirah Bay Island. Designed by Antonio Citterio Patricia Viel, this triplex penthouse offers private elevator access, full 360-degree views across the Downtown skyline and open sea, bespoke Bulgari finishes, and private superyacht berth.',
    purpose: 'BUY',
    propertyType: 'Penthouse',
    priceAED: 85000000,
    bedrooms: 5,
    bathrooms: 7,
    builtUpAreaSqFt: 11800,
    location: 'Dubai',
    community: 'Jumeirah Bay Island',
    developer: 'Meraas',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'READY',
    amenities: [
      'Private Rooftop Terrace',
      'Private Yacht Berth',
      'Private Infinity Pool',
      'Panoramic Burj Khalifa View',
      'Full Sea & Marina View',
      '24/7 Concierge & Valet Service',
      'Sub-Zero & Miele Appliances'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85'
    ],
    floorPlans: [
      { title: 'Sky Level 48 Living & Entertaining', bedrooms: 1, bathrooms: 2, totalAreaSqFt: 5800, imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80' },
      { title: 'Sky Level 49 Private Suites & Wellness', bedrooms: 4, bathrooms: 5, totalAreaSqFt: 6000, imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80' }
    ],
    nearbyPlaces: [
      { name: 'Bulgari Yacht Club & Marina', category: 'BEACH', distanceMinutes: 1 },
      { name: 'Four Seasons Resort Jumeirah', category: 'BEACH', distanceMinutes: 6 },
      { name: 'DIFC Financial Centre', category: 'LANDMARK', distanceMinutes: 14 }
    ],
    status: 'ACTIVE',
    isFeatured: true,
    isNewLaunch: false,
    luxuryCollection: 'Dubai Penthouse Collection',
    views: ['Panoramic Burj Khalifa View', 'Full Sea & Marina View'],
    seo: {
      metaTitle: 'Bulgari Lighthouse Penthouse AED 85M | Nestandkey',
      metaDescription: 'Super-prime Bulgari Lighthouse penthouse on Jumeirah Bay Island with private yacht berth and 360-degree Dubai views.'
    }
  },
  {
    title: 'The Fairway Grandeur — Dubai Hills Golf Fairway Mansion',
    slug: 'the-fairway-grandeur-dubai-hills-estate',
    referenceNumber: 'NK-DH-4219',
    description: 'An expansive modern estate fronting the 7th hole of the championship Dubai Hills Golf Course. Featuring double-height glass curtains, basement entertainment lounge with bowling alley and private spa, Olympic-length pool, and landscaped botanical courtyards.',
    purpose: 'BUY',
    propertyType: 'Mansion',
    priceAED: 54000000,
    bedrooms: 7,
    bathrooms: 9,
    builtUpAreaSqFt: 18200,
    plotAreaSqFt: 25000,
    location: 'Dubai',
    community: 'Dubai Hills Estate',
    developer: 'Emaar Properties',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'READY',
    amenities: [
      'Championship Golf Course View',
      'Private Infinity Pool',
      'Private Cinema',
      'Spa & Hammam Room',
      'Smart Home Automation',
      'Underground Garage (4+ Cars)',
      'Lush Landscaped Gardens'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85'
    ],
    floorPlans: [],
    nearbyPlaces: [
      { name: 'Dubai Hills Golf Clubhouse', category: 'LANDMARK', distanceMinutes: 2 },
      { name: 'Dubai Hills Mall & Dubai Hills Park', category: 'MALL', distanceMinutes: 5 },
      { name: 'King’s College Hospital', category: 'SCHOOL', distanceMinutes: 6 }
    ],
    status: 'ACTIVE',
    isFeatured: true,
    isNewLaunch: false,
    luxuryCollection: 'Private Residences',
    views: ['Championship Golf Course View', 'Downtown Skyline in Distance'],
    seo: {
      metaTitle: 'Dubai Hills Golf Fairway Mansion AED 54M | Nestandkey',
      metaDescription: 'Ultra-luxury 7-bedroom fairway mansion in Dubai Hills Estate with panoramic golf course views and subterranean entertainment.'
    }
  },
  {
    title: 'The Grand Opera Duplex — Downtown Dubai Boulevard',
    slug: 'the-grand-opera-duplex-downtown-dubai',
    referenceNumber: 'NK-DT-3190',
    description: 'An imposing high-floor duplex apartment directly opposite the Dubai Opera and Burj Khalifa fountains. Featuring 7-meter cathedral ceilings, marble staircases, private heated plunge pool on the terrace, and bespoke Molteni&C furnishings.',
    purpose: 'BUY',
    propertyType: 'Duplex',
    priceAED: 42000000,
    bedrooms: 4,
    bathrooms: 5,
    builtUpAreaSqFt: 7800,
    location: 'Dubai',
    community: 'Downtown Dubai',
    developer: 'Emaar Properties',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'READY',
    amenities: [
      'Panoramic Burj Khalifa View',
      'Private Elevator',
      'Designer Italian Kitchen',
      '24/7 Concierge & Valet Service',
      'Private Rooftop Terrace',
      'Smart Home Automation'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85'
    ],
    floorPlans: [],
    nearbyPlaces: [
      { name: 'Burj Khalifa & Dubai Mall', category: 'MALL', distanceMinutes: 3 },
      { name: 'Dubai Opera House', category: 'LANDMARK', distanceMinutes: 1 },
      { name: 'DIFC Gate Village', category: 'LANDMARK', distanceMinutes: 8 }
    ],
    status: 'ACTIVE',
    isFeatured: true,
    isNewLaunch: false,
    luxuryCollection: 'Dubai Penthouse Collection',
    views: ['Panoramic Burj Khalifa View', 'Dubai Fountain View'],
    seo: {
      metaTitle: 'Downtown Dubai Grand Opera Duplex AED 42M | Nestandkey',
      metaDescription: 'Prime Opera District duplex in Downtown Dubai featuring front-row views of Burj Khalifa and Dubai Fountain.'
    }
  },
  {
    title: 'The Lana Residences — Dorchester Collection Waterway Duplex',
    slug: 'the-lana-residences-dorchester-collection-business-bay',
    referenceNumber: 'NK-BB-5521',
    description: 'Managed exclusively by the world-renowned Dorchester Collection. Designed by Gilles & Boissier, this waterfront residence enjoys private yacht moorings on the Dubai Canal, bespoke Gaggenau culinary suites, and private hospitality privileges.',
    purpose: 'OFF_PLAN',
    propertyType: 'Branded Residence',
    priceAED: 38500000,
    bedrooms: 4,
    bathrooms: 5,
    builtUpAreaSqFt: 6900,
    location: 'Dubai',
    community: 'Business Bay',
    developer: 'Omniyat',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'UNDER_CONSTRUCTION',
    handoverDate: 'Q4 2026',
    paymentPlan: {
      downPaymentPct: 20,
      duringConstructionPct: 40,
      onHandoverPct: 40
    },
    amenities: [
      '24/7 Concierge & Valet Service',
      'Private Yacht Berth',
      'Private Infinity Pool',
      'Designer Italian Kitchen',
      'Panoramic Burj Khalifa View'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85'
    ],
    floorPlans: [],
    nearbyPlaces: [
      { name: 'Dubai Canal Boardwalk', category: 'BEACH', distanceMinutes: 1 },
      { name: 'Downtown Dubai', category: 'LANDMARK', distanceMinutes: 6 }
    ],
    status: 'ACTIVE',
    isFeatured: false,
    isNewLaunch: true,
    luxuryCollection: 'Branded Residences',
    views: ['Dubai Canal View', 'Burj Khalifa View'],
    seo: {
      metaTitle: 'The Lana Residences Dorchester Collection AED 38.5M',
      metaDescription: 'Invest in Dubai Canal luxury at The Lana Residences managed by Dorchester Collection.'
    }
  },
  {
    title: 'The Ambassadorial Estate — Emirates Hills Sector L',
    slug: 'the-ambassadorial-estate-emirates-hills',
    referenceNumber: 'NK-EH-7001',
    description: 'An ambassadorial villa situated in the most private enclave of Emirates Hills. Crafted with hand-chiseled French limestone, classical Palladian columns, private cinema for 16 guests, indoor heated pool and manicured Mediterranean topiaries.',
    purpose: 'BUY',
    propertyType: 'Villa',
    priceAED: 72000000,
    bedrooms: 6,
    bathrooms: 8,
    builtUpAreaSqFt: 19500,
    plotAreaSqFt: 28000,
    location: 'Dubai',
    community: 'Emirates Hills',
    developer: 'Emaar Properties',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'READY',
    amenities: [
      'Championship Golf Course View',
      'Private Cinema',
      'Spa & Hammam Room',
      'Underground Garage (4+ Cars)',
      'Lush Landscaped Gardens',
      'Temperature-Controlled Wine Cellar'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85'],
    floorPlans: [],
    nearbyPlaces: [
      { name: 'Montgomerie Golf Club', category: 'LANDMARK', distanceMinutes: 3 },
      { name: 'Dubai Marina & JBR', category: 'BEACH', distanceMinutes: 10 }
    ],
    status: 'ACTIVE',
    isFeatured: true,
    isNewLaunch: false,
    luxuryCollection: 'Private Residences',
    views: ['Championship Golf Course View'],
    seo: {
      metaTitle: 'Emirates Hills Ambassadorial Estate AED 72M | Nestandkey',
      metaDescription: 'Ultra-private classical mansion in Sector L, Emirates Hills overlooking the Montgomerie Championship golf links.'
    }
  },
  {
    title: 'Atlantis The Royal Sky Court Residence',
    slug: 'atlantis-the-royal-sky-court-residence',
    referenceNumber: 'NK-AR-9932',
    description: 'Live atop Dubai’s landmark ultra-luxury resort. Featuring elevated private sky gardens, cantilevered infinity pool suspended 100 meters above sea level, signature Michelin star in-residence room service, and private beach cabanas.',
    purpose: 'BUY',
    propertyType: 'Penthouse',
    priceAED: 49000000,
    bedrooms: 4,
    bathrooms: 5,
    builtUpAreaSqFt: 7200,
    location: 'Dubai',
    community: 'Palm Jumeirah',
    developer: 'Nakheel',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'READY',
    amenities: [
      'Private Beach Access',
      'Private Infinity Pool',
      'Full Sea & Marina View',
      '24/7 Concierge & Valet Service',
      'Spa & Hammam Room'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85'],
    floorPlans: [],
    nearbyPlaces: [{ name: 'Cloud 22 Rooftop Sky Pool', category: 'BEACH', distanceMinutes: 1 }],
    status: 'ACTIVE',
    isFeatured: false,
    isNewLaunch: false,
    luxuryCollection: 'Waterfront Villas',
    views: ['Arabian Gulf Sea View', 'Palm Jumeirah Crescent View'],
    seo: {
      metaTitle: 'Atlantis The Royal Sky Court Residence AED 49M',
      metaDescription: 'Suspended sky court luxury at the world-famous Atlantis The Royal Palm Jumeirah.'
    }
  },
  {
    title: 'The Riviera Horizon — Dubai Marina Waterfront Penthouse',
    slug: 'the-riviera-horizon-dubai-marina',
    referenceNumber: 'NK-DM-1120',
    rentalFrequency: 'YEARLY',
    description: 'Full-floor waterfront penthouse overlooking the superyacht harbor in Dubai Marina. Expansive wraparound terrace with outdoor firepits, custom Poggenpohl kitchen, and private high-speed elevator directly to the residence.',
    purpose: 'RENT',
    propertyType: 'Penthouse',
    priceAED: 1850000,
    bedrooms: 4,
    bathrooms: 5,
    builtUpAreaSqFt: 5800,
    location: 'Dubai',
    community: 'Dubai Marina',
    developer: 'Emaar Properties',
    furnishing: 'DESIGNER_FURNISHED',
    completionStatus: 'READY',
    amenities: [
      'Full Sea & Marina View',
      'Private Elevator',
      '24/7 Concierge & Valet Service',
      'Private Gym & Wellness Studio'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=85',
    images: ['https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=85'],
    floorPlans: [],
    nearbyPlaces: [{ name: 'Marina Walk', category: 'BEACH', distanceMinutes: 1 }],
    status: 'ACTIVE',
    isFeatured: false,
    isNewLaunch: false,
    luxuryCollection: 'Dubai Penthouse Collection',
    views: ['Full Sea & Marina View'],
    seo: {
      metaTitle: 'Dubai Marina Waterfront Penthouse For Rent AED 1.85M',
      metaDescription: 'Superyacht views and designer luxury in Dubai Marina.'
    }
  }
];

export const SEED_INSIGHTS = [
  {
    title: 'Dubai Prime Residential Market 2026: The Sovereign Flight to Quality',
    slug: 'dubai-prime-residential-market-2026-sovereign-flight-to-quality',
    excerpt: 'How global geopolitical reallocation and tax certainty are accelerating ultra-high-net-worth acquisitions across Palm Jumeirah and Jumeirah Bay.',
    category: 'Dubai Market',
    content: `
Dubai’s prime and super-prime real estate sectors continue to defy global macroeconomic headwinds, setting unprecedented global benchmarks in transaction volume and capital appreciation.

### 1. The Global Wealth Realignment
Over the past 24 months, international ultra-high-net-worth individuals (UHNWIs) have increasingly recognized Dubai not merely as a high-yield investment outpost, but as an indispensable primary sanctuary. Favorable Golden Visa regimes, world-leading infrastructure, zero capital gains tax, and unmatched personal security make the emirate uniquely attractive.

### 2. Supply Constraints in the Super-Prime Bracket
While broad residential supply in suburban corridors remains buoyant, true waterfront and branded island properties—specifically on Palm Jumeirah, Jumeirah Bay Island, and Dubai Hills Golf Course enclaves—face acute architectural scarcity. The scarcity of direct beachfront fronds has created enduring upward pricing pressure, cementing prices in excess of AED 6,000 per square foot for turnkey signature mansions.

### 3. The Rise of Branded Residences
Global hotel and fashion brands, including Bulgari, Dorchester Collection, Armani, and Cavalli, have transformed the Dubai skyline. Discerning buyers routinely pay a 25% to 35% premium for branded management and world-class hospitality services directly inside their private residences.
    `,
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    readingTimeMinutes: 5,
    tags: ['Market Report', 'Ultra Luxury', 'Palm Jumeirah', 'Investment'],
    isPublished: true
  },
  {
    title: 'The Definitive Guide to UAE Real Estate Mortgages for International Buyers',
    slug: 'uae-real-estate-mortgages-international-buyers-guide',
    excerpt: 'Key criteria, loan-to-value (LTV) limits, and strategic financial planning for non-resident property acquisition in Dubai.',
    category: 'Buying Guide',
    content: `
Acquiring prime Dubai real estate through institutional financing has become significantly more accessible for expatriate and non-resident investors.

### UAE Central Bank Regulations
Under current regulations:
* **Expatriates & Non-Residents:** Loan-to-Value (LTV) caps allow financing up to 80% for properties valued below AED 5 million, and up to 70% for properties above AED 5 million.
* **Loan Tenor:** Up to 25 years, terminating before the borrower reaches age 65 (or 70 for self-employed individuals).
* **Dubai Land Department (DLD) Costs:** 4% transfer fee + trustee and registration charges.

Our in-house private wealth advisory assists international clients in securing pre-approvals through premier UAE institutions including Emirates NBD, First Abu Dhabi Bank, and HSBC Middle East.
    `,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    readingTimeMinutes: 4,
    tags: ['Mortgage', 'Finance', 'Buying Guide'],
    isPublished: true
  },
  {
    title: 'Why Branded Residences Are Commanding 30% Premiums Across Dubai',
    slug: 'why-branded-residences-command-30-percent-premiums-dubai',
    excerpt: 'From Bulgari to Dorchester Collection, explore the economics and resale velocity of branded real estate assets.',
    category: 'Investment',
    content: `
Dubai has officially overtaken Miami and London as the global capital of branded residential developments.

With over 120 completed and pipeline branded residential schemes, developer collaborations with ultra-luxury hotel chains and haute couture fashion houses have established a distinct luxury asset class that consistently outperforms generic super-prime developments on both capital preservation and rental yields.
    `,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    readingTimeMinutes: 6,
    tags: ['Branded Residences', 'Dorchester', 'Bulgari', 'Architecture'],
    isPublished: true
  }
];
