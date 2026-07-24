import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { ChannelsChart } from "@/components/dashboard/ChannelsChart";
import { Heatmap } from "@/components/dashboard/Heatmap";
import { LeaderboardTable } from "@/components/dashboard/LeaderboardTable";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ServerDashboardPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const { serverId } = await params;

  // Ensure server exists before rendering dashboard
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    select: { id: true, name: true }
  });

  if (!server) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Analytics Overview</h1>
        <p className="text-zinc-400 mt-1">Real-time statistics for {server.name}.</p>
      </div>

      <OverviewCards serverId={serverId} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GrowthChart serverId={serverId} />
        <ChannelsChart serverId={serverId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Heatmap serverId={serverId} />
        <LeaderboardTable serverId={serverId} />
      </div>
    </div>
  );
}
