import { useState, useEffect } from "react";
import { Bell, Gift, MessageSquare, Target } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  new_donations: boolean;
  new_messages: boolean;
  donation_matches: boolean;
}

export const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    new_donations: true,
    new_messages: true,
    donation_matches: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching preferences:', error);
      } else if (data) {
        setPreferences({
          new_donations: data.new_donations,
          new_messages: data.new_messages,
          donation_matches: data.donation_matches,
        });
      } else {
        // Create default preferences if none exist
        await supabase
          .from('notification_preferences')
          .insert({
            user_id: user.id,
            new_donations: true,
            new_messages: true,
            donation_matches: true,
          });
      }
      setLoading(false);
    };

    fetchPreferences();
  }, [user]);

  const updatePreference = async (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    if (!user) return;

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...newPreferences,
      });

    if (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive",
      });
      // Revert on error
      setPreferences(preferences);
    } else {
      toast({
        title: "Préférences mises à jour",
        description: "Vos préférences de notification ont été enregistrées",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-heading font-semibold">Préférences de notification</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Choisissez les notifications que vous souhaitez recevoir
        </p>
      </div>

      <div className="divide-y divide-border">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Gift className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-0.5">Nouveaux dons</h3>
              <p className="text-xs text-muted-foreground">
                Soyez alerté quand un nouveau don est publié
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.new_donations}
            onCheckedChange={(checked) => updatePreference('new_donations', checked)}
          />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <MessageSquare className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-0.5">Messages</h3>
              <p className="text-xs text-muted-foreground">
                Recevez une notification pour chaque nouveau message
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.new_messages}
            onCheckedChange={(checked) => updatePreference('new_messages', checked)}
          />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Target className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-0.5">Dons correspondants</h3>
              <p className="text-xs text-muted-foreground">
                Alertes pour les dons qui correspondent à vos critères
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.donation_matches}
            onCheckedChange={(checked) => updatePreference('donation_matches', checked)}
          />
        </div>
      </div>

      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex gap-2 text-xs text-muted-foreground">
          <Bell className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Les notifications push nécessitent l'autorisation de votre navigateur.
            Vous pouvez gérer ces autorisations dans les paramètres de votre appareil.
          </p>
        </div>
      </div>
    </div>
  );
};
