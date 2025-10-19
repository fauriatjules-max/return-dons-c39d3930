import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const FeedView = () => {
  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex gap-4 p-4 max-w-2xl mx-auto">
          <Button variant="outline" className="flex-1">
            Pour moi
          </Button>
          <Button variant="ghost" className="flex-1">
            Derniers dons
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {mockDonations.map((donation) => (
          <article 
            key={donation.id} 
            className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-medium transition-smooth"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <Avatar>
                <AvatarImage src={donation.avatar} />
                <AvatarFallback>{donation.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-semibold">{donation.author}</span>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: donation.categoryColor }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{donation.date}</span>
                  <span>•</span>
                  <span>{donation.category}</span>
                </div>
              </div>
              <Badge 
                className={
                  donation.status === "Disponible" 
                    ? "bg-primary/10 text-primary border-primary/20" 
                    : "bg-secondary/10 text-secondary border-secondary/20"
                }
              >
                {donation.status}
              </Badge>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] bg-muted">
              <img 
                src="/placeholder.svg" 
                alt={donation.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="font-heading font-semibold text-lg">
                {donation.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {donation.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{donation.location}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
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
