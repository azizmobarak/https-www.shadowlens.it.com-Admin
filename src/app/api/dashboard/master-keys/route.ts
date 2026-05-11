import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { GlobalConfig, User } from '@/models';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { password } = await req.json();

    const me = await (User as any).findOne({ email: 'mobarakaziz9@gmail.com' }).select('+password');
    const isMatch = await bcrypt.compare(password, me.password);

    if (!isMatch) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const config = await (GlobalConfig as any).findOne({});
    return NextResponse.json({ masterKey: config.masterRecoveryKey });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
