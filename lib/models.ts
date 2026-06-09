import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['cars', 'tools', 'furniture', 'electronics', 'other'],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: '📦',
    },
    photos: [
      {
        type: String,
      },
    ],
    offerTitle: {
      type: String,
      default: '',
    },
    offerDetails: {
      type: String,
      default: '',
    },
    features: [
      {
        type: String,
      },
    ],
    installationSteps: [
      {
        type: String,
      },
    ],
    accessories: [
      {
        type: String,
      },
    ],
    deliveryIncluded: {
      type: Boolean,
      default: true,
    },
    installationIncluded: {
      type: Boolean,
      default: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availability: {
      type: String,
      enum: ['available', 'soon', 'unavailable'],
      default: 'available',
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    favoriteCategories: [
      {
        type: String,
      },
    ],
    portfolioPhotos: [
      {
        type: String,
      },
    ],
    offerDetails: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        badge: {
          type: String,
          default: '',
        },
        active: {
          type: Boolean,
          default: true,
        },
      },
    ],
    joinDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.8,
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const bookingSchema = new mongoose.Schema(
  {
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    duration: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    paymentInfo: {
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      transactionId: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Rental =
  mongoose.models.Rental || mongoose.model('Rental', rentalSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
