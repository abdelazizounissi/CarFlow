import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

import {
  GaugeCircle,
  Car,
  Fuel,
  Users,
  Star,
  Check,
  Calendar as CalendarIcon,
  MapPin,
  Briefcase,
  CircleDollarSign,
  TruckIcon,
  PencilIcon,
  TrashIcon,
  Building2Icon,
  PhoneIcon,
  MailIcon,
  Battery,
} from "lucide-react";

import { useCars, DeliveryOption, ExtraOption } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

const deliveryOptions = [
  { id: 'self', label: 'Sur place', price: 0, description: 'Récupérer et rendre le véhicule à l\'agence' },
  { id: 'delivery', label: 'Livraison', price: 30, description: 'Le véhicule vous sera livré à l\'adresse indiquée' },
  { id: 'pickup', label: 'Ramassage', price: 30, description: 'Nous viendrons chercher le véhicule à l\'adresse indiquée' },
  { id: 'both', label: 'Livraison et Ramassage', price: 60, description: 'Service complet de livraison et ramassage du véhicule' }
];

const CarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getCarDetails, getAgencyDetails, isCarAvailable, addReview, makeReservation, updateCar, deleteCar } = useCars();
  const { user, userType } = useAuth();
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([
    { id: 'gps', name: 'GPS', price: 10, selected: false },
    { id: 'child-seat', name: 'Siège enfant', price: 15, selected: false },
    { id: 'additional-driver', name: 'Conducteur supplémentaire', price: 20, selected: false },
    { id: 'wifi', name: 'WiFi portable', price: 8, selected: false },
    { id: 'insurance', name: 'Assurance premium', price: 25, selected: false },
    { id: 'roadside', name: 'Assistance routière', price: 12, selected: false }
  ]);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: 0,
    price: 0,
    category: "",
    transmission: "",
    seats: 0,
    fuelType: "",
    description: "",
    available: true,
    location: "",
  });
  
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("self");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  const car = id ? getCarDetails(id) : undefined;
  const agency = car ? getAgencyDetails(car.agencyId) : undefined;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (car) {
      setFormData({
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        category: car.category,
        transmission: car.transmission,
        seats: car.seats,
        fuelType: car.fuelType,
        description: car.description,
        available: car.available,
        location: car.location,
      });
    }
  }, [car]);
  
  if (!car) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Voiture non trouvée</h3>
                <p className="text-muted-foreground mb-6">
                  Nous n'avons pas trouvé la voiture que vous recherchez
                </p>
                <Button onClick={() => navigate("/cars")} className="bg-green-500 hover:bg-green-600">
                  Voir toutes les voitures
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const disabledDates = { before: today };
  
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setEndDate(undefined);
    }
  };
  
  const handleReserve = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Dates requises",
        description: "Veuillez sélectionner les dates de début et de fin",
        variant: "destructive"
      });
      return;
    }
    
    let deliveryInfo = null;
    
    if (deliveryOption !== "self") {
      if (!deliveryAddress.trim()) {
        toast({
          title: "Adresse requise",
          description: "Veuillez fournir une adresse pour la livraison ou le ramassage",
          variant: "destructive"
        });
        return;
      }
      
      deliveryInfo = {
        type: deliveryOption,
        address: deliveryAddress
      };
    }
    
    const reservationId = makeReservation(
      car.id, 
      startDate, 
      endDate, 
      paymentMethod, 
      selectedExtras,
      deliveryInfo
    );
    
    if (reservationId) {
      setReserveDialogOpen(false);
      navigate("/reservations");
    }
  };
  
  const handleAddReview = () => {
    if (addReview(car.id, reviewRating, reviewComment)) {
      setReviewDialogOpen(false);
      setReviewRating(5);
      setReviewComment("");
    }
  };
  
  const handleExtraChange = (id: string, checked: boolean) => {
    setSelectedExtras(prev => 
      prev.map(extra => 
        extra.id === id ? { ...extra, selected: checked } : extra
      )
    );
  };
  
  const handleUpdateCar = () => {
    if (updateCar(car.id, {
      make: formData.make,
      model: formData.model,
      year: formData.year,
      price: formData.price,
      category: formData.category,
      transmission: formData.transmission as "Automatique" | "Manuelle",
      fuelType: formData.fuelType,
      seats: formData.seats,
      description: formData.description,
      available: formData.available,
      location: formData.location
    })) {
      setEditDialogOpen(false);
      toast({
        title: "Voiture mise à jour",
        description: "Les informations ont été mises à jour avec succès",
      });
    }
  };
  
  const handleDeleteCar = () => {
    if (deleteCar(car.id)) {
      setDeleteDialogOpen(false);
      navigate("/agency/cars");
    }
  };
  
  const getDaysCount = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const calculateTotal = () => {
    const days = getDaysCount();
    if (days === 0) return 0;
    
    const basePrice = car.price * days;
    const extrasTotal = selectedExtras
      .filter(extra => extra.selected)
      .reduce((sum, extra) => sum + extra.price, 0) * days;
    
    const deliveryFee = deliveryOption !== "self" ? 30 : 0;
    
    return basePrice + extrasTotal + deliveryFee;
  };
  
  const isCarManager = user && userType === "agency" && user.id === car.agencyId;
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="lg:w-2/3">
            <div className="flex flex-col gap-1 mb-6">
              <h1 className="text-3xl font-bold">
                {car.make} {car.model} {car.year}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>{car.location}</span>
                <span className="mx-1">•</span>
                <Star size={16} className="text-yellow-500" />
                <span>{car.rating.toFixed(1)}</span>
                <span>({car.reviews.length} avis)</span>
              </div>
            </div>
            
            {isCarManager && (
              <div className="mb-6 flex gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-1">
                  <h3 className="font-medium text-green-800">Gestion de votre voiture</h3>
                  <p className="text-sm text-green-600">Vous pouvez modifier ou supprimer cette voiture</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1" 
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <PencilIcon size={14} />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <TrashIcon size={14} />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {car.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
            
            <Tabs defaultValue="details" className="mb-8">
              <TabsList className="mb-2">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
                <TabsTrigger value="reviews">Avis ({car.reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {car.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Ce qui est inclus</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    <li className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>Kilométrage illimité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>Assurance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>Assistance routière</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span>Annulation gratuite</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="specs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      <Car size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Catégorie</p>
                      <p className="text-sm text-muted-foreground capitalize">{car.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      <GaugeCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Transmission</p>
                      <p className="text-sm text-muted-foreground capitalize">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Places</p>
                      <p className="text-sm text-muted-foreground">{car.seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      <Battery size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Carburant</p>
                      <p className="text-sm text-muted-foreground">{car.fuelType}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="space-y-4">
                  {user && userType === 'client' && (
                    <Button
                      onClick={() => setReviewDialogOpen(true)}
                      className="mb-4 bg-green-500 hover:bg-green-600"
                    >
                      Ajouter un avis
                    </Button>
                  )}
                  
                  {car.reviews.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        Aucun avis pour le moment. Soyez le premier à donner votre avis!
                      </p>
                    </div>
                  ) : (
                    car.reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="font-medium">{review.userName}</span>
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-500" />
                            <span className="ml-1">{review.rating}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-1/3 space-y-6">
            {agency && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Information sur l'agence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-md bg-blue-50">
                      <Building2Icon className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-medium">{agency.name}</p>
                      <p className="text-sm text-muted-foreground">{agency.address}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon size={14} className="text-muted-foreground" />
                      <span>{agency.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MailIcon size={14} className="text-muted-foreground" />
                      <span>{agency.email}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Évaluation</p>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-500" />
                        <span className="ml-1">{agency.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate(`/cars?agency=${agency.id}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      Voir toutes les voitures
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  <span>{car.price} TND <span className="text-sm font-normal">/jour</span></span>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Disponible" : "Non disponible"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startDate">Date de début</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 items-center text-sm mt-1 cursor-pointer"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? (
                            startDate.toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">Sélectionnez</span>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="p-0">
                        <Calendar
                          id="startCalendar"
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            handleStartDateSelect(date);
                          }}
                          disabled={disabledDates}
                        />
                        <DialogClose className="hidden" id="start-dialog-close" />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <Label htmlFor="endDate">Date de retour</Label>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 items-center text-sm mt-1 cursor-pointer"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? (
                            endDate.toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">Sélectionnez</span>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="p-0">
                        <Calendar
                          id="endCalendar"
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                          }}
                          disabled={{
                            ...disabledDates,
                            before: startDate || today,
                          }}
                        />
                        <DialogClose className="hidden" id="end-dialog-close" />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                {startDate && endDate && (
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between text-sm">
                      <span>Prix pour {getDaysCount()} jours:</span>
                      <span>{car.price * getDaysCount()} TND</span>
                    </div>
                  </div>
                )}
                
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  disabled={!car.available || !user || userType === "agency"}
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                    } else if (startDate && endDate && isCarAvailable(car.id, startDate, endDate)) {
                      setReserveDialogOpen(true);
                    } else {
                      toast({
                        title: "Sélectionnez les dates",
                        description: "Veuillez sélectionner les dates de début et de fin",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  {!user ? "Connectez-vous pour réserver" : 
                   userType === "agency" ? "Les agences ne peuvent pas réserver" : 
                   "Réserver maintenant"}
                </Button>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground text-center w-full">
                  Aucun frais de réservation • Annulation gratuite jusqu'à 48h avant
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donner un avis</DialogTitle>
            <DialogDescription>
              Partagez votre expérience avec cette voiture
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Note</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={cn(
                      "p-1 rounded-md",
                      reviewRating >= star ? "text-yellow-500" : "text-muted"
                    )}
                  >
                    <Star size={24} fill={reviewRating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire</Label>
              <Textarea
                id="comment"
                placeholder="Partagez votre expérience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600" 
              onClick={handleAddReview}
            >
              Soumettre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={reserveDialogOpen} onOpenChange={setReserveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finaliser la réservation</DialogTitle>
            <DialogDescription>
              Complétez les détails de votre réservation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">{car.make} {car.model}</span>
                <span className="text-sm text-muted-foreground">{car.location}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{car.price} TND/jour</div>
                <div className="text-sm text-muted-foreground">{getDaysCount()} jours</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label>Dates de réservation</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="p-2 rounded-md bg-muted flex-1 text-center">
                    {startDate?.toLocaleDateString()}
                  </div>
                  <span>→</span>
                  <div className="p-2 rounded-md bg-muted flex-1 text-center">
                    {endDate?.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Options de livraison</Label>
                <RadioGroup value={deliveryOption} onValueChange={(value) => setDeliveryOption(value as DeliveryOption)}>
                  <div className="grid gap-4">
                    {deliveryOptions.map((option) => (
                      <Label
                        key={option.id}
                        className={cn(
                          "flex flex-col space-y-1 rounded-md border p-4 cursor-pointer",
                          deliveryOption === option.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-500"
                        )}
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{option.label}</span>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                          <span className="font-medium">
                            {option.price > 0 ? `+${option.price} TND` : 'Gratuit'}
                          </span>
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Options supplémentaires</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedExtras.map((extra) => (
                    <div 
                      key={extra.id} 
                      className={cn(
                        "border rounded-md p-2 cursor-pointer",
                        extra.selected ? "border-green-500 bg-green-50" : "border-gray-200"
                      )}
                      onClick={() => handleExtraChange(extra.id, !extra.selected)}
                    >
                      <div className="flex justify-between items-start">
                        <span>{extra.name}</span>
                        <Check 
                          size={16} 
                          className={cn(
                            "transition-opacity",
                            extra.selected ? "opacity-100 text-green-500" : "opacity-0"
                          )}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {extra.price} TND/jour
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Mode de paiement</Label>
                <RadioGroup 
                  className="grid grid-cols-2 gap-2 mt-2"
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "card" | "cash")}
                >
                  <div className={cn(
                    "flex items-center space-x-2 border rounded-md p-2",
                    paymentMethod === "card" ? "border-green-500 bg-green-50" : "border-gray-200"
                  )}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign size={16} />
                        <span>Carte bancaire</span>
                      </div>
                    </Label>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-2 border rounded-md p-2",
                    paymentMethod === "cash" ? "border-green-500 bg-green-50" : "border-gray-200"
                  )}>
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span>Espèces</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-bold">{calculateTotal()} TND</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Inclut: location ({car.price} TND/jour), options supplémentaires et frais de livraison si applicable
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReserveDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={handleReserve}
            >
              Confirmer la réservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier les détails de la voiture</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de votre voiture
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Marque</Label>
                <Input 
                  id="make" 
                  value={formData.make} 
                  onChange={(e) => setFormData({...formData, make: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Input 
                  id="model" 
                  value={formData.model} 
                  onChange={(e) => setFormData({...formData, model: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <Input 
                  id="year" 
                  type="number" 
                  value={formData.year} 
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix / jour (TND)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Économique</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="midsize">Intermédiaire</SelectItem>
                    <SelectItem value="luxury">Luxe</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select 
                  value={formData.transmission} 
                  onValueChange={(value) => setFormData({...formData, transmission: value})}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatique</SelectItem>
                    <SelectItem value="manual">Manuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seats">Places</Label>
                <Input 
                  id="seats" 
                  type="number" 
                  value={formData.seats} 
                  onChange={(e) => setFormData({...formData, seats: Number(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Carburant</Label>
                <Select 
                  value={formData.fuelType} 
                  onValueChange={(value) => setFormData({...formData, fuelType: value})}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Essence</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybride</SelectItem>
                    <SelectItem value="electric">Électrique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({...formData, available: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="available">Disponible à la location</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={handleUpdateCar}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette voiture ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette voiture sera définitivement supprimée de votre inventaire.
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
    </Layout>
  );
};

export default CarDetail;
