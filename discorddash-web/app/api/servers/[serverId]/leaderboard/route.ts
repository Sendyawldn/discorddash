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
    // Group messages by authorId
    const topUsers = await prisma.message.groupBy({
      by: ["authorId"],
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

    // We need to fetch usernames separately since groupBy doesn't support relation includes
    const authorIds = topUsers.map((u) => u.authorId);
    const members = await prisma.member.findMany({
      where: { id: { in: authorIds }, serverId },
      select: { id: true, username: true },
    });

    const data = topUsers.map((u, index) => {
      const member = members.find((m) => m.id === u.authorId);
      return {
        rank: index + 1,
        authorId: u.authorId,
        username: member?.username ?? "Unknown User",
        messages: u._count.id,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[SERVER_LEADERBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
