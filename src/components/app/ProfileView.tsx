import { Settings, Heart, Package, TrendingUp, LogOut, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProfileView = () => {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-card shadow-medium">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-heading font-bold">Marie L.</h2>
              <p className="text-muted-foreground">Membre depuis 2024</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-secondary">⭐</span>
                ))}
              </div>
              <span className="text-sm font-medium">5.0</span>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                🌟 Super Donateur
              </Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                ⚡ Super Rapide
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-4 text-center shadow-soft border border-border"
            >
              <div className="text-3xl font-heading font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Impact */}
        <div className="mx-6 mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-lg">Votre Impact</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-heading font-bold">25kg</div>
              <div className="text-sm text-muted-foreground">CO2 économisé</div>
            </div>
            <div>
              <div className="text-2xl font-heading font-bold">€250</div>
              <div className="text-sm text-muted-foreground">Valeur partagée</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="px-6 pb-6 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 h-14"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const stats = [
  { label: "Dons publiés", value: "12" },
  { label: "Dons reçus", value: "8" },
  { label: "Échanges", value: "20" }
];

const menuItems = [
  { label: "Mes dons en cours", icon: Package },
  { label: "Mes favoris", icon: Heart },
  { label: "Paramètres", icon: Settings },
  { label: "Aide & Support", icon: HelpCircle },
  { label: "Se déconnecter", icon: LogOut }
];

export default ProfileView;
