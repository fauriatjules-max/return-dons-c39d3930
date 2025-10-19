import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const FeedView = () => {
  return (
    <div className="h-full overflow-y-auto bg-background overscroll-contain -webkit-overflow-scrolling-touch">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-card border-b border-border backdrop-blur-sm bg-card/95">
        <div className="flex gap-2 sm:gap-4 p-3 sm:p-4 max-w-2xl mx-auto">
          <Button variant="outline" className="flex-1 h-11 text-sm sm:text-base">
            Pour moi
          </Button>
          <Button variant="ghost" className="flex-1 h-11 text-sm sm:text-base">
            Derniers dons
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6 pb-6">
        {mockDonations.map((donation) => (
          <article 
            key={donation.id} 
            className="bg-card rounded-xl sm:rounded-2xl shadow-soft border border-border overflow-hidden active:shadow-medium transition-smooth"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                <AvatarImage src={donation.avatar} />
                <AvatarFallback>{donation.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-heading font-semibold text-sm sm:text-base truncate">{donation.author}</span>
                  <div 
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: donation.categoryColor }}
                  />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="truncate">{donation.date}</span>
                  <span>•</span>
                  <span className="truncate">{donation.category}</span>
                </div>
              </div>
              <Badge 
                className={`text-[10px] sm:text-xs shrink-0 ${
                  donation.status === "Disponible" 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "bg-secondary/10 text-secondary border-secondary/20"
                }`}
              >
                {donation.status}
              </Badge>
            </div>

            {/* Image - Touch optimized */}
            <div className="relative aspect-[4/3] bg-muted touch-manipulation">
              <img 
                src="/placeholder.svg" 
                alt={donation.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              <h3 className="font-heading font-semibold text-base sm:text-lg leading-snug">
                {donation.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {donation.description}
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                <span className="truncate">{donation.location}</span>
              </div>

              {/* Actions - Mobile optimized */}
              <div className="flex items-center gap-1 sm:gap-2 pt-2">
                <Button variant="ghost" size="sm" className="flex-1 h-10 sm:h-9 text-xs sm:text-sm">
                  <Heart className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Sauvegarder</span>
                  <span className="xs:hidden">J'aime</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 h-10 sm:h-9 text-xs sm:text-sm">
                  <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Message</span>
                  <span className="xs:hidden">Chat</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-10 sm:h-9 px-3 text-xs sm:text-sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const mockDonations = [
  {
    id: 1,
    author: "Marie L.",
    avatar: "/placeholder.svg",
    date: "Il y a 2h",
    category: "Objets",
    categoryColor: "hsl(147, 50%, 36%)",
    title: "Canapé 3 places en très bon état",
    description: "Canapé confortable, très peu utilisé. Déménagement, doit partir rapidement.",
    location: "Proche de Belleville",
    status: "Disponible"
  },
  {
    id: 2,
    author: "Anonyme",
    avatar: "",
    date: "Il y a 4h",
    category: "Nourriture",
    categoryColor: "hsl(16, 100%, 66%)",
    title: "Pain et viennoiseries du jour",
    description: "Invendus de la boulangerie, à récupérer avant 20h ce soir.",
    location: "Placement anonyme",
    status: "À récupérer vite"
  },
  {
    id: 3,
    author: "Thomas D.",
    avatar: "/placeholder.svg",
    date: "Hier",
    category: "Vêtements",
    categoryColor: "hsl(260, 60%, 65%)",
    title: "Veste d'hiver homme taille L",
    description: "Veste chaude en excellent état, ne me va plus.",
    location: "Proche de République",
    status: "Disponible"
  }
];

export default FeedView;
