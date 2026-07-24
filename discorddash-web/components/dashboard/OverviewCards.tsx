"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Activity } from "lucide-react";

type Stats = {
  totalMembers: number;
  totalMessages: number;
  messagesLast7Days: number;
};

export function OverviewCards({ serverId }: { serverId: string }) {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/servers/${serverId}/overview`)
        .then((res) => res.json())
        .then((d) => {
          setData(d.stats);
          setLoading(false);
        })
        .catch(console.error);
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5 seconds polling
    return () => clearInterval(interval);
  }, [serverId]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-zinc-900/50 border-zinc-800/60 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5865F2]/10 blur-3xl -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-150" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-zinc-400">Total Members</CardTitle>
          <Users className="h-4 w-4 text-[#5865F2]" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">{data?.totalMembers.toLocaleString()}</div>
          <p className="text-xs text-green-400 mt-1 flex items-center">
            <Activity className="w-3 h-3 mr-1" /> Active community
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-150" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-zinc-400">Total Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">{data?.totalMessages.toLocaleString()}</div>
          <p className="text-xs text-zinc-500 mt-1">All time messages</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-150" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-zinc-400">Messages (7d)</CardTitle>
          <Activity className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold text-white">{data?.messagesLast7Days.toLocaleString()}</div>
          <p className="text-xs text-emerald-400 mt-1">Recent activity volume</p>
        </CardContent>
      </Card>
    </div>
  );
}
