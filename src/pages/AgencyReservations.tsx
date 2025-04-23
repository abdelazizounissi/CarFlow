
import { useState, useEffect } from "react";
import { format } from "date-fns";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCars } from "@/hooks/useCars";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { TruckIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const AgencyReservations = () => {
  const navigate = useNavigate();
  const { getAgencyReservations, getCarDetails, cancelReservation, updateReservationStatus } = useCars();
  const { user, userType, getUserById } = useAuth();
  
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (!user || userType !== "agency") {
      navigate("/login");
    }
  }, [user, userType, navigate]);
  
  useEffect(() => {
    if (user && userType === "agency") {
      console.log("Current agency ID:", user.id);
      const agencyReservations = getAgencyReservations();
      console.log("Agency Reservations:", agencyReservations);
    }
  }, [user, userType, getAgencyReservations]);
  
  const allReservations = user && userType === "agency" ? getAgencyReservations() : [];
  console.log("All agency reservations (component):", allReservations);
  
  const filteredReservations = selectedFilter === "all" 
    ? allReservations 
    : allReservations.filter(res => res.status === selectedFilter);
  
  const handleCancelReservation = () => {
    if (selectedReservation) {
      cancelReservation(selectedReservation);
      setCancelDialogOpen(false);
      setSelectedReservation(null);
    }
  };
  
  const handleUpdateStatus = (reservationId: string, status: "confirmed" | "completed" | "cancelled") => {
    updateReservationStatus(reservationId, status);
  };

  // Helper function to display delivery type with appropriate icon
  const renderDeliveryType = (type: string) => {
    switch (type) {
      case "delivery":
        return (
          <div className="flex items-center gap-1">
            <ArrowDownIcon size={14} />
            <span>Livraison</span>
          </div>
        );
      case "pickup":
        return (
          <div className="flex items-center gap-1">
            <ArrowUpIcon size={14} />
            <span>Ramassage</span>
          </div>
        );
      case "both":
        return (
          <div className="flex items-center gap-1">
            <TruckIcon size={14} />
            <span>Livraison + Ramassage</span>
          </div>
        );
      default:
        return "Sur place";
    }
  };

  if (!user || userType !== "agency") {
    return (
      <Layout>
        <div className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Accès refusé</h3>
                <p className="text-muted-foreground mb-6">
                  Vous devez être connecté en tant qu'agence pour accéder à cette page.
                </p>
                <Button onClick={() => navigate("/login")} className="bg-green-500 hover:bg-green-600">
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
        <h1 className="text-3xl font-bold mb-2">Gérer les Réservations</h1>
        <p className="text-muted-foreground mb-8">
          Examinez et gérez les réservations de véhicules de vos clients
        </p>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Statut:</span>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Toutes les réservations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les réservations</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmées</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredReservations.length} {filteredReservations.length === 1 ? "réservation" : "réservations"} trouvée(s)
          </div>
        </div>
        
        {filteredReservations.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voiture</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Livraison/Ramassage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map(reservation => {
                    const car = getCarDetails(reservation.carId);
                    const renter = getUserById(reservation.userId);
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            {car?.images[0] && (
                              <div className="h-10 w-14 rounded overflow-hidden">
                                <img 
                                  src={car.images[0]} 
                                  alt={`${car?.make} ${car?.model}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div>{car?.make} {car?.model}</div>
                              <div className="text-xs text-muted-foreground">{car?.location}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{renter?.name || "Client inconnu"}</div>
                          <div className="text-xs text-muted-foreground">
                            {renter?.email && (
                              <div className="flex items-center gap-1">
                                <span>Email:</span>
                                <span>{renter.email}</span>
                              </div>
                            )}
                            {renter?.phone && (
                              <div className="flex items-center gap-1">
                                <span>Tél:</span>
                                <span>{renter.phone}</span>
                              </div>
                            )}
                            <div>Créé le: {format(reservation.createdAt, "dd/MM/yyyy")}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(reservation.startDate, "dd/MM/yyyy")} - {format(reservation.endDate, "dd/MM/yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.ceil((reservation.endDate.getTime() - reservation.startDate.getTime()) / (1000 * 60 * 60 * 24))} jours
                          </div>
                          {reservation.extras && reservation.extras.length > 0 && (
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
                          {reservation.delivery ? (
                            <div className="space-y-1">
                              <Badge variant="outline" className="flex items-center gap-1 mb-1">
                                {reservation.delivery.type === "delivery" && renderDeliveryType("delivery")}
                                {reservation.delivery.type === "pickup" && renderDeliveryType("pickup")}  
                                {reservation.delivery.type === "both" && renderDeliveryType("both")}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                Adresse: {reservation.delivery.address}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sur place</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {reservation.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-500 border-green-500 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(reservation.id, "confirmed")}
                            >
                              Confirmer
                            </Button>
                          )}
                          
                          {reservation.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-500 border-blue-500 hover:bg-blue-50"
                              onClick={() => handleUpdateStatus(reservation.id, "completed")}
                            >
                              Terminer
                            </Button>
                          )}
                          
                          {["pending", "confirmed"].includes(reservation.status) && (
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
                  {selectedFilter === "all" 
                    ? "Vous n'avez pas encore de réservations" 
                    : `Aucune réservation ${
                        selectedFilter === "confirmed" ? "confirmée" :
                        selectedFilter === "pending" ? "en attente" :
                        selectedFilter === "completed" ? "terminée" : "annulée"
                      } trouvée`}
                </p>
                <Button onClick={() => {
                  navigate("/agency/cars");
                  window.scrollTo(0, 0);
                }} className="bg-green-500 hover:bg-green-600">
                  Gérer vos voitures
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
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
      </div>
    </Layout>
  );
};

export default AgencyReservations;
