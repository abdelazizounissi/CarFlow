import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/data/carData";
import { Search, Car as CarIcon, MapPin, Settings, Calendar, Star } from "lucide-react";

const CarsList = () => {
  const navigate = useNavigate();
  const { filteredCars, filters, setFilters, resetFilters } = useCars();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCars, setDisplayedCars] = useState<Car[]>([]);
  const [priceRange, setPriceRange] = useState([0, 700]);
  
  // Get unique values for filters
  const locations = Array.from(new Set(filteredCars.map(car => car.location))).sort();
  const categories = Array.from(new Set(filteredCars.map(car => car.category))).sort();
  const makes = Array.from(new Set(filteredCars.map(car => car.make))).sort();
  const transmissions = Array.from(new Set(filteredCars.map(car => car.transmission))).sort();
  
  // Filter cars based on search term
  useEffect(() => {
    const filtered = filteredCars.filter(car => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.location.toLowerCase().includes(searchLower) ||
        car.category.toLowerCase().includes(searchLower)
      );
    });
    
    setDisplayedCars(filtered);
  }, [filteredCars, searchTerm]);
  
  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    if (value === "all-locations" || value === "all-categories" || 
        value === "all-makes" || value === "all-types") {
      const newFilters = { ...filters };
      delete newFilters[type as keyof typeof filters];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [type]: value });
    }
  };
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    setFilters({ ...filters, price: { min: values[0], max: values[1] } });
  };
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-carflow">Explorer Notre Flotte</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de véhicules de qualité disponibles à la location. Trouvez la voiture parfaite pour vos besoins.
          </p>
        </div>
        
        {/* Search and Filters - Now at the top */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par marque, modèle, emplacement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-base rounded-full shadow-sm"
              />
            </div>
          </div>
          
          {/* Filters */}
          <Card className="shadow-md border-border/40 overflow-hidden">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Location Filter */}
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-carflow" />
                    Emplacement
                  </Label>
                  <Select
                    value={filters.location || "all-locations"}
                    onValueChange={(value) => handleFilterChange("location", value)}
                  >
                    <SelectTrigger className="border-border/60">
                      <SelectValue placeholder="Tous les emplacements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">Tous les emplacements</SelectItem>
                      {locations.map(location => (
                        <SelectItem 
                          key={location} 
                          value={location || "unnamed-location"}
                        >
                          {location || "Emplacement non spécifié"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Category Filter */}
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <CarIcon className="h-4 w-4 text-carflow" />
                    Catégorie
                  </Label>
                  <Select
                    value={filters.category || "all-categories"}
                    onValueChange={(value) => handleFilterChange("category", value)}
                  >
                    <SelectTrigger className="border-border/60">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">Toutes les catégories</SelectItem>
                      {categories.map(category => (
                        <SelectItem 
                          key={category} 
                          value={category || "unnamed-category"}
                        >
                          {category || "Catégorie non spécifiée"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Make Filter */}
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-carflow" />
                    Marque
                  </Label>
                  <Select
                    value={filters.make || "all-makes"}
                    onValueChange={(value) => handleFilterChange("make", value)}
                  >
                    <SelectTrigger className="border-border/60">
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-makes">Toutes les marques</SelectItem>
                      {makes.map(make => (
                        <SelectItem 
                          key={make} 
                          value={make || "unnamed-make"}
                        >
                          {make || "Marque non spécifiée"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Transmission Filter */}
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-carflow" />
                    Transmission
                  </Label>
                  <Select
                    value={filters.transmission || "all-types"}
                    onValueChange={(value) => handleFilterChange("transmission", value)}
                  >
                    <SelectTrigger className="border-border/60">
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-types">Tous les types</SelectItem>
                      {transmissions.map(transmission => (
                        <SelectItem 
                          key={transmission} 
                          value={transmission || "unnamed-transmission"}
                        >
                          {transmission || "Transmission non spécifiée"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Reset Filters Button */}
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters} 
                    className="w-full border-carflow text-carflow hover:bg-carflow/10"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mt-6">
                <Label className="mb-3 flex items-center gap-2">
                  <span>Prix par jour: {priceRange[0]} - {priceRange[1]} TND</span>
                </Label>
                <Slider
                  defaultValue={[0, 700]}
                  max={700}
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="my-4"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              {displayedCars.length} {displayedCars.length === 1 ? "voiture trouvée" : "voitures trouvées"}
            </div>
            <div className="text-sm font-medium">
              Trier par: <span className="text-carflow">Prix - Bas vers Haut</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedCars.map((car) => (
              <Card 
                key={car.id} 
                className="group overflow-hidden cursor-pointer border-border/50 hover:shadow-lg transition-all duration-300 hover:border-carflow/30" 
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted/50 relative">
                  {car.images && car.images.length > 0 ? (
                    <img 
                      src={car.images[0]} 
                      alt={`${car.make} ${car.model}`}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Pas d'image disponible
                    </div>
                  )}
                  
                  <Badge 
                    variant={car.available ? "default" : "destructive"} 
                    className={`absolute top-3 right-3 ${car.available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {car.available ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold group-hover:text-carflow transition-colors">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-muted-foreground text-sm">{car.year} • {car.transmission}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-carflow" />
                        {car.location}
                      </span>
                      <span className="text-sm flex items-center gap-1">
                        <CarIcon className="h-4 w-4 text-carflow" />
                        {car.category}
                      </span>
                    </div>
                    
                    {car.rating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(car.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : i < car.rating
                                  ? "text-yellow-400 fill-yellow-400/50"
                                  : "text-gray-300"
                              }`}
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {car.rating.toFixed(1)} ({car.reviews.length} avis)
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">Tarif journalier</span>
                      <span className="font-medium text-lg text-carflow">{car.price} TND</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {displayedCars.length === 0 && (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Search className="h-12 w-12 text-muted-foreground opacity-60" />
                <h2 className="text-xl font-semibold">Aucune voiture trouvée</h2>
                <p className="text-muted-foreground max-w-md">
                  Essayez d'ajuster vos filtres ou termes de recherche pour voir plus de résultats
                </p>
                <Button 
                  onClick={resetFilters}
                  className="mt-4 bg-carflow hover:bg-carflow-dark"
                >
                  Réinitialiser tous les filtres
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CarsList;
