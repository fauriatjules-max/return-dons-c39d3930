import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const MessagesView = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header - Mobile optimized */}
      <div className="p-3 sm:p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Rechercher..."
            className="pl-9 sm:pl-10 h-11 sm:h-10 text-base"
            inputMode="search"
          />
        </div>
      </div>

      {/* Conversations List - Touch optimized */}
      <div className="flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
        {conversations.map((conv) => (
          <button 
            key={conv.id}
            className="w-full flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 active:bg-muted/50 transition-smooth border-b border-border text-left touch-manipulation"
          >
            <div className="relative shrink-0">
              <Avatar className="h-11 w-11 sm:h-12 sm:w-12">
                <AvatarImage src={conv.avatar} />
                <AvatarFallback className="text-base">{conv.name[0]}</AvatarFallback>
              </Avatar>
              {conv.unread > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-white text-[10px] border-2 border-background">
                  {conv.unread}
                </Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="font-heading font-semibold text-sm sm:text-base truncate">{conv.name}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 ml-2">{conv.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate leading-relaxed">
                {conv.lastMessage}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State - Mobile optimized */}
      {conversations.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="text-center space-y-2 max-w-xs">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">💬</div>
            <h3 className="font-heading font-semibold text-base sm:text-lg">Aucun message</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Vos conversations apparaîtront ici
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const conversations = [
  {
    id: 1,
    name: "Marie L.",
    avatar: "/placeholder.svg",
    lastMessage: "D'accord, je passe ce soir vers 18h !",
    time: "Il y a 5min",
    unread: 2
  },
  {
    id: 2,
    name: "Thomas D.",
    avatar: "/placeholder.svg",
    lastMessage: "Le canapé est toujours disponible ?",
    time: "Il y a 1h",
    unread: 0
  },
  {
    id: 3,
    name: "Sophie M.",
    avatar: "/placeholder.svg",
    lastMessage: "Merci beaucoup pour le don !",
    time: "Hier",
    unread: 0
  }
];

export default MessagesView;
