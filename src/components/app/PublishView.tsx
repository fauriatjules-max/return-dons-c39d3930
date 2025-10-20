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
    <div className="h-full overflow-y-auto bg-background overscroll-contain -webkit-overflow-scrolling-touch">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 pb-8">
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">Publier un don</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Partagez un objet avec votre communauté
          </p>
        </div>

        <form className="space-y-6 sm:space-y-8">
          {/* What */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base sm:text-lg font-heading">
                Que donnez-vous ?
              </Label>
              <Input 
                id="title"
                placeholder="Ex: Canapé 3 places"
                className="text-base h-11 sm:h-10"
                inputMode="text"
              />
            </div>

            {/* Photos - Touch optimized */}
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:border-primary/50 active:border-primary hover:bg-primary/5 active:scale-[0.98]"
            >
              <Camera className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-muted-foreground transition-transform duration-300 hover:scale-110" />
              <p className="text-sm font-medium mb-1">+ Ajouter photos</p>
              <p className="text-xs text-muted-foreground">Jusqu'à 5 photos</p>
            </button>
          </div>

          {/* Category - Mobile optimized grid */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-base sm:text-lg font-heading">Catégorie</Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 touch-manipulation min-h-[80px] sm:min-h-0 hover:scale-105 active:scale-95 ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-border active:border-primary/50"
                  }`}
                >
                  <div className={`text-2xl sm:text-3xl mb-1 sm:mb-2 transition-transform duration-300 ${selectedCategory === cat.id ? 'scale-110' : ''}`}>{cat.icon}</div>
                  <div className="text-xs sm:text-sm font-medium leading-tight">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location - Mobile optimized */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-base sm:text-lg font-heading">Où ?</Label>
            <RadioGroup value={locationType} onValueChange={setLocationType}>
              <div className="space-y-2 sm:space-y-3">
                <div className={`flex items-start space-x-2.5 sm:space-x-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 touch-manipulation cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  locationType === "anonymous" ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/30"
                }`}>
                  <RadioGroupItem value="anonymous" id="anonymous" className="mt-0.5 sm:mt-1 shrink-0" />
                  <div className="flex-1 space-y-1 min-w-0">
                    <Label htmlFor="anonymous" className="font-medium cursor-pointer text-sm sm:text-base">
                      Placement anonyme (recommandé)
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Déposez l'objet dans un lieu public. L'emplacement sera révélé à qui réservera.
                    </p>
                  </div>
                </div>

                <div className={`flex items-start space-x-2.5 sm:space-x-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 touch-manipulation cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  locationType === "home" ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/30"
                }`}>
                  <RadioGroupItem value="home" id="home" className="mt-0.5 sm:mt-1 shrink-0" />
                  <div className="flex-1 space-y-1 min-w-0">
                    <Label htmlFor="home" className="font-medium cursor-pointer text-sm sm:text-base">
                      Chez moi
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Seule la rue sera visible publiquement.
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {locationType === "anonymous" && (
              <button
                type="button"
                className="w-full bg-muted/50 rounded-xl p-5 sm:p-6 flex items-center justify-center gap-2.5 sm:gap-3 text-muted-foreground transition-all duration-300 hover:bg-muted/70 active:bg-muted hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
              >
                <MapPin className="h-5 w-5 shrink-0 transition-transform duration-300" />
                <span className="text-sm">Placer sur la carte</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="description" className="text-base sm:text-lg font-heading">
              Description
            </Label>
            <Textarea 
              id="description"
              placeholder="Décrivez votre don..."
              className="min-h-[100px] sm:min-h-[120px] text-base resize-none"
            />
          </div>

          {/* Submit - Fixed on mobile */}
          <div className="sticky bottom-0 -mx-4 sm:mx-0 -mb-8 sm:mb-0 p-4 sm:p-0 bg-background sm:bg-transparent border-t sm:border-0 border-border">
            <Button 
              type="button"
              onClick={handlePublish}
              size="lg" 
              className="w-full shadow-primary h-12 sm:h-11 text-base transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              Publier mon don
            </Button>
          </div>
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
