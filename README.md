# RentalHub - Rental Marketplace Website

A modern, full-featured rental marketplace platform built with Next.js, TypeScript, and Tailwind CSS. Users can browse rental items by location, book rentals with flexible payment plans (daily, weekly, monthly, yearly), and upload their own items to earn money.

## 🚀 Features

### For Renters:
- **Search & Browse**: Find rental items by category, location, and price range
- **Advanced Filters**: Filter by category, price range, and location
- **Detailed Listings**: View comprehensive item information, ratings, and reviews
- **Flexible Rental Plans**: Choose daily, weekly, monthly, or yearly rental periods
- **Easy Booking**: Multi-step checkout with delivery address and payment information
- **Booking History**: View current, upcoming, and past bookings
- **Favorites**: Save favorite items for later
- **Free Delivery & Installation**: Included with all rentals

### For Item Owners:
- **Item Upload**: List your items in minutes with detailed descriptions
- **Dynamic Pricing**: Set prices with automatic tier pricing (25% off for weekly, 50% for monthly, etc.)
- **Earnings Tracking**: Monitor total earnings and booking history
- **Item Management**: Activate/deactivate listings
- **Performance Analytics**: Track bookings and revenue

### General Features:
- **Location-Based Search**: Find items near your location
- **Star Ratings & Reviews**: View ratings from previous renters
- **User Profiles**: Complete profile management with contact information
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## 📁 Project Structure

```
rental-marketplace/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── listings/
│   │   ├── page.tsx            # Listings browsing page
│   │   └── [id]/
│   │       └── page.tsx        # Listing detail page
│   ├── checkout/
│   │   └── [id]/
│   │       └── page.tsx        # Checkout & booking page
│   ├── upload/
│   │   └── page.tsx            # Upload new item page
│   ├── profile/
│   │   └── page.tsx            # User profile & bookings
│   └── layout.tsx
├── lib/
│   └── data.ts                 # Mock data & types
├── public/
├── package.json
└── next.config.ts
```

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 16.2.7 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Runtime**: Node.js with React 19.2.4
- **Database**: MongoDB with Mongoose ORM
- **API**: Next.js API Routes

## 🗄️ Database

This application uses **MongoDB** for data persistence. All data is stored in collections:
- **Rentals**: Item listings with pricing, location, category
- **Users**: User profiles, bookings, favorites
- **Bookings**: Rental reservations with payment info

### Database Setup

**IMPORTANT**: Before running the application, ensure MongoDB is running:

1. **Local MongoDB**:
   ```bash
   # Install from mongodb.com or use Homebrew
   # Windows: Download installer from mongodb.com
   # macOS: brew install mongodb-community && brew services start mongodb-community
   # Linux: See MONGODB_SETUP.md for instructions
   
   # Verify MongoDB is running
   mongosh
   ```

2. **Docker** (Optional):
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Seed the Database**:
   ```bash
   npm run seed
   ```
   This will populate your database with 12 sample rental items.

4. **MongoDB Atlas** (Cloud):
   - Create account at mongodb.com/cloud/atlas
   - Update `MONGODB_URI` in `.env.local` with your connection string

For detailed setup instructions, see [MONGODB_SETUP.md](./MONGODB_SETUP.md)

## 📦 Installation

### Prerequisites:
- Node.js 22+
- npm or yarn
- **MongoDB running locally** (or MongoDB Atlas account for cloud)

### Quick Start:

```bash
# 1. Navigate to project directory
cd d:\rental-marketplace

# 2. Install dependencies
npm install

# 3. IMPORTANT: Start MongoDB service first!
# See "Database Setup" section above

# 4. Seed database with sample data
npm run seed

# 5. Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📄 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with search and featured categories |
| `/listings` | Browse all rentals with filters |
| `/listings/[id]` | Individual rental detail page |
| `/checkout/[id]` | Booking & payment page |
| `/upload` | Upload new rental item |
| `/profile` | User profile, bookings, and listings |

## 💳 Pricing Model

The platform uses dynamic pricing tiers:
- **Daily**: Full rate (e.g., $100/day)
- **Weekly**: 25% discount ($75/day × 7 = $525/week)
- **Monthly**: 50% discount ($50/day × 30 = $1,500/month)
- **Yearly**: 70% discount ($30/day × 365 = $10,950/year)

All rentals include:
- Free home delivery
- Professional installation
- 24/7 customer support
- 7-day satisfaction guarantee

## 🎯 Key Components

### Homepage
- Search bar with location filtering
- Featured categories (Cars, Tools, Furniture)
- Value proposition section
- Navigation to key pages

### Listings Page
- Grid layout with rental cards
- Sidebar filters (category, price range)
- Rating and location information
- Search functionality

### Listing Detail
- Full item description
- Pricing breakdown for different rental periods
- Delivery and installation info
- Booking calculator
- Add to favorites option

### Checkout
- Delivery address form
- Payment information
- Order summary
- Booking confirmation

### Upload Page
- Item details form
- Category selection
- Dynamic pricing information
- Tips for successful listings

### Profile Page
- User statistics (ratings, earnings, bookings)
- Booking management
- Listed items management
- Favorite items

## 📊 Mock Data

The application includes sample data for:
- 12 rental items across multiple categories
- Different price points and locations
- Realistic ratings and descriptions
- Booking history examples

Sample items include:
- Luxury cars (BMW, Mercedes, Tesla, Audi)
- Tools (drill kits, power saws, toolkits)
- Furniture (sofas, desks, dining sets)
- Electronics (laptops, monitors)

## 🚀 Future Enhancements

- [ ] User authentication & authorization
- [ ] Real payment processing
- [ ] Email notifications
- [ ] Image uploads for items
- [ ] Messaging system between renters and owners
- [ ] Advanced filtering (availability calendar, delivery radius)
- [ ] Admin dashboard
- [ ] Detailed analytics
- [ ] Insurance options
- [ ] Customer reviews & ratings system

**Version**: 1.0.0  
**Last Updated**: June 2026
