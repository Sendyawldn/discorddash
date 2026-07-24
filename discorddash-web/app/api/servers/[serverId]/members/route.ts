import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { serverId } = await params;

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch members joined/left in the last 30 days
    const members = await prisma.member.findMany({
      where: {
        serverId,
        OR: [
          { joinedAt: { gte: thirtyDaysAgo } },
          { leftAt: { gte: thirtyDaysAgo } },
        ],
      },
      select: { joinedAt: true, leftAt: true },
    });

    // Group by day for Recharts
    const growthMap = new Map<string, { date: string; joins: number; leaves: number }>();
    
    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      growthMap.set(dateString, { date: dateString, joins: 0, leaves: 0 });
    }

    // Populate data
    members.forEach((m) => {
      const joinDate = m.joinedAt.toISOString().split("T")[0];
      if (growthMap.has(joinDate)) {
        growthMap.get(joinDate)!.joins += 1;
      }

      if (m.leftAt) {
        const leaveDate = m.leftAt.toISOString().split("T")[0];
        if (growthMap.has(leaveDate)) {
          growthMap.get(leaveDate)!.leaves += 1;
        }
      }
    });

    const data = Array.from(growthMap.values());
    return NextResponse.json(data);
  } catch (error) {
    console.error("[SERVER_MEMBERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
