"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Heatmap({ serverId }: { serverId: string }) {
  const [data, setData] = useState<{day: number, hour: number, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/servers/${serverId}/heatmap`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);
  }, [serverId]);

  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getOpacity = (count: number) => {
    if (count === 0) return 0.05;
    return 0.2 + (count / maxCount) * 0.8;
  };

  return (
    <Card className="bg-zinc-900/40 border-zinc-800/60 shadow-lg backdrop-blur-sm col-span-2">
      <CardHeader>
        <CardTitle>Activity Heatmap (7 Days)</CardTitle>
        <CardDescription className="text-zinc-400">Message intensity by hour of the day.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5865F2]" />
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full overflow-x-auto pb-4">
            <div className="flex ml-8 gap-1 mb-2">
              {[...Array(24)].map((_, h) => (
                <div key={h} className="w-6 text-[10px] text-zinc-500 text-center flex-shrink-0">
                  {h % 3 === 0 ? `${h}h` : ''}
                </div>
              ))}
            </div>
            {days.map((dayName, dayIndex) => (
              <div key={dayIndex} className="flex items-center gap-1">
                <div className="w-8 text-xs text-zinc-400 font-medium">{dayName}</div>
                <div className="flex gap-1">
                  {[...Array(24)].map((_, hour) => {
                    const item = data.find(d => d.day === dayIndex && d.hour === hour);
                    const count = item?.count || 0;
                    return (
                      <div 
                        key={hour}
                        className="w-6 h-6 rounded-sm bg-[#5865F2] transition-opacity cursor-crosshair group relative flex-shrink-0"
                        style={{ opacity: getOpacity(count) }}
                      >
                        <div className="absolute opacity-0 group-hover:opacity-100 bg-zinc-800 text-white text-xs py-1 px-2 rounded-md -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-50 pointer-events-none transition-opacity">
                          {count} messages
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
