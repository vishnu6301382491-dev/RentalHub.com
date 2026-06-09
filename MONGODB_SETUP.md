# MongoDB Setup Guide for RentalHub

## Prerequisites
Before connecting to MongoDB, you need to have MongoDB installed and running on your system.

### Option 1: Using MongoDB Community Edition (Local)

#### Windows Installation:
1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows Service
4. Verify installation by opening Command Prompt and running:
   ```bash
   mongosh
   ```

#### macOS Installation:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux Installation (Ubuntu):
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Option 2: Using Docker

If you have Docker installed:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

This will start MongoDB in a container on port 27017.

### Option 3: Using MongoDB Atlas (Cloud)

1. Create a free account at: https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-marketplace?retryWrites=true&w=majority
   ```

## Verifying MongoDB Connection

Once MongoDB is running, verify the connection:

```bash
mongosh "mongodb://localhost:27017/rental-marketplace"
```

You should see a prompt like:
```
rental-marketplace>
```

## Seeding the Database

After MongoDB is running and verified, seed the database with initial rental data:

```bash
npm run seed
```

You should see output like:
```
Connected to MongoDB
Cleared existing rentals
Seeded 12 rentals
Database seeded successfully
```

## Starting the Application

After seeding is complete, start the development server:

```bash
npm run dev
```

The application will be available at: http://localhost:3000

All pages now connect to MongoDB instead of using mock data!

## Troubleshooting

### Connection Error: "connect ECONNREFUSED ::1:27017"
- MongoDB is not running
- Make sure MongoDB service is started on your system
- Verify port 27017 is not blocked by firewall

### Connection Error: "Authentication failed"
- If using MongoDB Atlas, check username/password in connection string
- Ensure your IP is whitelisted in MongoDB Atlas

### Database is empty after seeding
- Check that seed script ran successfully
- Verify no errors in MongoDB connection
- Run `npm run seed` again

## Database Structure

### Rentals Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number (daily rate),
  location: String,
  category: String (cars, tools, furniture, electronics),
  rating: Number (1-5),
  reviews: Number,
  image: String (emoji),
  ownerId: ObjectId,
  availability: String (available, soon, unavailable),
  bookings: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection (Created in Code)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  location: String,
  joinDate: Date,
  rating: Number,
  listings: [ObjectId],
  bookings: [ObjectId],
  favorites: [ObjectId]
}
```

### Bookings Collection (Created in Code)
```javascript
{
  _id: ObjectId,
  rentalId: ObjectId,
  userId: ObjectId,
  duration: String (daily, weekly, monthly, yearly),
  days: Number,
  totalPrice: Number,
  status: String (pending, active, completed, cancelled),
  startDate: Date,
  endDate: Date,
  deliveryAddress: String,
  paymentInfo: {
    status: String,
    transactionId: String
  }
}
```

## API Endpoints

### Rentals
- `GET /api/rentals` - List all rentals (supports filtering)
- `POST /api/rentals` - Create new rental
- `GET /api/rentals/[id]` - Get rental details
- `PUT /api/rentals/[id]` - Update rental
- `DELETE /api/rentals/[id]` - Delete rental

### Query Parameters for GET /api/rentals
- `search` - Search by title or description
- `location` - Filter by location
- `category` - Filter by category
- `minPrice` - Minimum daily price
- `maxPrice` - Maximum daily price

Example: `/api/rentals?search=tesla&category=cars&maxPrice=200`

### Bookings
- `GET /api/bookings` - List bookings (optional: `userId` param)
- `POST /api/bookings` - Create new booking

## Next Steps

1. ✅ Ensure MongoDB is running
2. ✅ Seed database with initial data: `npm run seed`
3. ✅ Start dev server: `npm run dev`
4. Implement user authentication
5. Integrate payment processing (Stripe/PayPal)
6. Add image uploads to Cloudinary/AWS S3
7. Build admin dashboard
