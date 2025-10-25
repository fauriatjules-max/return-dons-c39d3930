import { Settings, Heart, Package, TrendingUp, LogOut, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfileView = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Utilisateur";
  const initials = displayName.substring(0, 2).toUpperCase();

  const menuItems = [
    { label: "Mes dons en cours", icon: Package, action: () => {} },
    { label: "Mes favoris", icon: Heart, action: () => {} },
    { label: "Paramètres", icon: Settings, action: () => {} },
    { label: "Aide & Support", icon: HelpCircle, action: () => {} },
    { label: "Se déconnecter", icon: LogOut, action: handleLogout }
  ];

  return (
    <div className="h-full overflow-y-auto bg-background overscroll-contain -webkit-overflow-scrolling-touch">
      <div className="max-w-2xl mx-auto pb-6">
        {/* Profile Header - Mobile optimized */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-card shadow-medium">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-xl sm:text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">Membre depuis {new Date(user?.created_at || Date.now()).getFullYear()}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-secondary text-base sm:text-lg">⭐</span>
                ))}
              </div>
              <span className="text-sm font-medium">5.0</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
                🌟 Super Donateur
              </Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs sm:text-sm">
                ⚡ Super Rapide
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats - Mobile optimized */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl p-3 sm:p-4 text-center shadow-soft border border-border transition-all duration-300 hover:shadow-medium hover:scale-105 active:scale-95 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-0.5 sm:mb-1 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Impact - Mobile optimized */}
        <div className="mx-3 sm:mx-6 mb-4 sm:mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 sm:p-6 border border-border">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-base sm:text-lg">Votre Impact</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-heading font-bold">25kg</div>
              <div className="text-xs sm:text-sm text-muted-foreground">CO2 économisé</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-heading font-bold">€250</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Valeur partagée</div>
            </div>
          </div>
        </div>

        {/* Menu - Touch optimized */}
        <div className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-1 sm:space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              onClick={item.action}
              className="w-full justify-start gap-2.5 sm:gap-3 h-12 sm:h-14 text-sm sm:text-base touch-manipulation transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-muted/50 animate-fade-in"
              style={{ animationDelay: `${(index + 3) * 50}ms` }}
            >
              <item.icon className="h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 group-hover:scale-110" />
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

export default ProfileView;
