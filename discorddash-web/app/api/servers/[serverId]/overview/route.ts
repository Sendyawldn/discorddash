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
    const totalMembers = await prisma.member.count({
      where: { serverId, leftAt: null },
    });

    const totalMessages = await prisma.message.count({
      where: { serverId },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messagesLast7Days = await prisma.message.count({
      where: {
        serverId,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    // We can also fetch the server name/icon for the header here
    const serverInfo = await prisma.server.findUnique({
      where: { id: serverId },
      select: { name: true, iconUrl: true },
    });

    if (!serverInfo) {
      return new NextResponse("Server not found", { status: 404 });
    }

    return NextResponse.json({
      server: serverInfo,
      stats: {
        totalMembers,
        totalMessages,
        messagesLast7Days,
      },
    });
  } catch (error) {
    console.error("[SERVER_OVERVIEW_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
