
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon, TruckIcon } from "lucide-react";
import { useCars, ExtraOption, DeliveryOption } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Reservations = () => {
  const navigate = useNavigate();
  const { 
    getUserReservations, 
    cancelReservation, 
    modifyReservation,
    getCarDetails,
    extraOptions,
    isCarAvailable
  } = useCars();
  const { user } = useAuth();
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("self");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  // Scroll to top when navigate is called
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Navigate to login if no user
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Initialize reservations (safe even if user isn't logged in - it will return empty array)
  const reservations = user ? getUserReservations() : [];
  
  const handleCancelReservation = () => {
    if (selectedReservation) {
      cancelReservation(selectedReservation);
      setCancelDialogOpen(false);
      setSelectedReservation(null);
    }
  };
  
  const handleModifyReservation = () => {
    if (selectedReservation && startDate && endDate) {
      // Include delivery information with the reservation update
      const deliveryInfo = 
        deliveryOption === "self" ? null : 
        { 
          type: deliveryOption, 
          address: deliveryAddress || user?.address || "" 
        };
      
      modifyReservation(
        selectedReservation, 
        startDate, 
        endDate, 
        selectedExtras, 
        deliveryInfo
      );
      
      setModifyDialogOpen(false);
      setSelectedReservation(null);
      setStartDate(undefined);
      setEndDate(undefined);
      setDeliveryOption("self");
      setDeliveryAddress("");
    }
  };
  
  const openModifyDialog = (
    reservationId: string, 
    currentStart: Date, 
    currentEnd: Date, 
    currentExtras: ExtraOption[],
    currentDelivery?: { type: DeliveryOption; address: string } | null
  ) => {
    setSelectedReservation(reservationId);
    setStartDate(currentStart);
    setEndDate(currentEnd);
    setSelectedExtras(currentExtras.map(extra => ({...extra})));
    
    // Set delivery options if they exist
    if (currentDelivery) {
      setDeliveryOption(currentDelivery.type);
      setDeliveryAddress(currentDelivery.address);
    } else {
      setDeliveryOption("self");
      setDeliveryAddress("");
    }
    
    setModifyDialogOpen(true);
  };
  
  const toggleExtra = (extraId: string) => {
    setSelectedExtras(extras => 
      extras.map(extra => 
        extra.id === extraId
          ? { ...extra, selected: !extra.selected }
          : extra
      )
    );
  };
  
  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !selectedReservation) return 0;
    
    const reservation = reservations.find(res => res.id === selectedReservation);
    if (!reservation) return 0;
    
    const car = getCarDetails(reservation.carId);
    if (!car) return 0;
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const carCost = car.price * days;
    
    const extrasCost = selectedExtras
      .filter(extra => extra.selected)
      .reduce((sum, extra) => sum + extra.price * days, 0);
    
    // Add delivery fee if applicable
    const deliveryFee = deliveryOption !== "self" ? 30 : 0;
    
    return carCost + extrasCost + deliveryFee;
  };

  // Render login redirect if not authenticated
  if (!user) {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Accès refusé</h3>
                <p className="text-muted-foreground mb-6">
                  Vous devez être connecté pour accéder à vos réservations.
                </p>
                <Button onClick={() => navigate("/login")}>
                  Connectez-vous
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Mes Réservations</h1>
        <p className="text-muted-foreground mb-8">
          Gérez vos réservations de voitures
        </p>
        
        {reservations.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Réservations</CardTitle>
              <CardDescription>
                Toutes vos réservations de voitures en un seul endroit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voiture</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Livraison</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map(reservation => {
                    const car = getCarDetails(reservation.carId);
                    if (!car) return null;
                    
                    return (
                      <TableRow key={reservation.id}>
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
                              <div className="text-xs text-muted-foreground">{car.location}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(reservation.startDate, "dd/MM/yyyy")} - {format(reservation.endDate, "dd/MM/yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.ceil((reservation.endDate.getTime() - reservation.startDate.getTime()) / (1000 * 60 * 60 * 24))} jours
                          </div>
                          {reservation.extras && reservation.extras.length > 0 && reservation.extras.some(e => e.selected) && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Options: {reservation.extras.filter(e => e.selected).map(e => e.name).join(', ')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{reservation.totalPrice} TND</TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              "capitalize",
                              reservation.status === "confirmed" && "bg-green-500 hover:bg-green-600",
                              reservation.status === "pending" && "bg-yellow-500 hover:bg-yellow-600",
                              reservation.status === "cancelled" && "bg-red-500 hover:bg-red-600",
                              reservation.status === "completed" && "bg-blue-500 hover:bg-blue-600"
                            )}
                          >
                            {reservation.status === "confirmed" && "Confirmée"}
                            {reservation.status === "pending" && "En attente"}
                            {reservation.status === "cancelled" && "Annulée"}
                            {reservation.status === "completed" && "Terminée"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reservation.payment === "card" ? "Carte" : "Espèces"}
                        </TableCell>
                        <TableCell>
                          {reservation.delivery ? (
                            <div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <TruckIcon size={14} />
                                {reservation.delivery.type === "delivery" ? "Livraison" : "Ramassage"}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                Adresse: {reservation.delivery.address}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sur place</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {["pending", "confirmed"].includes(reservation.status) && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openModifyDialog(
                                  reservation.id, 
                                  reservation.startDate, 
                                  reservation.endDate,
                                  reservation.extras || [],
                                  reservation.delivery
                                )}
                              >
                                Modifier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedReservation(reservation.id);
                                  setCancelDialogOpen(true);
                                }}
                              >
                                Annuler
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              navigate(`/cars/${reservation.carId}`);
                              window.scrollTo(0, 0);
                            }}
                          >
                            Voir la voiture
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Aucune réservation trouvée</h3>
                <p className="text-muted-foreground mb-6">
                  Vous n'avez pas encore effectué de réservation de voiture
                </p>
                <Button onClick={() => {
                  navigate("/cars");
                  window.scrollTo(0, 0);
                }}>
                  Parcourir les voitures disponibles
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Cancel Reservation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Conserver la réservation</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600"
                onClick={handleCancelReservation}
              >
                Annuler la réservation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Modify Reservation Dialog */}
        <Dialog open={modifyDialogOpen} onOpenChange={setModifyDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier la réservation</DialogTitle>
              <DialogDescription>
                Mettre à jour les dates et options de votre réservation
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Calendar */}
              <div className="space-y-2">
                <Label>Dates de réservation</Label>
                <div className="border rounded-md p-4">
                  <Calendar
                    mode="range"
                    selected={{
                      from: startDate,
                      to: endDate,
                    }}
                    onSelect={(range) => {
                      if (range?.from) setStartDate(range.from);
                      if (range?.to) setEndDate(range.to);
                    }}
                    numberOfMonths={1}
                    disabled={(date) => {
                      // Disable dates in the past
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    locale={fr}
                  />
                </div>
              </div>
              
              {/* Extra Options */}
              <div className="space-y-2">
                <Label className="block">Options supplémentaires</Label>
                <div className="space-y-2 border rounded-md p-4">
                  {selectedExtras.map((extra) => (
                    <div key={extra.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id={`modify-${extra.id}`}
                          checked={extra.selected}
                          onCheckedChange={() => toggleExtra(extra.id)}
                        />
                        <Label htmlFor={`modify-${extra.id}`} className="text-sm font-normal cursor-pointer">
                          {extra.name}
                        </Label>
                      </div>
                      <div className="text-sm font-medium">
                        {extra.price} TND/jour
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Delivery Options */}
              <div className="space-y-2">
                <Label className="block">Options de livraison</Label>
                <div className="border rounded-md p-4">
                  <RadioGroup 
                    value={deliveryOption} 
                    onValueChange={(value) => setDeliveryOption(value as DeliveryOption)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self" id="self" />
                      <Label htmlFor="self" className="cursor-pointer">Récupération sur place</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="cursor-pointer">Livraison à domicile (+30 TND)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer">Ramassage à domicile (+30 TND)</Label>
                    </div>
                  </RadioGroup>
                  
                  {(deliveryOption === "delivery" || deliveryOption === "pickup") && (
                    <div className="mt-3">
                      <Label htmlFor="delivery-address" className="block text-sm mb-1">
                        Adresse de {deliveryOption === "delivery" ? "livraison" : "ramassage"}
                      </Label>
                      <Input
                        id="delivery-address"
                        placeholder="Entrez votre adresse complète"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full"
                        defaultValue={user?.address || ""}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Total Price */}
              {startDate && endDate && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-medium">
                    <div>Prix total</div>
                    <div className="text-xl">{calculateTotalPrice()} TND</div>
                  </div>
                  {(deliveryOption !== "self" || selectedExtras.some(e => e.selected)) && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {deliveryOption !== "self" && selectedExtras.some(e => e.selected) 
                        ? "(Incluant les options et frais de livraison)" 
                        : deliveryOption !== "self" 
                          ? "(Incluant les frais de livraison)" 
                          : "(Incluant les options sélectionnées)"}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setModifyDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  className="bg-carflow-green hover:bg-carflow-dark"
                  onClick={handleModifyReservation}
                  disabled={!startDate || !endDate || (deliveryOption !== "self" && !deliveryAddress)}
                >
                  Mettre à jour la réservation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Reservations;
