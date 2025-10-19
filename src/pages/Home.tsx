import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-sharing.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Donnez, Partagez, Agissez</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight">
                Transformez vos objets en{" "}
                <span className="text-primary">solidarité</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Découvrez des dons près de chez vous. Donnez une seconde vie à vos objets. 
                Rejoignez une communauté engagée pour un monde plus durable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="shadow-primary">
                  <Link to="/app">
                    <MapPin className="mr-2 h-5 w-5" />
                    Explorer la carte
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/app">
                    <Heart className="mr-2 h-5 w-5" />
                    Publier un don
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Communauté de partage" 
                className="relative rounded-3xl shadow-medium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Une plateforme simple et intuitive pour donner et recevoir
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-background p-8 rounded-2xl shadow-soft hover:shadow-medium transition-smooth"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-5xl font-heading font-bold">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/10 via-background to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold">
              Rejoignez le mouvement
            </h2>
            <p className="text-lg text-muted-foreground">
              Des milliers de personnes partagent déjà leurs objets et font vivre l'économie circulaire
            </p>
            <Button asChild size="lg" className="shadow-primary">
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
