import { useState } from "react";
import { Search, SlidersHorizontal, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MapView = () => {
  const [viewMode, setViewMode] = useState<"standard" | "satellite">("standard");

  return (
    <div className="relative h-full w-full">
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
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un don..."
            className="pl-10 bg-card shadow-soft border-border"
          />
        </div>
        <Button size="icon" variant="outline" className="bg-card shadow-soft">
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* View Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          size="icon" 
          variant="outline"
          className="bg-card shadow-soft"
          onClick={() => setViewMode(viewMode === "standard" ? "satellite" : "standard")}
        >
          <Layers className="h-5 w-5" />
        </Button>
      </div>

      {/* Mock Pins */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-16">
          {mockPins.map((pin) => (
            <div 
              key={pin.id}
              className="relative group cursor-pointer"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-medium transition-smooth hover:scale-110"
                style={{ backgroundColor: pin.color }}
              >
                <span className="text-2xl">🎁</span>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none">
                <div className="bg-card rounded-xl shadow-medium p-3 min-w-[200px] border border-border">
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
                  <Button size="sm" className="w-full mt-2">
                    Voir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-4 bg-card rounded-xl shadow-soft p-4 border border-border">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-category-food" />
            <span>Nourriture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-category-objects" />
            <span>Objets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-category-clothes" />
            <span>Vêtements</span>
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
