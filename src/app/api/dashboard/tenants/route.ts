import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Tenant } from '@/models';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function GET() {
  try {
    await connectDB();
    const tenants = await (Tenant as any).find().sort({ createdAt: -1 });
    return NextResponse.json(tenants);
  } catch (error) {
    return NextResponse.json({ error: 'Tenant retrieval failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { companyName, adminEmail, password, plan, allowedSeats } = await req.json();

    const existing = await (Tenant as any).findOne({ adminEmail });
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const licenseKey = 'INSTALL-' + crypto.randomBytes(8).toString('hex').toUpperCase();
    const uninstallerKey = 'REMOVE-' + crypto.randomBytes(8).toString('hex').toUpperCase();

    const tenant = await (Tenant as any).create({
      companyName,
      adminEmail,
      password: hashedPassword,
      licenseKey,
      uninstallerKey,
      plan: plan || 'starter',
      allowedSeats: allowedSeats || 5,
      usedSeats: 0,
      status: 'active',
      settings: {
        aiSecurityOnly: true,
        strictMode: false,
        disableClipboard: false,
        disableInspectElement: false,
        whitelist: []
      }
    });

    return NextResponse.json({ success: true, tenantId: tenant._id });
  } catch (error: any) {
    return NextResponse.json({ error: 'Creation failed: ' + error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, ...updates } = await req.json();

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const tenant = await (Tenant as any).findByIdAndUpdate(id, updates, { new: true });
    
    if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

    return NextResponse.json({ success: true, tenant });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await (Tenant as any).findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
