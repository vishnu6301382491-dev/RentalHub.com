import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Booking, Rental, User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query: Record<string, unknown> = {};
    if (userId) {
      query.userId = userId;
    }

    const bookings = await Booking.find(query)
      .populate('rentalId')
      .populate('userId', 'name email phone')
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const booking = await Booking.create({
      rentalId: body.rentalId,
      userId: body.userId,
      duration: body.duration,
      days: body.days,
      totalPrice: body.totalPrice,
      status: body.status || 'pending',
      startDate: body.startDate,
      endDate: body.endDate,
      deliveryAddress: body.deliveryAddress,
      paymentInfo: body.paymentInfo || { status: 'pending' },
    });

    // Update rental bookings array
    await Rental.findByIdAndUpdate(
      body.rentalId,
      { $push: { bookings: booking._id } }
    );

    // Update user bookings array
    await User.findByIdAndUpdate(
      body.userId,
      { $push: { bookings: booking._id } }
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
