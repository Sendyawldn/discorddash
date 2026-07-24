import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  MessageSquare, 
  BarChart3,
  ArrowLeft
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ serverId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { serverId } = await params;
  
  // Verify access (optional: check if owner, but for now just fetch info)
  const server = await prisma.server.findUnique({
    where: { id: serverId },
  });

  if (!server) {
    redirect("/dashboard");
  }

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: `/dashboard/${serverId}` },
    { name: "Members", icon: Users, href: `/dashboard/${serverId}/members` },
    { name: "Channels", icon: MessageSquare, href: `/dashboard/${serverId}/channels` },
    { name: "Insights", icon: BarChart3, href: `/dashboard/${serverId}/insights` },
    { name: "Settings", icon: Settings, href: `/dashboard/${serverId}/settings` },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800/60 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Servers
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <Avatar className="w-10 h-10 border border-zinc-700 shadow-sm">
              <AvatarImage src={server.iconUrl || ""} alt={server.name} />
              <AvatarFallback className="bg-[#5865F2] text-white">
                {server.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-sm truncate w-40 leading-tight">{server.name}</h2>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">Analytics</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all font-medium text-sm group"
                >
                  <Icon className="w-4 h-4 group-hover:text-[#5865F2] transition-colors" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-xs font-bold">{session.user.name?.charAt(0) || "U"}</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-xs text-zinc-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
        {children}
      </main>
    </div>
  );
}
