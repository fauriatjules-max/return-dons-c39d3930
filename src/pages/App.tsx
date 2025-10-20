import { useState } from "react";
import { Map, Grid3x3, PlusCircle, MessageCircle, User } from "lucide-react";
import MapView from "@/components/app/MapView";
import FeedView from "@/components/app/FeedView";
import PublishView from "@/components/app/PublishView";
import MessagesView from "@/components/app/MessagesView";
import ProfileView from "@/components/app/ProfileView";

type Tab = "map" | "feed" | "publish" | "messages" | "profile";

const AppPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("map");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30">
      {/* Mobile Container 9:16 format */}
      <div className="h-screen w-full max-w-[56.25vh] bg-background overflow-hidden touch-manipulation flex flex-col shadow-2xl">
        {/* Main Content */}
        <main className="flex-1 overflow-hidden overscroll-contain relative">
        <div className={`absolute inset-0 transition-all duration-300 ${activeTab === "map" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}>
          <MapView />
        </div>
        <div className={`absolute inset-0 transition-all duration-300 ${activeTab === "feed" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}>
          <FeedView />
        </div>
        <div className={`absolute inset-0 transition-all duration-300 ${activeTab === "publish" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
          <PublishView />
        </div>
        <div className={`absolute inset-0 transition-all duration-300 ${activeTab === "messages" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}>
          <MessagesView />
        </div>
        <div className={`absolute inset-0 transition-all duration-300 ${activeTab === "profile" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}>
          <ProfileView />
        </div>
      </main>

      {/* Bottom Navigation - Fixed with safe area */}
      <nav className="bg-card border-t border-border shadow-medium safe-bottom">
        <div className="flex justify-around items-center h-16 sm:h-20 px-2 sm:px-4 max-w-2xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 min-h-[44px] min-w-[44px] ${
                activeTab === tab.id
                  ? "text-primary scale-110 bg-primary/5"
                  : "text-muted-foreground active:text-foreground active:scale-95"
              }`}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <tab.icon 
                className={`h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? tab.id === "publish" 
                      ? "animate-pulse-soft scale-110" 
                      : "scale-110"
                    : "scale-100"
                }`} 
              />
              <span className={`text-[10px] sm:text-xs font-medium transition-all duration-300 ${
                activeTab === tab.id ? "opacity-100" : "opacity-70"
              }`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
      </div>
    </div>
  );
};

const tabs = [
  { id: "map" as Tab, label: "Carte", icon: Map },
  { id: "feed" as Tab, label: "Flux", icon: Grid3x3 },
  { id: "publish" as Tab, label: "Publier", icon: PlusCircle },
  { id: "messages" as Tab, label: "Messages", icon: MessageCircle },
  { id: "profile" as Tab, label: "Profil", icon: User },
];

export default AppPage;
