import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '4c494ed2a83aacf4d676253edb084fef75e92c250e7279e7df8c6aa845c3aa7f';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await (User as any).findOne({ email, role: 'admin' }).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid Master Key' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'super-admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json({ message: 'Welcome Master' }, { status: 200 });
    response.cookies.set('super_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'System Failure: ' + error.message }, { status: 500 });
  }
}
