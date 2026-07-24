import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Users, LogOut } from "lucide-react";

export default async function MembersPage({ params }: { params: Promise<{ serverId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { serverId } = await params;

  // Fetch all members for this server
  const members = await prisma.member.findMany({
    where: { serverId },
    orderBy: { joinedAt: "desc" },
  });

  const activeMembers = members.filter(m => !m.leftAt).length;
  const leftMembers = members.filter(m => m.leftAt).length;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Server Members</h1>
          <p className="text-zinc-400 mt-2">Manage and view all members synced from Discord.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg text-sm">
            <span className="text-zinc-400">Active:</span> <span className="text-emerald-400 font-bold ml-1">{activeMembers}</span>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg text-sm">
            <span className="text-zinc-400">Left:</span> <span className="text-red-400 font-bold ml-1">{leftMembers}</span>
          </div>
        </div>
      </div>

      <div className="border border-zinc-800/60 rounded-xl overflow-hidden bg-zinc-900/30 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-zinc-900/80">
            <TableRow className="border-zinc-800/60 hover:bg-zinc-800/50">
              <TableHead className="w-[300px] text-zinc-400">User</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow className="border-zinc-800/60">
                <TableCell colSpan={3} className="h-24 text-center text-zinc-500">
                  No members found. Make sure the bot is running to sync members!
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="border-zinc-800/60 hover:bg-zinc-800/40">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-zinc-700">
                        <AvatarFallback className="bg-zinc-800 text-xs">
                          {member.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-zinc-200">{member.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.leftAt ? (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        <LogOut className="w-3 h-3 mr-1" /> Left
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        <Users className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-zinc-400 text-sm">
                    {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
