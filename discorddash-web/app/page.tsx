import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-[#5865F2] selection:text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <BarChart3 className="w-6 h-6 text-[#5865F2]" />
            DiscordDash
          </div>
          <Link href="/login">
            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#5865F2]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-300 backdrop-blur-sm mb-4">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Now with real-time Prisma analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent">
            Unlock Your Server's <br className="hidden md:block" />
            <span className="text-[#5865F2]">True Potential</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Get beautiful, real-time insights into your Discord community. Track member growth, discover peak activity hours, and highlight your top contributors securely.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(88,101,242,0.4)] transition-all hover:shadow-[0_0_30px_rgba(88,101,242,0.6)]">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature grid preview */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: "Member Growth", desc: "Track joins and leaves with precision." },
            { icon: BarChart3, title: "Activity Heatmaps", desc: "Know exactly when your server is most active." },
            { icon: Zap, title: "Leaderboards", desc: "Gamify participation with live rankings." }
          ].map((feature, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm hover:border-zinc-700 transition-colors text-left">
              <div className="w-12 h-12 bg-zinc-800/80 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#5865F2]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
