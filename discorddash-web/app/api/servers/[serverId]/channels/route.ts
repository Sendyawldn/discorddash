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
    // Group messages by channelId
    const topChannels = await prisma.message.groupBy({
      by: ["channelId", "channelName"],
      where: { serverId },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    });

    const data = topChannels.map((c) => ({
      channelId: c.channelId,
      name: c.channelName,
      messages: c._count.id,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[SERVER_CHANNELS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
