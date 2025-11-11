import { Bell, Gift, MessageSquare, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'new_donation':
      return <Gift className="w-5 h-5 text-primary" />;
    case 'new_message':
      return <MessageSquare className="w-5 h-5 text-secondary" />;
    case 'donation_match':
      return <Bell className="w-5 h-5 text-accent" />;
  }
};

export const NotificationsList = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-heading font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {unreadCount} non {unreadCount === 1 ? 'lue' : 'lues'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Tout marquer lu
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Aucune notification</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Vous serez alerté ici des nouveaux dons et messages
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`w-full text-left p-4 transition-all hover:bg-muted/50 ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'font-semibold' : ''
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground/70">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
