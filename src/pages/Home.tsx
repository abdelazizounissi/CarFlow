
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useCars } from "@/hooks/useCars";
import {
  CalendarIcon,
  MapPin,
  Star,
  Info,
  CalendarRange,
  Shield,
  ThumbsUp,
  Award
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const { filteredCars, setFilters, resetFilters } = useCars();
  
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  
  // Get unique locations from cars
  const locations = Array.from(new Set(useCars().filteredCars.map(car => car.location)));
  
  const handleSearch = () => {
    const filters: any = {};
    if (location) filters.location = location;
    
    setFilters(filters);
    navigate("/cars");
  };
  
  const getRandomCars = (count: number) => {
    const shuffled = [...filteredCars].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const featuredCars = getRandomCars(3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
            alt="Voiture de luxe" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="container relative z-10 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Explorez la Tunisie avec la Voiture Parfaite</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">Des véhicules fiables à des prix compétitifs.</p>
          <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={() => navigate("/cars")}>
            Parcourir les Voitures
          </Button>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="container py-8 md:py-12">
        <Card className="relative -mt-20 md:-mt-28 shadow-xl border-none">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Trouvez Votre Voiture</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Emplacement</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue placeholder="Sélectionner un emplacement" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc || "unnamed-location"}>
                        {loc || "Emplacement non spécifié"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date de Début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "PPP") : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Date de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={(date) => date < (pickupDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-end">
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600" 
                  onClick={handleSearch}
                  disabled={!location}
                >
                  Rechercher
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Featured Cars */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Voitures en Vedette</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map(car => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={car.images[0]}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{car.make} {car.model}</h3>
                    <p className="text-sm text-muted-foreground">{car.year}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{car.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span>{car.location}</span>
                  </div>
                  <div className="font-medium">{car.price} TND / jour</div>
                </div>
                
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => navigate(`/cars/${car.id}`)}
                >
                  Voir les Détails
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/cars")}
          >
            Voir Toutes les Voitures
          </Button>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pourquoi Choisir CarFlow ?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nous offrons une expérience de location de voiture fluide avec un large choix de véhicules et un service client exceptionnel.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Benefit 1 */}
              <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <CalendarRange className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Locations Flexibles</h3>
                <p className="text-gray-600">
                  Louez une voiture à la journée, à la semaine ou au mois — choisissez la formule qui s’adapte parfaitement à votre emploi du temps.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sécurité Avant Tout</h3>
                <p className="text-gray-600">
                  Chaque véhicule est soumis à une inspection complète avant chaque location pour garantir votre tranquillité d’esprit.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <ThumbsUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Réservation Facile</h3>
                <p className="text-gray-600">
                  Réservez en quelques clics seulement ! Notre système vous offre une confirmation instantanée et une prise en main simplifiée.
                </p>
              </div>
              
              {/* Benefit 4 */}
              <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
                <p className="text-gray-600">
                  Nous travaillons avec des partenaires rigoureusement sélectionnés pour vous proposer des véhicules bien entretenus et fiables.
                </p>
              </div>
            </div>
          </div>
        </section>
      
      {/* Testimonials Section */}
        <section className="py-16 bg-green-500">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Avis de nos clients</h2>
              <p className="text-white max-w-2xl mx-auto">
                Découvrez les témoignages de clients satisfaits qui ont loué leur voiture via notre plateforme.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Ahmed Bejaoui</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill="currentColor" className="w-4 h-4 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "J’ai utilisé CarFlow pour un voyage en famille à Sousse et j’ai été agréablement surpris par la facilité avec laquelle j’ai trouvé la voiture idéale. La réservation s’est faite sans le moindre souci !"
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/women/44.jpg" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Leila Mansour</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill="currentColor" className="w-4 h-4 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Le choix de véhicules est vraiment large. J’avais besoin d’un modèle bien précis pour un déplacement professionnel, et j’ai trouvé exactement ce qu’il me fallait."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                    <img 
                      src="https://randomuser.me/api/portraits/men/76.jpg" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Karim Zouari</h4>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} fill="currentColor" className="w-4 h-4 text-yellow-500" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Service impeccable. La voiture était en excellent état, et la prise en charge a été rapide. Je passerai à nouveau par CarFlow sans hésiter."
                </p>
              </div>
            </div>
            <div className="mt-12 flex justify-center">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white text-green-500 hover:bg-white/90 hover:text-green-600"
                onClick={() => navigate("/cars")}
              >
                Trouvez Votre Voiture Maintenant
              </Button>
            </div>

          </div>
        </section>
      
      
    </Layout>
  );
};

export default Home;
