import { useState } from "react";
import { Search, SlidersHorizontal, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MapView = () => {
  const [viewMode, setViewMode] = useState<"standard" | "satellite">("standard");

  return (
    <div className="relative h-full w-full overflow-hidden touch-manipulation">
      {/* Map Background */}
      <div className={`absolute inset-0 ${
        viewMode === "standard" 
          ? "bg-gradient-to-br from-muted/30 via-background to-muted/40" 
          : "bg-gradient-to-br from-muted/60 via-muted/30 to-background"
      }`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Rechercher..."
            className="pl-9 sm:pl-10 h-11 sm:h-10 bg-card shadow-soft border-border text-base"
            inputMode="search"
          />
        </div>
        <Button size="icon" variant="outline" className="bg-card shadow-soft h-11 w-11 sm:h-10 sm:w-10 shrink-0">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* View Toggle - Hidden on mobile, shown on larger screens */}
      <div className="absolute top-16 sm:top-4 right-3 sm:right-4 z-10">
        <Button 
          size="icon" 
          variant="outline"
          className="bg-card shadow-soft h-11 w-11 sm:h-10 sm:w-10 transition-all duration-300 hover:scale-110 active:scale-95"
          onClick={() => setViewMode(viewMode === "standard" ? "satellite" : "standard")}
          aria-label="Changer de vue"
        >
          <Layers className="h-5 w-5 transition-transform duration-300" />
        </Button>
      </div>

      {/* Mock Pins - Touch optimized */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16">
          {mockPins.map((pin, index) => (
            <button
              key={pin.id}
              className="relative group touch-manipulation transition-all duration-300 hover:scale-125 active:scale-90 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={`Don: ${pin.title}`}
            >
              <div 
                className="w-14 h-14 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-medium transition-all duration-300 group-hover:shadow-primary"
                style={{ backgroundColor: pin.color }}
              >
                <span className="text-3xl sm:text-2xl transition-transform duration-300 group-hover:scale-110">🎁</span>
              </div>
              
              {/* Tooltip - Touch optimized */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 pointer-events-none z-20 scale-95 group-hover:scale-100 group-active:scale-100">
                <div className="bg-card rounded-xl shadow-medium p-3 w-[240px] sm:min-w-[200px] border border-border animate-scale-in">
                  <img 
                    src="/placeholder.svg" 
                    alt={pin.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div className="space-y-1">
                    <h4 className="font-heading font-semibold text-sm">{pin.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pin.color }} />
                      <span>{pin.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pin.distance}</p>
                  </div>
                  <Button size="sm" className="w-full mt-2 pointer-events-auto transition-all duration-300 hover:scale-105 active:scale-95">
                    Voir
                  </Button>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Legend - Mobile optimized */}
      <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 bg-card rounded-xl shadow-soft p-3 sm:p-4 border border-border text-xs sm:text-sm max-w-[150px] sm:max-w-none">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-category-food shrink-0" />
            <span className="truncate">Nourriture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-category-objects shrink-0" />
            <span className="truncate">Objets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-category-clothes shrink-0" />
            <span className="truncate">Vêtements</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mockPins = [
  { id: 1, title: "Canapé 3 places", category: "Objets", distance: "500m", color: "hsl(147, 50%, 36%)" },
  { id: 2, title: "Pain frais", category: "Nourriture", distance: "200m", color: "hsl(16, 100%, 66%)" },
  { id: 3, title: "Veste hiver", category: "Vêtements", distance: "1.2km", color: "hsl(260, 60%, 65%)" },
  { id: 4, title: "Livres enfants", category: "Objets", distance: "800m", color: "hsl(147, 50%, 36%)" },
  { id: 5, title: "Légumes bio", category: "Nourriture", distance: "350m", color: "hsl(16, 100%, 66%)" },
  { id: 6, title: "Lampe de bureau", category: "Électronique", distance: "1km", color: "hsl(225, 73%, 57%)" },
];

export default MapView;
