import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Settings, Server } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardIndex() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch servers owned by this user
  const servers = await prisma.server.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Servers</h1>
          <p className="text-zinc-400 mt-2">Select a server to view its real-time analytics.</p>
        </div>

        {servers.length === 0 ? (
          <div className="border border-zinc-800/50 bg-zinc-900/20 backdrop-blur rounded-xl p-12 text-center">
            <Server className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">No servers found</h2>
            <p className="text-zinc-400 mt-2">
              Invite the DiscordDash bot to your server to start collecting analytics.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <Link key={server.id} href={`/dashboard/${server.id}`}>
                <Card className="bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800/40 hover:border-[#5865F2]/50 transition-all cursor-pointer group shadow-lg hover:shadow-[0_0_20px_rgba(88,101,242,0.15)]">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="w-14 h-14 border border-zinc-800">
                      <AvatarImage src={server.iconUrl || ""} alt={server.name} />
                      <AvatarFallback className="bg-zinc-800 text-zinc-300">
                        {server.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg group-hover:text-[#5865F2] transition-colors">
                        {server.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 font-mono">
                        ID: {server.id}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-zinc-400 gap-2">
                      <Settings className="w-4 h-4" />
                      Manage Analytics
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
