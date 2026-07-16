import Role from '../models/Role';
import User from '../models/User';
import Category from '../models/Category';
import City from '../models/City';
import Location from '../models/Location';
import Property from '../models/Property';
import Blog from '../models/Blog';
import Testimonial from '../models/Testimonial';

export const seedDatabaseIfEmpty = async () => {
  try {
    // 1. Ensure the default super admin account ALWAYS exists
    const adminEmail = 'admin@muruganrealestate.com';
    const adminExist = await User.findOne({ email: adminEmail });
    
    let adminUserObj = adminExist;

    if (!adminExist) {
      console.log(`Default Super Admin (${adminEmail}) not found. Seeding it...`);
      adminUserObj = await User.create({
        name: 'Super Admin User',
        email: adminEmail,
        password: 'Admin@12345',
        role: 'super_admin',
        status: 'active',
        phone: '1234567890',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      });
      console.log('Default Super Admin seeded successfully.');
    }

    // 2. Seed other collections if Category collection is empty
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount > 0) {
      console.log('Database collections already populated. Skipping main auto-seed.');
      return;
    }

    console.log('Database is empty. Initiating automatic seeding...');

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

    const categoriesList = [
      { name: 'Luxury Villa', slug: 'luxury-villa', description: 'Exclusive residential estates with expansive grounds' },
      { name: 'Penthouse Suite', slug: 'penthouse-suite', description: 'Top-tier apartments featuring panoramas' },
      { name: 'Modern Apartment', slug: 'modern-apartment', description: 'Elegant urban flats located in metropolis hubs' },
    ];
    const seededCategories = await Category.insertMany(categoriesList);

    const citiesList = [
      { name: 'New York', slug: 'new-york', state: 'NY', country: 'US', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
      { name: 'Los Angeles', slug: 'los-angeles', state: 'CA', country: 'US', image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80' },
      { name: 'Miami', slug: 'miami', state: 'FL', country: 'US', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=800&q=80' },
    ];
    const seededCities = await City.insertMany(citiesList);

    const locationsList = [
      { name: 'Manhattan Upper East', slug: 'manhattan-upper-east', city: seededCities[0]._id },
      { name: 'Beverly Hills Premium', slug: 'beverly-hills-premium', city: seededCities[1]._id },
      { name: 'South Beach Coastal', slug: 'south-beach-coastal', city: seededCities[2]._id },
    ];
    const seededLocations = await Location.insertMany(locationsList);

    const propertiesList = [
      {
        title: 'Manhattan Sky Penthouse',
        slug: 'manhattan-sky-penthouse',
        description: 'Commanding views of Central Park, this top-floor duplex penthouse features custom marble fittings, private elevator entrance, floor-to-ceiling glass columns, and a wrap-around terrace. An architectural masterwork in the heart of New York.',
        price: 12500000,
        status: 'available',
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
        agent: adminUserObj?._id,
        specs: { beds: 4, baths: 4.5, area: 4500, yearBuilt: 2021 }
      },
      {
        title: 'Beverly Hills Modern Estate',
        slug: 'beverly-hills-modern-estate',
        description: 'Tucked behind security gates on a prominent ridge, this modern estate redefines Southern California indoor-outdoor luxury living. Boasting double-height ceilings, a professional screening theater, and an infinity pool reflecting canyon lights.',
        price: 24500000,
        status: 'available',
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
        agent: adminUserObj?._id,
        specs: { beds: 6, baths: 7.5, area: 9200, yearBuilt: 2023 }
      },
      {
        title: 'South Beach Waterfront Oasis',
        slug: 'south-beach-waterfront-oasis',
        description: 'An architectural glass masterpiece directly on Miami waters. Features include a yacht dock, expansive entertainment decks, rooftop jacuzzi, custom chef kitchen, and private sandy shoreline views. Experience unparalleled tropical resort-style elegance.',
        price: 18900000,
        status: 'available',
        listingType: 'sale',
        category: seededCategories[0]._id,
        city: seededCities[2]._id,
        location: seededLocations[2]._id,
        features: ['Yacht Dock', 'Rooftop Jacuzzi', 'Private Beach Front', 'Chef Kitchen', 'Tesla Wall Charger'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
        ],
        agent: adminUserObj?._id,
        specs: { beds: 5, baths: 5.5, area: 6100, yearBuilt: 2022 }
      }
    ];
    await Property.insertMany(propertiesList);

    const blogsList = [
      {
        title: 'The Art of Buying Luxury Real Estate',
        slug: 'the-art-of-buying-luxury-real-estate',
        content: 'Investing in luxury properties requires understanding unique market cycles. High-net-worth buyers evaluate estates on parameters beyond basic area metrics: architectural history, geographic exclusivity, home wellness integration, and asset liquidity play huge parts. This guide outlines standard diligence checklists when entering premier neighborhoods.',
        author: adminUserObj?._id,
        status: 'published',
        tags: ['Finance', 'Investment', 'Guides'],
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Designing the Ultimate Penthouse Interior',
        slug: 'designing-the-ultimate-penthouse-interior',
        content: 'Penthouses offer top-tier urban real estate options. To frame high-altitude views effectively, interior design experts avoid heavy partitions. Floor-to-ceiling glass spans demand architectural lighting that highlights open-plan details while keeping window reflections minimal. Here we showcase three premier penthouse design studies.',
        author: adminUserObj?._id,
        status: 'published',
        tags: ['Design', 'Luxury', 'Inspirations'],
        coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
      }
    ];
    await Blog.insertMany(blogsList);

    const testimonialsList = [
      { clientName: 'Victoria Stirling', clientRole: 'CEO', clientCompany: 'Stirling Holdings', rating: 5, feedback: 'Aurelia helped us acquire our dream home in Beverly Hills. Their transaction management was seamless and highly professional.', status: 'published' },
      { clientName: 'David Vance', clientRole: 'Architect', clientCompany: 'Vance Design Partners', rating: 5, feedback: 'The listing exposure they generated for our Tribeca apartment was incredible. Sold in less than three weeks above asking price.', status: 'published' }
    ];
    await Testimonial.insertMany(testimonialsList);

    console.log('Database successfully auto-seeded.');
  } catch (error) {
    console.error('Database auto-seeding failed:', error);
  }
};
