import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Role from './models/Role';
import User from './models/User';
import Category from './models/Category';
import City from './models/City';
import Location from './models/Location';
import Property from './models/Property';
import Blog from './models/Blog';
import Testimonial from './models/Testimonial';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing datasets
    await Role.deleteMany({});
    await Category.deleteMany({});
    await City.deleteMany({});
    await Location.deleteMany({});
    await Property.deleteMany({});
    await Blog.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('Cleared existing database entries.');

    // Seed Roles
    const roles = [
      {
        name: 'Super Admin',
        key: 'super_admin',
        permissions: ['*'],
        description: 'Full root system privileges',
      },
      {
        name: 'Admin',
        key: 'admin',
        permissions: ['manage_properties', 'manage_leads', 'manage_enquiries', 'view_reports'],
        description: 'Privileged operations and user monitoring',
      },
      {
        name: 'Sales Executive',
        key: 'sales_executive',
        permissions: ['view_properties', 'manage_leads', 'manage_enquiries'],
        description: 'Customer facing leads and listing viewer',
      },
    ];
    await Role.insertMany(roles);
    console.log('Roles seeded.');

    // Seed Super Admin User
    const adminEmail = 'admin@muruganrealestate.com';
    const adminUser = await User.create({
      name: 'Super Admin User',
      email: adminEmail,
      password: 'Admin@12345',
      role: 'super_admin',
      status: 'active',
      phone: '1234567890',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    });
    console.log('Super Admin user seeded.');

    // Seed Categories
    const categoriesList = [
      { name: 'Luxury Villa', slug: 'luxury-villa', description: 'Exclusive residential estates with expansive grounds' },
      { name: 'Penthouse Suite', slug: 'penthouse-suite', description: 'Top-tier apartments featuring panoramas' },
      { name: 'Modern Apartment', slug: 'modern-apartment', description: 'Elegant urban flats located in metropolis hubs' },
    ];
    const seededCategories = await Category.insertMany(categoriesList);
    console.log('Categories seeded.');

    // Seed Cities
    const citiesList = [
      { name: 'New York', slug: 'new-york', state: 'NY', country: 'US', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
      { name: 'Los Angeles', slug: 'los-angeles', state: 'CA', country: 'US', image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80' },
      { name: 'Miami', slug: 'miami', state: 'FL', country: 'US', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=800&q=80' },
    ];
    const seededCities = await City.insertMany(citiesList);
    console.log('Cities seeded.');

    // Seed Locations
    const locationsList = [
      { name: 'Manhattan Upper East', slug: 'manhattan-upper-east', city: seededCities[0]._id },
      { name: 'Beverly Hills Premium', slug: 'beverly-hills-premium', city: seededCities[1]._id },
      { name: 'South Beach Coastal', slug: 'south-beach-coastal', city: seededCities[2]._id },
    ];
    const seededLocations = await Location.insertMany(locationsList);
    console.log('Locations seeded.');

    // Seed Properties (6 listings)
    const propertiesList = [
      {
        title: 'Manhattan Sky Penthouse',
        slug: 'manhattan-sky-penthouse',
        description: 'Commanding views of Central Park, this top-floor duplex penthouse features custom marble fittings, private elevator entrance, floor-to-ceiling glass columns, and a wrap-around terrace. An architectural masterwork in the heart of New York.',
        price: 12500000,
        status: 'active',
        listingType: 'sale',
        category: seededCategories[1]._id,
        city: seededCities[0]._id,
        location: seededLocations[0]._id,
        features: ['Helipad Access', '24/7 Concierge', 'Indoor Swimming Pool', 'Private Elevator', 'Wine Cellar'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        agent: adminUser._id,
        specs: { beds: 4, baths: 4.5, area: 4500, yearBuilt: 2021 }
      },
      {
        title: 'Beverly Hills Modern Estate',
        slug: 'beverly-hills-modern-estate',
        description: 'Tucked behind security gates on a prominent ridge, this modern estate redefines Southern California indoor-outdoor luxury living. Boasting double-height ceilings, a professional screening theater, and an infinity pool reflecting canyon lights.',
        price: 24500000,
        status: 'active',
        listingType: 'sale',
        category: seededCategories[0]._id,
        city: seededCities[1]._id,
        location: seededLocations[1]._id,
        features: ['Infinity Pool', 'Home Theater', 'Smart Automation', 'Outdoor Kitchen', 'Professional Gym'],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
        ],
        agent: adminUser._id,
        specs: { beds: 6, baths: 7.5, area: 9200, yearBuilt: 2023 }
      },
      {
        title: 'South Beach Waterfront Oasis',
        slug: 'south-beach-waterfront-oasis',
        description: 'An architectural glass masterpiece directly on Miami waters. Features include a yacht dock, expansive entertainment decks, rooftop jacuzzi, custom chef kitchen, and private sandy shoreline views. Experience unparalleled tropical resort-style elegance.',
        price: 18900000,
        status: 'active',
        listingType: 'sale',
        category: seededCategories[0]._id,
        city: seededCities[2]._id,
        location: seededLocations[2]._id,
        features: ['Yacht Dock', 'Rooftop Jacuzzi', 'Private Beach Front', 'Chef Kitchen', 'Tesla Wall Charger'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
        ],
        agent: adminUser._id,
        specs: { beds: 5, baths: 5.5, area: 6100, yearBuilt: 2022 }
      },
      {
        title: 'Tribeca Modern Loft',
        slug: 'tribeca-modern-loft',
        description: 'A restored loft in Tribeca featuring exposed brickwork, structural columns, and luxury custom kitchen cabinets. Flooded with natural daylight from oversized arch windows. Walking distance to premier restaurants and art galleries.',
        price: 4200000,
        status: 'active',
        listingType: 'sale',
        category: seededCategories[2]._id,
        city: seededCities[0]._id,
        location: seededLocations[0]._id,
        features: ['Exposed Brick', 'Custom Millwork', 'Storage Vault', 'Fitness Room', 'Steam Room'],
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
        ],
        agent: adminUser._id,
        specs: { beds: 2, baths: 2, area: 2100, yearBuilt: 1910 }
      },
      {
        title: 'Sunset Strip Luxury Penthouse',
        slug: 'sunset-strip-luxury-penthouse',
        description: 'For lease: An ultra-modern penthouse perched above the Sunset Strip. Fully furnished with high-end designer labels, a custom bar, automated shades, and panoramic views stretching from downtown Los Angeles to the Pacific Ocean.',
        price: 8500,
        status: 'active',
        listingType: 'rent',
        category: seededCategories[1]._id,
        city: seededCities[1]._id,
        location: seededLocations[1]._id,
        features: ['Designer Furniture', 'Custom Wet Bar', 'Full Automated Controls', 'Panoramic Deck', 'Concierge Service'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
        ],
        agent: adminUser._id,
        specs: { beds: 2, baths: 2.5, area: 1800, yearBuilt: 2018 }
      },
      {
        title: 'Ocean Drive Glass Flat',
        slug: 'ocean-drive-glass-flat',
        description: 'For lease: Direct beach-facing modern flat on Ocean Drive. Equipped with high-velocity air controls, floor-to-ceiling slide doors, an oversized oceanfront balcony, secure resident garage access, and private cabana permissions.',
        price: 12000,
        status: 'active',
        listingType: 'rent',
        category: seededCategories[2]._id,
        city: seededCities[2]._id,
        location: seededLocations[2]._id,
        features: ['Beach Balcony', 'Secure Resident Parking', 'Private Cabana', 'Wellness Spa Access', 'Miele Appliances'],
        images: [
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        agent: adminUser._id,
        specs: { beds: 3, baths: 3.5, area: 3200, yearBuilt: 2020 }
      }
    ];
    await Property.insertMany(propertiesList);
    console.log('Properties seeded.');

    // Seed Blogs
    const blogsList = [
      {
        title: 'The Art of Buying Luxury Real Estate',
        slug: 'the-art-of-buying-luxury-real-estate',
        content: 'Investing in luxury properties requires understanding unique market cycles. High-net-worth buyers evaluate estates on parameters beyond basic area metrics: architectural history, geographic exclusivity, home wellness integration, and asset liquidity play huge parts. This guide outlines standard diligence checklists when entering premier neighborhoods.',
        author: adminUser._id,
        status: 'published',
        tags: ['Finance', 'Investment', 'Guides'],
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Designing the Ultimate Penthouse Interior',
        slug: 'designing-the-ultimate-penthouse-interior',
        content: 'Penthouses offer top-tier urban real estate options. To frame high-altitude views effectively, interior design experts avoid heavy partitions. Floor-to-ceiling glass spans demand architectural lighting that highlights open-plan details while keeping window reflections minimal. Here we showcase three premier penthouse design studies.',
        author: adminUser._id,
        status: 'published',
        tags: ['Design', 'Luxury', 'Inspirations'],
        coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Real Estate Trends: The Rise of Miami Waterfronts',
        slug: 'rise-of-miami-waterfronts',
        content: 'Oceanfront properties in southern Florida continue to show historic appreciation levels. The migration of technology founders and financial managers has spurred record sales velocity for estates equipped with private yacht slips. We analyze the growth drivers and projected inventory supply over the next decade.',
        author: adminUser._id,
        status: 'published',
        tags: ['Market', 'Miami', 'Waterfront'],
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      }
    ];
    await Blog.insertMany(blogsList);
    console.log('Blogs seeded.');

    // Seed Testimonials
    const testimonialsList = [
      { clientName: 'Victoria Stirling', clientRole: 'CEO', clientCompany: 'Stirling Holdings', rating: 5, feedback: 'Aurelia helped us acquire our dream home in Beverly Hills. Their transaction management was seamless and highly professional.', status: 'published' },
      { clientName: 'David Vance', clientRole: 'Architect', clientCompany: 'Vance Design Partners', rating: 5, feedback: 'The listing exposure they generated for our Tribeca apartment was incredible. Sold in less than three weeks above asking price.', status: 'published' },
      { clientName: 'Sofia Mendez', clientRole: 'Investor', clientCompany: 'Mendez Global Capital', rating: 5, feedback: 'A truly premium real estate service. Their sales agents have unmatched knowledge of Miami waterfront locations.', status: 'published' }
    ];
    await Testimonial.insertMany(testimonialsList);
    console.log('Testimonials seeded.');

    console.log('All datasets successfully seeded! Press Ctrl+C to terminate or wait.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
