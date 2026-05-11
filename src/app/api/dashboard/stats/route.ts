import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Tenant, Agent, Violation } from '@/models';

export async function GET() {
  try {
    await connectDB();

    const [tenantCount, agentCount, violationCount] = await Promise.all([
      (Tenant as any).countDocuments(),
      (Agent as any).countDocuments(),
      (Violation as any).countDocuments()
    ]);

    return NextResponse.json({
      totalTenants: tenantCount,
      totalAgents: agentCount,
      totalViolations: violationCount,
      systemHealth: '100%'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Stats retrieval failed' }, { status: 500 });
  }
}
