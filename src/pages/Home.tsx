import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-sharing.jpg";
import logo from "@/assets/logo-return-dons.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Mobile optimized */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-5 sm:space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={logo} 
                  alt="return.dons logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 animate-scale-in"
                />
                <div className="text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary">
                    return.dons
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    Donnez, Partagez, Agissez
                  </p>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
                Transformez vos objets en{" "}
                <span className="text-primary">solidarité</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Découvrez des dons près de chez vous. Donnez une seconde vie à vos objets. 
                Rejoignez une communauté engagée pour un monde plus durable.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild size="lg" className="shadow-primary h-12 text-base">
                  <Link to="/app">
                    <MapPin className="mr-2 h-5 w-5" />
                    Explorer la carte
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 text-base">
                  <Link to="/app">
                    <Heart className="mr-2 h-5 w-5" />
                    Publier un don
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in order-first md:order-last">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl sm:rounded-3xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Communauté de partage" 
                className="relative rounded-2xl sm:rounded-3xl shadow-medium w-full"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Une plateforme simple et intuitive pour donner et recevoir
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-background p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-soft hover:shadow-medium transition-smooth"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1 sm:space-y-2">
                <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-primary-foreground/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-secondary/10 via-background to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
              Rejoignez le mouvement
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Des milliers de personnes partagent déjà leurs objets et font vivre l'économie circulaire
            </p>
            <Button asChild size="lg" className="shadow-primary h-12 text-base">
              <Link to="/app">
                Commencer maintenant
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: MapPin,
    title: "Trouvez près de chez vous",
    description: "Découvrez des dons géolocalisés dans votre quartier. La solidarité commence à votre porte."
  },
  {
    icon: Heart,
    title: "Donnez en quelques clics",
    description: "Publiez vos dons en quelques secondes. Choisissez l'anonymat ou partagez votre identité."
  },
  {
    icon: Users,
    title: "Communauté bienveillante",
    description: "Échangez en toute sécurité avec des personnes engagées. Construisez votre réputation."
  }
];

const stats = [
  { value: "10K+", label: "Dons partagés" },
  { value: "5K+", label: "Membres actifs" },
  { value: "50T", label: "CO2 économisé" },
  { value: "95%", label: "Satisfaction" }
];

export default Home;
