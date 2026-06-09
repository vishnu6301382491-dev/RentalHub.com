import mongoose from 'mongoose';
import { Rental } from '../lib/models';

const MONGODB_URI = 'mongodb://localhost:27017/rental-marketplace';

const mockRentals = [
  {
    title: 'Luxury BMW 7 Series',
    description: 'Premium luxury sedan with leather seats and advanced features',
    price: 150,
    location: 'New York, NY',
    category: 'cars',
    rating: 4.9,
    reviews: 45,
    image: '🚗',
  },
  {
    title: 'Cordless Drill Kit Pro',
    description: 'Professional-grade cordless drill with complete accessory kit',
    price: 25,
    location: 'Los Angeles, CA',
    category: 'tools',
    rating: 4.7,
    reviews: 32,
    image: '🔧',
  },
  {
    title: 'Modern L-Shaped Sofa',
    description: 'Contemporary grey fabric sofa perfect for living rooms',
    price: 80,
    location: 'Chicago, IL',
    category: 'furniture',
    rating: 4.8,
    reviews: 28,
    image: '🛋️',
  },
  {
    title: 'Mercedes C-Class Sedan',
    description: 'Elegant luxury sedan with all modern amenities',
    price: 180,
    location: 'Houston, TX',
    category: 'cars',
    rating: 4.6,
    reviews: 38,
    image: '🚗',
  },
  {
    title: 'Power Saw Set',
    description: 'High-powered circular saw with safety features',
    price: 35,
    location: 'Phoenix, AZ',
    category: 'tools',
    rating: 4.5,
    reviews: 22,
    image: '🔧',
  },
  {
    title: 'Dining Room Table & Chairs',
    description: 'Wooden dining table with 6 comfortable chairs',
    price: 120,
    location: 'Philadelphia, PA',
    category: 'furniture',
    rating: 4.9,
    reviews: 19,
    image: '🛋️',
  },
  {
    title: 'Tesla Model 3',
    description: 'Electric luxury vehicle with Autopilot features',
    price: 200,
    location: 'San Francisco, CA',
    category: 'cars',
    rating: 5.0,
    reviews: 67,
    image: '🚗',
  },
  {
    title: 'Complete Toolkit',
    description: 'All-in-one toolkit with 50+ pieces',
    price: 40,
    location: 'Seattle, WA',
    category: 'tools',
    rating: 4.8,
    reviews: 41,
    image: '🔧',
  },
  {
    title: 'Office Desk Setup',
    description: 'Modern standing desk with ergonomic chair',
    price: 60,
    location: 'Boston, MA',
    category: 'furniture',
    rating: 4.7,
    reviews: 25,
    image: '🛋️',
  },
  {
    title: 'Audi A4 Sedan',
    description: 'Premium sedan with superior handling',
    price: 170,
    location: 'Miami, FL',
    category: 'cars',
    rating: 4.8,
    reviews: 35,
    image: '🚗',
  },
  {
    title: 'Laptop & Monitor Setup',
    description: 'High-performance laptop with 4K monitor',
    price: 50,
    location: 'Denver, CO',
    category: 'electronics',
    rating: 4.6,
    reviews: 29,
    image: '💻',
  },
  {
    title: 'Wedding Chair Rental',
    description: 'Elegant white chairs for special events',
    price: 5,
    location: 'Atlanta, GA',
    category: 'furniture',
    rating: 4.9,
    reviews: 52,
    image: '🪑',
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing rentals
    await Rental.deleteMany({});
    console.log('Cleared existing rentals');

    // Insert mock rentals
    const rentals = await Rental.insertMany(
      mockRentals.map((rental) => ({
        ...rental,
        ownerId: new mongoose.Types.ObjectId(), // Generate a default owner ID
      }))
    );

    console.log(`Seeded ${rentals.length} rentals`);

    await mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
