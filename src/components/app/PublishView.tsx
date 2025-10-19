import { useState } from "react";
import { Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const PublishView = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationType, setLocationType] = useState("anonymous");

  const handlePublish = () => {
    toast.success("Don publié avec succès !", {
      description: "Votre don est maintenant visible par la communauté"
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold">Publier un don</h1>
          <p className="text-muted-foreground">
            Partagez un objet avec votre communauté
          </p>
        </div>

        <form className="space-y-8">
          {/* What */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-heading">
                Que donnez-vous ?
              </Label>
              <Input 
                id="title"
                placeholder="Ex: Canapé 3 places en bon état"
                className="text-base"
              />
            </div>

            {/* Photos */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-smooth cursor-pointer">
              <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">+ Ajouter jusqu'à 5 photos</p>
              <p className="text-xs text-muted-foreground">Cliquez pour ouvrir l'appareil photo ou la galerie</p>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-4">
            <Label className="text-lg font-heading">Catégorie</Label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-smooth ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label className="text-lg font-heading">Où ?</Label>
            <RadioGroup value={locationType} onValueChange={setLocationType}>
              <div className="space-y-3">
                <div className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-smooth ${
                  locationType === "anonymous" ? "border-primary bg-primary/5" : "border-border"
                }`}>
                  <RadioGroupItem value="anonymous" id="anonymous" className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="anonymous" className="font-medium cursor-pointer">
                      Placement anonyme (recommandé)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Déposez l'objet dans un lieu public. L'emplacement exact sera révélé à la personne qui réservera.
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-smooth ${
                  locationType === "home" ? "border-primary bg-primary/5" : "border-border"
                }`}>
                  <RadioGroupItem value="home" id="home" className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="home" className="font-medium cursor-pointer">
                      Chez moi
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Votre adresse sera masquée. Seule la rue sera visible.
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {locationType === "anonymous" && (
              <div className="bg-muted/50 rounded-xl p-6 flex items-center justify-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">Cliquez pour placer sur la carte</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <Label htmlFor="description" className="text-lg font-heading">
              Description
            </Label>
            <Textarea 
              id="description"
              placeholder="Décrivez votre don en détail..."
              className="min-h-[120px]"
            />
          </div>

          {/* Submit */}
          <Button 
            type="button"
            onClick={handlePublish}
            size="lg" 
            className="w-full shadow-primary"
          >
            Publier mon don
          </Button>
        </form>
      </div>
    </div>
  );
};

const categories = [
  { id: "food", label: "Nourriture", icon: "🍕" },
  { id: "objects", label: "Objets", icon: "📦" },
  { id: "clothes", label: "Vêtements", icon: "👕" },
  { id: "electronics", label: "Électronique", icon: "💻" },
  { id: "furniture", label: "Meubles", icon: "🛋️" },
  { id: "other", label: "Autre", icon: "✨" },
];

export default PublishView;
