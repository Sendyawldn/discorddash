"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function LeaderboardTable({ serverId }: { serverId: string }) {
  const [data, setData] = useState<{ rank: number; authorId: string; username: string; messages: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/servers/${serverId}/leaderboard`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);
  }, [serverId]);

  return (
    <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Members
        </CardTitle>
        <CardDescription className="text-zinc-400">Most active users by message count.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5865F2]" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-900/50 hover:bg-zinc-900/50">
              <TableRow className="border-zinc-800">
                <TableHead className="w-[80px] text-zinc-400">Rank</TableHead>
                <TableHead className="text-zinc-400">User</TableHead>
                <TableHead className="text-right text-zinc-400">Messages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.authorId} className="border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                  <TableCell className="font-medium text-zinc-300">
                    {user.rank === 1 && <span className="text-yellow-500 font-bold">#1</span>}
                    {user.rank === 2 && <span className="text-slate-300 font-bold">#2</span>}
                    {user.rank === 3 && <span className="text-amber-600 font-bold">#3</span>}
                    {user.rank > 3 && `#${user.rank}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-zinc-700">
                        <AvatarFallback className="bg-zinc-800 text-xs">{user.username.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-zinc-200">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-[#5865F2]">
                    {user.messages.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-zinc-500">
                    No activity recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
