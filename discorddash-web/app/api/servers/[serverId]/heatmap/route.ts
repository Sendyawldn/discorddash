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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch messages from last 7 days
    const messages = await prisma.message.findMany({
      where: {
        serverId,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    });

    // Initialize 7 days x 24 hours matrix with 0
    // days: 0 (Sun) to 6 (Sat)
    const heatmap: { day: number; hour: number; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        heatmap.push({ day: d, hour: h, count: 0 });
      }
    }

    // Process counts
    messages.forEach((m) => {
      const date = new Date(m.createdAt);
      const day = date.getDay();
      const hour = date.getHours();

      const index = heatmap.findIndex((item) => item.day === day && item.hour === hour);
      if (index !== -1) {
        heatmap[index].count += 1;
      }
    });

    return NextResponse.json(heatmap);
  } catch (error) {
    console.error("[SERVER_HEATMAP_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
