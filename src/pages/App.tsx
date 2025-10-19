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
    <div className="h-screen flex flex-col bg-background overflow-hidden touch-manipulation">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden overscroll-contain">
        {activeTab === "map" && <MapView />}
        {activeTab === "feed" && <FeedView />}
        {activeTab === "publish" && <PublishView />}
        {activeTab === "messages" && <MessagesView />}
        {activeTab === "profile" && <ProfileView />}
      </main>

      {/* Bottom Navigation - Fixed with safe area */}
      <nav className="bg-card border-t border-border shadow-medium safe-bottom">
        <div className="flex justify-around items-center h-16 sm:h-20 px-2 sm:px-4 max-w-2xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 sm:px-4 rounded-lg transition-smooth min-h-[44px] min-w-[44px] ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              }`}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <tab.icon 
                className={`h-6 w-6 sm:h-7 sm:w-7 ${
                  activeTab === tab.id && tab.id === "publish" 
                    ? "animate-pulse-soft" 
                    : ""
                }`} 
              />
              <span className="text-[10px] sm:text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
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
