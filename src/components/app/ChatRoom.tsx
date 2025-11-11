import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Image as ImageIcon, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatRoomProps {
  donationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  onBack: () => void;
}

export const ChatRoom = ({
  donationId,
  otherUserId,
  otherUserName,
  otherUserAvatar,
  onBack,
}: ChatRoomProps) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(donationId, otherUserId);
  const [messageText, setMessageText] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [sendingLocation, setSendingLocation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendLocation = () => {
    setSendingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await sendMessage(
            "📍 Ma position",
            undefined,
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: "Ma position actuelle"
            }
          );
          setSendingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setSendingLocation(false);
        }
      );
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() && !selectedPhoto) return;

    await sendMessage(messageText, selectedPhoto || undefined);
    setMessageText("");
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  const initials = otherUserName.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUserAvatar} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{otherUserName}</h2>
          <p className="text-xs text-muted-foreground">En ligne</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun message</p>
            <p className="text-xs mt-1">Commencez la conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isMe = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {!isMe && (
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarImage src={otherUserAvatar} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isMe
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.photo_url && (
                        <img
                          src={message.photo_url}
                          alt="Shared photo"
                          className="rounded-lg mb-2 max-w-full"
                        />
                      )}
                      {message.location_lat && message.location_lng && (
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" />
                          <a
                            href={`https://www.google.com/maps?q=${message.location_lat},${message.location_lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline"
                          >
                            {message.location_name || 'Voir la position'}
                          </a>
                        </div>
                      )}
                      {message.content && (
                        <p className="text-sm break-words">{message.content}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-2">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Photo Preview */}
      {photoPreview && (
        <div className="px-4 py-2 border-t border-border">
          <div className="relative inline-block">
            <img
              src={photoPreview}
              alt="Preview"
              className="h-20 rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => {
                setSelectedPhoto(null);
                setPhotoPreview(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 bg-card border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendLocation}
            disabled={sendingLocation}
            className="shrink-0"
          >
            <MapPin className="w-5 h-5" />
          </Button>
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Votre message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!messageText.trim() && !selectedPhoto}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
