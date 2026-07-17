export interface PropertyDemo {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  listingType: 'sale' | 'rent';
  images: string[];
  category: { name: string };
  city: { name: string };
  specs: { beds: number; baths: number; area: number; yearBuilt?: string };
  location: { name: string };
  features: string[];
  agent: { name: string; phone: string; avatar: string };
}

export interface TestimonialDemo {
  _id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  rating: number;
  feedback: string;
  profilePhoto: string;
}

export interface BlogDemo {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  createdAt: string;
}

export const DEMO_PROPERTIES: PropertyDemo[] = [
  {
    _id: 'prop1',
    title: 'The Murugan Vista Villa',
    slug: 'murugan-vista-villa',
    description: 'A masterpiece of architectural design offering panoramic skyline views, high-end bespoke finishes, a heated infinity pool, and a private wine cellar.',
    price: 12500000,
    listingType: 'sale',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Luxury Villa' },
    city: { name: 'Miami' },
    specs: { beds: 5, baths: 6, area: 6200, yearBuilt: '2024' },
    location: { name: 'Coconut Grove' },
    features: ['Panoramic Skyline Views', 'Infinity Pool', 'Wine Cellar', 'Marble Flooring', 'Smart Home Controls'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    _id: 'prop2',
    title: 'Skyline Penthouse Suites',
    slug: 'skyline-penthouse-suites',
    description: 'Ultra-exclusive triplex penthouse sitting atop the city. Features double-height ceilings, a wrap-around private terrace, private elevator, and full spa.',
    price: 8900000,
    listingType: 'sale',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Penthouse Suite' },
    city: { name: 'New York' },
    specs: { beds: 4, baths: 4.5, area: 4800, yearBuilt: '2023' },
    location: { name: 'Midtown Manhattan' },
    features: ['Wrap-around Private Terrace', 'Private Elevator', 'Full In-unit Spa', 'Double-height Ceilings', '24/7 Concierge'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    _id: 'prop3',
    title: 'Grand Coastal Estate',
    slug: 'grand-coastal-estate',
    description: 'Exquisite waterfront residence with private yacht dock, sandy beachfront access, smart home controls, and lush manicured gardens.',
    price: 15400000,
    listingType: 'sale',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Luxury Villa' },
    city: { name: 'Miami' },
    specs: { beds: 6, baths: 7.5, area: 8500, yearBuilt: '2022' },
    location: { name: 'Key Biscayne' },
    features: ['Private Yacht Dock', 'Manicured Gardens', 'Sandy Beachfront Access', 'Outdoor Chef Kitchen', 'Vaulted Ceilings'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    _id: 'prop4',
    title: 'Modernist Haven',
    slug: 'modernist-haven',
    description: 'Sleek minimalist marvel nestled in the hills. Features floor-to-ceiling glass walls, home automation, and an indoor lap pool.',
    price: 45000,
    listingType: 'rent',
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Modern Apartment' },
    city: { name: 'Los Angeles' },
    specs: { beds: 3, baths: 3, area: 3800, yearBuilt: '2023' },
    location: { name: 'Hollywood Hills' },
    features: ['Floor-to-ceiling Glass Walls', 'Indoor Lap Pool', 'Surround Sound Theater', 'Zero-edge Fire Pit', 'Private Gym'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    _id: 'prop5',
    title: 'Bespoke Heights Condominium',
    slug: 'bespoke-heights-condo',
    description: 'Immaculately designed mid-town apartment. Features chef-grade kitchen, Italian marble bath suites, and 24/7 white-glove concierge services.',
    price: 3200000,
    listingType: 'sale',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Modern Apartment' },
    city: { name: 'New York' },
    specs: { beds: 2, baths: 2.5, area: 2100, yearBuilt: '2021' },
    location: { name: 'Tribeca' },
    features: ['Chef-grade Kitchen', 'Italian Marble Bath Suites', 'White-glove Concierge', 'Valet Parking', 'Wine Storage Vault'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    _id: 'prop6',
    title: 'Bel Air Sanctuary',
    slug: 'bel-air-sanctuary',
    description: 'An architectural statement estate in Bel Air. Includes a private home theater, wellness wing, championship tennis court, and infinity edge pool.',
    price: 24500000,
    listingType: 'sale',
    images: ['https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Luxury Villa' },
    city: { name: 'Los Angeles' },
    specs: { beds: 7, baths: 9, area: 12400, yearBuilt: '2025' },
    location: { name: 'Bel Air Hills' },
    features: ['Wellness Wing', 'Private Home Theater', 'Championship Tennis Court', 'Infinity Pool', 'Staff Quarters'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    _id: 'prop7',
    title: 'Ocean Edge Retreat',
    slug: 'ocean-edge-retreat',
    description: 'Perched on cliffs overlooking the ocean, this stunning retreat features sliding glass doors, custom woodwork, and a saltwater swimming pool.',
    price: 35000,
    listingType: 'rent',
    images: ['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Luxury Villa' },
    city: { name: 'Miami' },
    specs: { beds: 4, baths: 4, area: 4200, yearBuilt: '2023' },
    location: { name: 'South Beach Cliffs' },
    features: ['Saltwater Swimming Pool', 'Sliding Glass Walls', 'Custom Cedar Woodwork', 'Private Cliff Pathway', 'Solar Microgrid'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    _id: 'prop8',
    title: 'The Glass House',
    slug: 'the-glass-house',
    description: 'A modern design icon showcasing transparent steel-and-glass structure, open floor layouts, high ceilings, and stunning surrounding forest views.',
    price: 6750000,
    listingType: 'sale',
    images: ['https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80'],
    category: { name: 'Modern Apartment' },
    city: { name: 'Los Angeles' },
    specs: { beds: 3, baths: 3.5, area: 3400, yearBuilt: '2022' },
    location: { name: 'Beverly Hills Canyon' },
    features: ['Transparent Structural Frame', 'Open Concept Layouts', 'Heated Concrete Flooring', 'Surrounding Forest Views', 'Geothermal HVAC'],
    agent: {
      name: 'Murugan Brokerage',
      phone: '9892685194',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
];

export const DEMO_TESTIMONIALS: TestimonialDemo[] = [
  {
    _id: 'test1',
    clientName: 'Victoria Stirling',
    clientRole: 'CEO',
    clientCompany: 'Stirling Holdings',
    rating: 5,
    feedback: 'Murugan Real Estate helped us acquire our beachfront estate in Miami. Their transaction management was seamless, private, and highly professional.',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    _id: 'test2',
    clientName: 'Alexander Sinclair',
    clientRole: 'Managing Director',
    clientCompany: 'Sinclair & Partners',
    rating: 5,
    feedback: 'Vetting properties through Murugan Real Estate gave our investment trust complete confidence. Outstanding communication and market intelligence.',
    profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    _id: 'test3',
    clientName: 'Sophia Varga',
    clientRole: 'Founder',
    clientCompany: 'Varga Design',
    rating: 5,
    feedback: 'Their exclusive access to off-market properties is unmatched. We secured a stunning penthouse suite in New York before it ever hit public lists.',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    _id: 'test4',
    clientName: 'Marcus Bennett',
    clientRole: 'Private Investor',
    clientCompany: 'Family Trust Office',
    rating: 5,
    feedback: 'A level of sophistication in real estate that is rare. They managed our commercial land acquisition with absolute discretion.',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    _id: 'test5',
    clientName: 'Elena Rostova',
    clientRole: 'Tech Entrepreneur',
    clientCompany: 'Apex Systems',
    rating: 5,
    feedback: 'Buying a home internationally can be daunting. Their advisory handled the legal compliance and local coordination flawlessly.',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    _id: 'test6',
    clientName: 'David Chen',
    clientRole: 'VP of Finance',
    clientCompany: 'Global Logistics Corp',
    rating: 5,
    feedback: 'The team at Murugan Real Estate understands high-net-worth portfolio needs. Every listing they proposed fit our criteria perfectly.',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

export const DEMO_BLOGS: BlogDemo[] = [
  {
    _id: 'blog1',
    title: 'Navigating the Global Luxury Housing Market in 2026',
    slug: 'global-luxury-housing-market-2026',
    content: 'An in-depth analysis of high-end real estate trends, capital flows, and premier metropolitan growth zones globally.',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-07-10T10:00:00Z',
  },
  {
    _id: 'blog2',
    title: 'The Rise of Eco-Luxury in Contemporary Architecture',
    slug: 'rise-eco-luxury-contemporary-architecture',
    content: 'How modern architects are blending sustainable smart technologies with premium aesthetic designs to construct the future of luxury living.',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-07-05T12:00:00Z',
  },
  {
    _id: 'blog3',
    title: 'Decisions for Family Trusts and Real Estate Portfolios',
    slug: 'family-trusts-real-estate-portfolios',
    content: 'Critical strategies for high-net-worth individuals protecting wealth and distributing real estate assets across multiple generations.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-06-28T09:30:00Z',
  },
  {
    _id: 'blog4',
    title: 'Inside Beverly Hills’ Most Exclusive Private Compounds',
    slug: 'beverly-hills-exclusive-private-compounds',
    content: 'A curated look behind the security gates of California’s most legendary luxury properties and architectural masterpieces.',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-06-15T15:00:00Z',
  },
  {
    _id: 'blog5',
    title: 'Waterfront Properties: Crucial Diligence Guidelines',
    slug: 'waterfront-properties-crucial-diligence',
    content: 'Key physical, legal, and environmental inspections necessary before closing a premium coastal estate or oceanfront penthouse.',
    coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-06-08T11:15:00Z',
  },
  {
    _id: 'blog6',
    title: 'Vetting Metropolis Commercial High-Rise Assets',
    slug: 'metropolis-commercial-high-rise-assets',
    content: 'A guide to auditing cash flows, structural certifications, and zoning policies for prime urban mixed-use commercial properties.',
    coverImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-24T14:40:00Z',
  },
];
