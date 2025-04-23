import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash, Car } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Car as CarType } from "@/data/carData";

const AgencyCars = () => {
  const navigate = useNavigate();
  const { getAgencyCars, addCar, updateCar, deleteCar } = useCars();
  const { user, userType } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    category: "Économique",
    transmission: "Automatique" as "Automatique" | "Manuelle",
    fuelType: "Essence",
    seats: 5,
    images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    description: "",
    features: ["Climatisation", "Bluetooth", "Entrée USB"],
    available: true,
    location: "",
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user || userType !== "agency") {
      navigate("/login");
    }
  }, [user, userType, navigate]);
  
  const resetFormData = () => {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      category: "Économique",
      transmission: "Automatique",
      fuelType: "Essence",
      seats: 5,
      images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
      description: "",
      features: ["Climatisation", "Bluetooth", "Entrée USB"],
      available: true,
      location: "",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      available: checked,
    });
  };
  
  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const features = e.target.value.split('\n').filter(feature => feature.trim() !== '');
    setFormData({
      ...formData,
      features,
    });
  };
  
  const openEditDialog = (car: CarType) => {
    setSelectedCarId(car.id);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      category: car.category,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seats: car.seats,
      images: car.images,
      description: car.description,
      features: car.features,
      available: car.available,
      location: car.location,
    });
    setEditDialogOpen(true);
  };
  
  const handleAddCar = () => {
    if (addCar(formData)) {
      setAddDialogOpen(false);
      resetFormData();
    }
  };
  
  const handleUpdateCar = () => {
    if (selectedCarId) {
      if (updateCar(selectedCarId, formData)) {
        setEditDialogOpen(false);
      }
    }
  };
  
  const handleDeleteCar = () => {
    if (selectedCarId) {
      if (deleteCar(selectedCarId)) {
        setDeleteDialogOpen(false);
        setSelectedCarId(null);
      }
    }
  };
  
  if (!user || userType !== "agency") {
    return (
      <Layout>
        <div className="container py-8">
          <Card className="p-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-semibold mb-2">Accès non autorisé</h3>
              <p className="text-muted-foreground mb-6">
                Vous devez être connecté en tant qu'agence pour accéder à cette page
              </p>
              <Button 
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const cars = getAgencyCars();
  
  const filteredCars = cars.filter(car => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      car.make.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.category.toLowerCase().includes(searchLower) ||
      car.location.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gérer mes voitures</h1>
            <p className="text-muted-foreground">
              Ajouter, modifier et gérer vos annonces de voitures
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Rechercher des voitures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                resetFormData();
                setAddDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une voiture
            </Button>
          </div>
        </div>
        
        {filteredCars.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voiture</TableHead>
                    <TableHead>Prix / Jour</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Emplacement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map(car => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          {car.images[0] && (
                            <div className="h-10 w-14 rounded overflow-hidden">
                              <img 
                                src={car.images[0]} 
                                alt={`${car.make} ${car.model}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div>{car.make} {car.model}</div>
                            <div className="text-xs text-muted-foreground">{car.year}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{car.price} TND</TableCell>
                      <TableCell>{car.category}</TableCell>
                      <TableCell>{car.location}</TableCell>
                      <TableCell>
                        <Badge variant={car.available ? "default" : "secondary"}>
                          {car.available ? "Disponible" : "Indisponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {car.rating > 0 ? (
                            <>
                              <span className="mr-1">{car.rating.toFixed(1)}</span>
                              <span className="text-muted-foreground text-xs">({car.reviews.length})</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs">Pas d'avis</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(car)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => {
                            setSelectedCarId(car.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune voiture trouvée</h3>
              <p className="text-muted-foreground mb-6">
                {cars.length === 0
                  ? "Vous n'avez pas encore ajouté de voitures"
                  : "Aucune voiture ne correspond à vos critères de recherche"}
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  resetFormData();
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter votre première voiture
              </Button>
            </CardContent>
          </Card>
        )}
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle voiture</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle voiture à votre inventaire de location
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="make">Marque</Label>
                <Input
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={(e) => setFormData({...formData, make: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Prix par jour (TND)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Économique">Économique</SelectItem>
                    <SelectItem value="Compact">Compact</SelectItem>
                    <SelectItem value="Berline">Berline</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Familial">Familial</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Luxe">Luxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value: "Automatique" | "Manuelle") => setFormData({...formData, transmission: value})}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Sélectionner une transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatique">Automatique</SelectItem>
                    <SelectItem value="Manuelle">Manuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Type de carburant</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => setFormData({...formData, fuelType: value})}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Sélectionner un type de carburant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Essence">Essence</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybride">Hybride</SelectItem>
                    <SelectItem value="Électrique">Électrique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seats">Nombre de places</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Emplacement</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({...formData, location: value})}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Sélectionner un emplacement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tunis">Tunis</SelectItem>
                    <SelectItem value="Sousse">Sousse</SelectItem>
                    <SelectItem value="Sfax">Sfax</SelectItem>
                    <SelectItem value="Gabès">Gabès</SelectItem>
                    <SelectItem value="Bizerte">Bizerte</SelectItem>
                    <SelectItem value="Kairouan">Kairouan</SelectItem>
                    <SelectItem value="Hammamet">Hammamet</SelectItem>
                    <SelectItem value="Nabeul">Nabeul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de l'image</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="Entrez l'URL de l'image"
                  value={formData.images[0] || ""}
                  onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                />
                <Label htmlFor="available">Disponible à la location</Label>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="features">Équipements (un par ligne)</Label>
                <Textarea
                  id="features"
                  value={formData.features.join('\n')}
                  onChange={(e) => setFormData({...formData, features: e.target.value.split('\n').filter(f => f.trim() !== '')})}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white" 
                onClick={handleAddCar}
              >
                Ajouter la voiture
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la voiture</DialogTitle>
              <DialogDescription>
                Mettez à jour les informations de votre voiture
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-make">Marque</Label>
                <Input
                  id="edit-make"
                  name="make"
                  value={formData.make}
                  onChange={(e) => setFormData({...formData, make: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-model">Modèle</Label>
                <Input
                  id="edit-model"
                  name="model"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-year">Année</Label>
                <Input
                  id="edit-year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-price">Prix par jour (TND)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Économique">Économique</SelectItem>
                    <SelectItem value="Compact">Compact</SelectItem>
                    <SelectItem value="Berline">Berline</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Familial">Familial</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Luxe">Luxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value: "Automatique" | "Manuelle") => setFormData({...formData, transmission: value})}
                >
                  <SelectTrigger id="edit-transmission">
                    <SelectValue placeholder="Sélectionner une transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatique">Automatique</SelectItem>
                    <SelectItem value="Manuelle">Manuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-fuelType">Type de carburant</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => setFormData({...formData, fuelType: value})}
                >
                  <SelectTrigger id="edit-fuelType">
                    <SelectValue placeholder="Sélectionner un type de carburant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Essence">Essence</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybride">Hybride</SelectItem>
                    <SelectItem value="Électrique">Électrique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-seats">Nombre de places</Label>
                <Input
                  id="edit-seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-location">Emplacement</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({...formData, location: value})}
                >
                  <SelectTrigger id="edit-location">
                    <SelectValue placeholder="Sélectionner un emplacement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tunis">Tunis</SelectItem>
                    <SelectItem value="Sousse">Sousse</SelectItem>
                    <SelectItem value="Sfax">Sfax</SelectItem>
                    <SelectItem value="Gabès">Gabès</SelectItem>
                    <SelectItem value="Bizerte">Bizerte</SelectItem>
                    <SelectItem value="Kairouan">Kairouan</SelectItem>
                    <SelectItem value="Hammamet">Hammamet</SelectItem>
                    <SelectItem value="Nabeul">Nabeul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">URL de l'image</Label>
                <Input
                  id="edit-imageUrl"
                  name="imageUrl"
                  placeholder="Entrez l'URL de l'image"
                  value={formData.images[0] || ""}
                  onChange={(e) => setFormData({...formData, images: [e.target.value]})}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({...formData, available: checked})}
                />
                <Label htmlFor="edit-available">Disponible à la location</Label>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-features">Équipements (un par ligne)</Label>
                <Textarea
                  id="edit-features"
                  value={formData.features.join('\n')}
                  onChange={(e) => setFormData({...formData, features: e.target.value.split('\n').filter(f => f.trim() !== '')})}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={handleUpdateCar}
              >
                Enregistrer les modifications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer la voiture</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette voiture ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDeleteCar}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default AgencyCars;
