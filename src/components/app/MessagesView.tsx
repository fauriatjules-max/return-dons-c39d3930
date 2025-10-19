import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const MessagesView = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une conversation..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div 
            key={conv.id}
            className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-smooth border-b border-border"
          >
            <div className="relative">
              <Avatar>
                <AvatarImage src={conv.avatar} />
                <AvatarFallback>{conv.name[0]}</AvatarFallback>
              </Avatar>
              {conv.unread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-white text-xs">
                  {conv.unread}
                </Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-semibold">{conv.name}</span>
                <span className="text-xs text-muted-foreground">{conv.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conv.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-heading font-semibold text-lg">Aucun message</h3>
            <p className="text-muted-foreground text-sm">
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
