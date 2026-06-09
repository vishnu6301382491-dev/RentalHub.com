import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models';
import { hashPassword, toPublicUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const {
      name,
      email,
      password,
      phone,
      location,
      latitude = null,
      longitude = null,
      bio = '',
      favoriteCategories = [],
      avatarUrl = '',
      portfolioPhotos = [],
    } = await request.json();

    if (!name || !email || !password || !phone || !location) {
      return NextResponse.json(
        { error: 'Please complete all required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashPassword(password),
      phone,
      location,
      latitude,
      longitude,
      bio,
      favoriteCategories,
      avatarUrl,
      portfolioPhotos,
      rating: 5.0,
    });

    // Set cookie (in production, use secure HTTP-only cookies)
    const response = NextResponse.json(toPublicUser(user));

    response.cookies.set('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
