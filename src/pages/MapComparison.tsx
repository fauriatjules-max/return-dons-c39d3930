import React, { useState, useEffect } from 'react';
import FreeSatelliteMap from '@/components/FreeSatelliteMap';
import EmergencyMap from '@/components/EmergencyMap';
import SimpleImageMap from '@/components/SimpleImageMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const MapComparison = () => {
  const [activeMap, setActiveMap] = useState('satellite');
  const [newDonationIds, setNewDonationIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Fetch real donations from Supabase
  const { data: donations, isLoading } = useQuery({
    queryKey: ['donations-for-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('id, title, description, category_id, location_lat, location_lng, status')
        .eq('status', 'disponible')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null);

      if (error) throw error;

      // Transform data to match FreeSatelliteMap format
      return data?.map(donation => ({
        id: donation.id,
        title: donation.title,
        description: donation.description,
        category: donation.category_id,
        location: {
          coordinates: [Number(donation.location_lng), Number(donation.location_lat)]
        }
      })) || [];
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          console.log('Donation change detected:', payload);
          
          // Track new donations for animation
          if (payload.eventType === 'INSERT') {
            const newId = payload.new.id;
            setNewDonationIds(prev => [...prev, newId]);
            
            // Remove from new list after animation completes (2 seconds)
            setTimeout(() => {
              setNewDonationIds(prev => prev.filter(id => id !== newId));
            }, 2000);
            
            toast.success('Nouveau don disponible sur la carte!');
          } else if (payload.eventType === 'UPDATE') {
            toast.info('Un don a été mis à jour');
          } else if (payload.eventType === 'DELETE') {
            toast.info('Un don a été retiré');
          }
          
          // Invalidate and refetch donations
          queryClient.invalidateQueries({ queryKey: ['donations-for-map'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
            🗺️ Comparaison des Cartes
          </h1>
          <p className="text-muted-foreground">
            Testez et comparez les trois implémentations de cartes disponibles
          </p>
        </div>

        <Tabs value={activeMap} onValueChange={setActiveMap} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="satellite" className="gap-2">
              🛰️ Satellite Map
              <Badge variant="secondary" className="ml-2">Complet</Badge>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2">
              🚨 Emergency Map
              <Badge variant="secondary" className="ml-2">Fallback</Badge>
            </TabsTrigger>
            <TabsTrigger value="simple" className="gap-2">
              🖼️ Simple Map
              <Badge variant="secondary" className="ml-2">Léger</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="satellite" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>FreeSatelliteMap - Carte Interactive Complète</CardTitle>
                <CardDescription>
                  Utilise React-Leaflet avec tuiles satellites, marqueurs personnalisés et géolocalisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">✅ Vue satellite</Badge>
                    <Badge variant="default">✅ Marqueurs interactifs</Badge>
                    <Badge variant="default">✅ Géolocalisation</Badge>
                    <Badge variant="default">✅ Popups détaillés</Badge>
                    <Badge variant="default">✅ Contrôles de carte</Badge>
                  </div>
                  
                  <div className="h-[600px] border-2 border-border rounded-lg overflow-hidden">
                    {isLoading ? (
                      <Skeleton className="w-full h-full" />
                    ) : (
                      <FreeSatelliteMap
                        donations={donations || []}
                        newDonationIds={newDonationIds}
                        initialZoom={12}
                        height="100%"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>EmergencyMap - Chargement Dynamique</CardTitle>
                <CardDescription>
                  Charge Leaflet dynamiquement via CDN avec gestion d'erreur intégrée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">✅ Chargement dynamique</Badge>
                    <Badge variant="default">✅ Gestion d'erreur</Badge>
                    <Badge variant="default">✅ Double couche carte</Badge>
                    <Badge variant="secondary">⚠️ Temps de chargement</Badge>
                  </div>
                  
                  {isLoading ? (
                    <Skeleton className="w-full h-[500px]" />
                  ) : (
                    <EmergencyMap 
                      donations={donations || []} 
                      newDonationIds={newDonationIds}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simple" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SimpleImageMap - Image Statique</CardTitle>
                <CardDescription>
                  Utilise une image de carte statique de Yandex Maps, ultra-léger et rapide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">✅ Ultra-rapide</Badge>
                    <Badge variant="default">✅ Pas de dépendances</Badge>
                    <Badge variant="default">✅ Géolocalisation simple</Badge>
                    <Badge variant="destructive">❌ Pas d'interactivité</Badge>
                    <Badge variant="destructive">❌ Pas de marqueurs</Badge>
                  </div>
                  
                  <SimpleImageMap />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tableau comparatif */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tableau Comparatif</CardTitle>
            <CardDescription>Avantages et inconvénients de chaque solution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Fonctionnalité</th>
                    <th className="text-center py-3 px-4 font-semibold">FreeSatelliteMap</th>
                    <th className="text-center py-3 px-4 font-semibold">EmergencyMap</th>
                    <th className="text-center py-3 px-4 font-semibold">SimpleImageMap</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Vitesse de chargement</td>
                    <td className="text-center py-3 px-4">⚡ Rapide</td>
                    <td className="text-center py-3 px-4">🐌 Lent</td>
                    <td className="text-center py-3 px-4">⚡⚡ Très rapide</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Interactivité</td>
                    <td className="text-center py-3 px-4">✅ Complète</td>
                    <td className="text-center py-3 px-4">✅ Complète</td>
                    <td className="text-center py-3 px-4">❌ Aucune</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Marqueurs personnalisés</td>
                    <td className="text-center py-3 px-4">✅ Oui</td>
                    <td className="text-center py-3 px-4">❌ Non</td>
                    <td className="text-center py-3 px-4">❌ Non</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Types de carte</td>
                    <td className="text-center py-3 px-4">🛰️ 4 types</td>
                    <td className="text-center py-3 px-4">🗺️ 2 types</td>
                    <td className="text-center py-3 px-4">🗺️ 1 type</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Géolocalisation</td>
                    <td className="text-center py-3 px-4">✅ Temps réel</td>
                    <td className="text-center py-3 px-4">✅ Temps réel</td>
                    <td className="text-center py-3 px-4">✅ Simple</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4">Taille du bundle</td>
                    <td className="text-center py-3 px-4">📦 Moyenne</td>
                    <td className="text-center py-3 px-4">📦 Petite*</td>
                    <td className="text-center py-3 px-4">📦 Minuscule</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Recommandation</td>
                    <td className="text-center py-3 px-4">🏆 Production</td>
                    <td className="text-center py-3 px-4">🔧 Dépannage</td>
                    <td className="text-center py-3 px-4">🚀 Prototype</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              * EmergencyMap charge Leaflet dynamiquement, donc le bundle initial est petit mais le temps de chargement total est plus long
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapComparison;
