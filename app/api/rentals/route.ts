import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Rental } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const ownerId = searchParams.get('ownerId') || '';
    const minPrice = searchParams.get('minPrice') || 0;
    const maxPrice = searchParams.get('maxPrice') || 10000;

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (ownerId) {
      query.ownerId = ownerId;
    }

    query.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };

    const rentals = await Rental.find(query)
      .populate('ownerId', 'name email phone')
      .lean();

    return NextResponse.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    if (!body.ownerId || !mongoose.Types.ObjectId.isValid(body.ownerId)) {
      return NextResponse.json(
        { error: 'A valid owner account is required to publish a listing' },
        { status: 400 }
      );
    }

    const photos = Array.isArray(body.photos) ? body.photos.filter(Boolean) : [];

    const rental = await Rental.create({
      title: body.title,
      description: body.description,
      price: body.price,
      location: body.location,
      category: body.category,
      image: body.image || '📦',
      photos,
      offerTitle: body.offerTitle || '',
      offerDetails: body.offerDetails || '',
      features: Array.isArray(body.features) ? body.features : [],
      installationSteps: Array.isArray(body.installationSteps) ? body.installationSteps : [],
      accessories: Array.isArray(body.accessories) ? body.accessories : [],
      deliveryIncluded: body.deliveryIncluded ?? true,
      installationIncluded: body.installationIncluded ?? true,
      ownerId: body.ownerId,
      availability: body.availability || 'available',
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json(
      { error: 'Failed to create rental' },
      { status: 500 }
    );
  }
}
