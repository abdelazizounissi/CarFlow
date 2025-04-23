import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { cars, agencies, getCarById, getAgencyById, Car, Agency, Review } from "../data/carData";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, User } from "./useAuth";

interface Filters {
  location?: string;
  category?: string;
  price?: { min: number; max: number };
  make?: string;
  transmission?: string;
  availability?: boolean;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export type DeliveryOption = "self" | "delivery" | "pickup" | "both";

export interface Reservation {
  id: string;
  carId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  extras: ExtraOption[];
  status: "pending" | "confirmed" | "completed" | "cancelled";
  payment: "card" | "cash";
  createdAt: Date;
  delivery?: {
    type: DeliveryOption;
    address: string;
  } | null;
}

interface CarsContextType {
  filteredCars: Car[];
  agencies: Agency[];
  filters: Filters;
  reservations: Reservation[];
  extraOptions: ExtraOption[];
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  getCarDetails: (carId: string) => Car | undefined;
  getAgencyDetails: (agencyId: string) => Agency | undefined;
  addReview: (carId: string, rating: number, comment: string) => boolean;
  makeReservation: (
    carId: string, 
    startDate: Date, 
    endDate: Date, 
    payment: "card" | "cash", 
    selectedExtras: ExtraOption[], 
    deliveryOption?: { 
      type: DeliveryOption; 
      address: string 
    } | null
  ) => string | null;
  cancelReservation: (reservationId: string) => boolean;
  modifyReservation: (
    reservationId: string, 
    startDate?: Date, 
    endDate?: Date, 
    selectedExtras?: ExtraOption[],
    deliveryInfo?: {
      type: DeliveryOption;
      address: string;
    } | null
  ) => boolean;
  updateReservationStatus: (reservationId: string, status: "confirmed" | "completed" | "cancelled") => boolean;
  getUserReservations: () => Reservation[];
  getAgencyReservations: () => (Reservation & { renterDetails?: User | null })[];
  getAgencyCars: () => Car[];
  addCar: (car: Omit<Car, "id" | "agencyId" | "rating" | "reviews">) => boolean;
  updateCar: (carId: string, updates: Partial<Car>) => boolean;
  deleteCar: (carId: string) => boolean;
  isCarAvailable: (carId: string, startDate: Date, endDate: Date, excludeReservationId?: string) => boolean;
}

const CarsContext = createContext<CarsContextType | undefined>(undefined);

const defaultExtraOptions: ExtraOption[] = [
  { id: 'gps', name: 'GPS', price: 10, selected: false },
  { id: 'child-seat', name: 'Siège enfant', price: 15, selected: false },
  { id: 'additional-driver', name: 'Conducteur supplémentaire', price: 20, selected: false },
  { id: 'wifi', name: 'WiFi portable', price: 8, selected: false },
  { id: 'insurance', name: 'Assurance premium', price: 25, selected: false },
  { id: 'roadside', name: 'Assistance routière', price: 12, selected: false }
];

const RESERVATIONS_STORAGE_KEY = "carflow_reservations";
const CARS_STORAGE_KEY = "carflow_cars";

const adjustCarPrices = (carsData: Car[]): Car[] => {
  return carsData.map(car => ({
    ...car,
    price: Math.round(car.price * 0.7)
  }));
};

export const CarsProvider = ({ children }: { children: ReactNode }) => {
  const { user, userType, getUserById } = useAuth();
  const { toast } = useToast();
  
  const [allCars, setAllCars] = useState<Car[]>(() => {
    const savedCars = localStorage.getItem(CARS_STORAGE_KEY);
    return savedCars ? JSON.parse(savedCars) : adjustCarPrices([...cars]);
  });
  
  const [allAgencies] = useState(agencies);
  const [filters, setFilters] = useState<Filters>({});
  const [extraOptions, setExtraOptions] = useState<ExtraOption[]>(defaultExtraOptions);
  
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const savedReservations = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (savedReservations) {
      const parsedReservations = JSON.parse(savedReservations);
      return parsedReservations.map((res: any) => ({
        ...res,
        startDate: new Date(res.startDate),
        endDate: new Date(res.endDate),
        createdAt: new Date(res.createdAt),
        delivery: res.delivery || null
      }));
    }
    
    return [
      {
        id: "res1",
        carId: "c1",
        userId: "c1",
        startDate: new Date(2023, 11, 20),
        endDate: new Date(2023, 11, 25),
        totalPrice: 875,
        extras: [
          { id: 'gps', name: 'GPS', price: 10, selected: true },
          { id: 'child-seat', name: 'Siège enfant', price: 15, selected: true },
        ],
        status: "completed",
        payment: "card",
        createdAt: new Date(2023, 11, 15),
        delivery: null
      },
      {
        id: "res2",
        carId: "c3",
        userId: "c1",
        startDate: new Date(2024, 0, 15),
        endDate: new Date(2024, 0, 20),
        totalPrice: 420,
        extras: [],
        status: "confirmed",
        payment: "cash",
        createdAt: new Date(2023, 11, 30),
        delivery: null
      }
    ];
  });
  
  useEffect(() => {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);
  
  useEffect(() => {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(allCars));
  }, [allCars]);
  
  useEffect(() => {
    const today = new Date();
    
    const updatedCars = allCars.map(car => ({...car}));
    
    for (const car of updatedCars) {
      const hasActiveReservation = reservations.some(reservation => {
        return (
          reservation.carId === car.id &&
          ["pending", "confirmed"].includes(reservation.status) &&
          new Date(reservation.endDate) >= today
        );
      });
      
      if (hasActiveReservation) {
        car.available = false;
      }
    }
    
  }, [reservations, allCars]);

  const filteredCars = allCars.filter(car => {
    if (filters.location && filters.location !== "all-locations" && car.location !== filters.location) {
      return false;
    }
    
    if (filters.category && filters.category !== "all-categories" && car.category !== filters.category) {
      return false;
    }
    
    if (filters.price) {
      if (car.price < filters.price.min || car.price > filters.price.max) {
        return false;
      }
    }
    
    if (filters.make && filters.make !== "all-makes" && car.make !== filters.make) {
      return false;
    }
    
    if (filters.transmission && filters.transmission !== "all-types" && car.transmission !== filters.transmission) {
      return false;
    }
    
    if (filters.availability !== undefined && car.available !== filters.availability) {
      return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    setFilters({});
  };

  const getCarDetails = (carId: string) => {
    return allCars.find(car => car.id === carId);
  };

  const getAgencyDetails = (agencyId: string) => {
    return getAgencyById(agencyId);
  };

  const addReview = (carId: string, rating: number, comment: string): boolean => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour laisser un avis",
        variant: "destructive"
      });
      return false;
    }

    try {
      const car = getCarDetails(carId);
      if (!car) {
        toast({
          title: "Erreur",
          description: "Voiture non trouvée",
          variant: "destructive"
        });
        return false;
      }
      
      const existingReview = car.reviews.find(review => review.userId === user.id);
      if (existingReview) {
        toast({
          title: "Avis existe déjà",
          description: "Vous avez déjà laissé un avis pour cette voiture",
          variant: "destructive"
        });
        return false;
      }
      
      const newReview: Review = {
        id: `r${Date.now()}`,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
      };
      
      car.reviews.push(newReview);
      
      car.rating = car.reviews.reduce((sum, review) => sum + review.rating, 0) / car.reviews.length;
      
      toast({
        title: "Avis ajouté",
        description: "Merci pour votre retour !",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'avis",
        variant: "destructive"
      });
      return false;
    }
  };

  const isCarAvailable = (carId: string, startDate: Date, endDate: Date, excludeReservationId?: string): boolean => {
    const car = getCarDetails(carId);
    if (!car) return false;
    
    if (!car.available && !excludeReservationId) {
      return false;
    }
    
    const overlap = reservations.some(reservation => {
      if (excludeReservationId && reservation.id === excludeReservationId) {
        return false;
      }
      
      if (reservation.carId !== carId || reservation.status === 'cancelled') {
        return false;
      }
      
      return (
        (startDate <= reservation.endDate && endDate >= reservation.startDate) &&
        ['pending', 'confirmed'].includes(reservation.status)
      );
    });
    
    return !overlap;
  };

  const calculateExtrasCost = (selectedExtras: ExtraOption[]) => {
    return selectedExtras
      .filter(extra => extra.selected)
      .reduce((sum, extra) => sum + extra.price, 0);
  };

  const makeReservation = (
    carId: string, 
    startDate: Date, 
    endDate: Date, 
    payment: "card" | "cash",
    selectedExtras: ExtraOption[],
    deliveryInfo?: {
      type: DeliveryOption;
      address: string;
    } | null
  ): string | null => {
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour faire une réservation",
        variant: "destructive"
      });
      return null;
    }

    if (userType === 'agency') {
      toast({
        title: "Non autorisé",
        description: "Les comptes d'agence ne peuvent pas faire de réservations",
        variant: "destructive"
      });
      return null;
    }

    try {
      const car = getCarDetails(carId);
      if (!car) {
        toast({
          title: "Erreur",
          description: "Voiture non trouvée",
          variant: "destructive"
        });
        return null;
      }
      
      if (!isCarAvailable(carId, startDate, endDate)) {
        toast({
          title: "Non disponible",
          description: "Cette voiture n'est pas disponible pour les dates sélectionnées",
          variant: "destructive"
        });
        return null;
      }
      
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const carCost = car.price * days;
      const extrasCost = calculateExtrasCost(selectedExtras);
      
      const deliveryFee = deliveryInfo ? 
        (deliveryInfo.type === "self" ? 0 : 
         deliveryInfo.type === "both" ? 50 : 30) : 0;
         
      const totalPrice = carCost + (extrasCost * days) + deliveryFee;
      
      const newReservation: Reservation = {
        id: `res${Date.now()}`,
        carId,
        userId: user.id,
        startDate,
        endDate,
        totalPrice,
        extras: [...selectedExtras],
        status: "pending",
        payment,
        createdAt: new Date(),
        delivery: deliveryInfo || null
      };
      
      setReservations(prev => [...prev, newReservation]);
      
      const carIndex = allCars.findIndex(c => c.id === carId);
      if (carIndex !== -1) {
        const updatedCars = [...allCars];
        updatedCars[carIndex] = {...updatedCars[carIndex], available: false};
        setAllCars(updatedCars);
      }
      
      toast({
        title: "Réservation créée",
        description: "Votre réservation est en attente de confirmation. Total: " + totalPrice + " TND"
      });
      
      return newReservation.id;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive"
      });
      return null;
    }
  };

  const cancelReservation = (reservationId: string): boolean => {
    try {
      const reservationIndex = reservations.findIndex(res => res.id === reservationId);
      if (reservationIndex === -1) {
        toast({
          title: "Erreur",
          description: "Réservation non trouvée",
          variant: "destructive"
        });
        return false;
      }
      
      const reservation = reservations[reservationIndex];
      
      if (userType === 'client' && reservation.userId !== user?.id) {
        toast({
          title: "Non autorisé",
          description: "Vous pouvez annuler uniquement vos propres réservations",
          variant: "destructive"
        });
        return false;
      }
      
      if (userType === 'agency') {
        const car = getCarById(reservation.carId);
        if (car?.agencyId !== user?.id) {
          toast({
            title: "Non autorisé",
            description: "Vous pouvez annuler uniquement les réservations pour vos voitures",
            variant: "destructive"
          });
          return false;
        }
      }
      
      if (reservation.status === 'completed') {
        toast({
          title: "Impossible d'annuler",
          description: "Les réservations terminées ne peuvent pas être annulées",
          variant: "destructive"
        });
        return false;
      }
      
      const updatedReservations = [...reservations];
      updatedReservations[reservationIndex] = {
        ...reservation,
        status: "cancelled"
      };
      
      setReservations(updatedReservations);
      
      const car = getCarById(reservation.carId);
      if (car) {
        const carIndex = allCars.findIndex(c => c.id === car.id);
        if (carIndex !== -1) {
          const hasOtherActiveReservations = updatedReservations.some(res => 
            res.carId === car.id && 
            res.id !== reservationId && 
            ["pending", "confirmed"].includes(res.status)
          );
          
          if (!hasOtherActiveReservations) {
            allCars[carIndex] = {...allCars[carIndex], available: true};
          }
        }
      }
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateReservationStatus = (reservationId: string, status: "confirmed" | "completed" | "cancelled"): boolean => {
    try {
      if (userType !== 'agency') {
        toast({
          title: "Non autorisé",
          description: "Seules les agences peuvent modifier le statut des réservations",
          variant: "destructive"
        });
        return false;
      }
      
      const reservationIndex = reservations.findIndex(res => res.id === reservationId);
      if (reservationIndex === -1) {
        toast({
          title: "Erreur",
          description: "Réservation non trouvée",
          variant: "destructive"
        });
        return false;
      }
      
      const reservation = reservations[reservationIndex];
      
      console.log("Checking reservation:", reservation);
      console.log("Current user ID:", user?.id);
      
      const car = allCars.find(c => c.id === reservation.carId);
      console.log("Found car:", car);
      
      if (!car || car.agencyId !== user?.id) {
        toast({
          title: "Non autorisé",
          description: "Vous ne pouvez pas modifier les réservations pour les voitures qui ne vous appartiennent pas",
          variant: "destructive"
        });
        return false;
      }
      
      const updatedReservations = [...reservations];
      updatedReservations[reservationIndex] = {
        ...reservation,
        status: status
      };
      
      setReservations(updatedReservations);
      
      if (status === 'cancelled' || status === 'completed') {
        const hasOtherActiveReservations = updatedReservations.some(res => 
          res.carId === car.id && 
          res.id !== reservationId && 
          ["pending", "confirmed"].includes(res.status)
        );
        
        if (!hasOtherActiveReservations) {
          const carIndex = allCars.findIndex(c => c.id === car.id);
          if (carIndex !== -1) {
            const updatedCars = [...allCars];
            updatedCars[carIndex] = {...updatedCars[carIndex], available: true};
            setAllCars(updatedCars);
          }
        }
      }
      
      const statusMessages = {
        confirmed: "confirmée",
        completed: "terminée",
        cancelled: "annulée"
      };
      
      toast({
        title: "Statut mis à jour",
        description: "La réservation a été " + statusMessages[status] + " avec succès"
      });
      
      return true;
    } catch (error) {
      console.error("Error updating reservation status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la réservation",
        variant: "destructive"
      });
      return false;
    }
  };

  const modifyReservation = (
    reservationId: string, 
    startDate?: Date, 
    endDate?: Date, 
    selectedExtras?: ExtraOption[],
    deliveryInfo?: {
      type: DeliveryOption;
      address: string;
    } | null
  ): boolean => {
    try {
      const reservationIndex = reservations.findIndex(res => res.id === reservationId);
      if (reservationIndex === -1) {
        toast({
          title: "Erreur",
          description: "Réservation non trouvée",
          variant: "destructive"
        });
        return false;
      }
      
      const reservation = reservations[reservationIndex];
      
      if (reservation.userId !== user?.id) {
        toast({
          title: "Non autorisé",
          description: "Vous pouvez modifier uniquement vos propres réservations",
          variant: "destructive"
        });
        return false;
      }
      
      if (reservation.status === 'completed' || reservation.status === 'cancelled') {
        toast({
          title: "Impossible de modifier",
          description: "Les réservations " + (reservation.status === 'completed' ? 'terminées' : 'annulées') + " ne peuvent pas être modifiées",
          variant: "destructive"
        });
        return false;
      }
      
      const newStartDate = startDate || reservation.startDate;
      const newEndDate = endDate || reservation.endDate;
      const newExtras = selectedExtras || reservation.extras;
      const newDelivery = deliveryInfo !== undefined ? deliveryInfo : reservation.delivery;
      
      if (newStartDate >= newEndDate) {
        toast({
          title: "Dates invalides",
          description: "La date de fin doit être postérieure à la date de début",
          variant: "destructive"
        });
        return false;
      }
      
      if (!isCarAvailable(reservation.carId, newStartDate, newEndDate, reservationId)) {
        toast({
          title: "Non disponible",
          description: "La voiture n'est pas disponible pour les dates sélectionnées",
          variant: "destructive"
        });
        return false;
      }
      
      const car = getCarById(reservation.carId);
      if (!car) return false;
      
      const days = Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24));
      const carCost = car.price * days;
      const extrasCost = calculateExtrasCost(newExtras);
      const deliveryFee = newDelivery && newDelivery.type !== "self" ? 30 : 0;
      const totalPrice = carCost + (extrasCost * days) + deliveryFee;
      
      const updatedReservations = [...reservations];
      updatedReservations[reservationIndex] = {
        ...reservation,
        startDate: newStartDate,
        endDate: newEndDate,
        totalPrice,
        extras: newExtras,
        delivery: newDelivery
      };
      
      setReservations(updatedReservations);
      
      toast({
        title: "Réservation modifiée",
        description: "Votre réservation a été mise à jour. Nouveau total: " + totalPrice + " TND"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la réservation",
        variant: "destructive"
      });
      return false;
    }
  };

  const getUserReservations = (): Reservation[] => {
    if (!user) return [];
    return reservations.filter(reservation => reservation.userId === user.id);
  };

  const getAgencyReservations = (): (Reservation & { renterDetails?: User | null })[] => {
    if (!user || userType !== 'agency') return [];
    
    console.log("Agency ID in getAgencyReservations:", user.id);
    console.log("All cars:", allCars);
    
    const agencyCars = allCars.filter(car => car.agencyId === user.id).map(car => car.id);
    console.log("Agency cars IDs:", agencyCars);
    
    const agencyReservations = reservations.filter(reservation => agencyCars.includes(reservation.carId));
    console.log("Agency reservations:", agencyReservations);
    
    return agencyReservations.map(reservation => {
      const renterDetails = getUserById ? getUserById(reservation.userId) : null;
      return {
        ...reservation,
        renterDetails
      };
    });
  };

  const getAgencyCars = (): Car[] => {
    if (!user || userType !== 'agency') return [];
    
    console.log("Getting cars for agency ID:", user.id);
    console.log("All cars:", allCars);
    
    const agencyCars = allCars.filter(car => car.agencyId === user.id);
    
    console.log("Agency cars found:", agencyCars);
    
    return agencyCars;
  };

  const addCar = (car: Omit<Car, "id" | "agencyId" | "rating" | "reviews">): boolean => {
    if (!user || userType !== 'agency') {
      toast({
        title: "Non autorisé",
        description: "Seules les agences peuvent ajouter des voitures",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log("Adding car with agency ID:", user.id);
      
      const newCarId = `c${Date.now()}`;
      
      const newCar: Car = {
        ...car,
        id: newCarId,
        agencyId: user.id,
        rating: 0,
        reviews: []
      };
      
      console.log("New car created:", newCar);
      
      setAllCars(prev => [...prev, newCar]);
      
      toast({
        title: "Voiture ajoutée",
        description: "Votre voiture a été ajoutée avec succès à votre inventaire",
      });
      
      return true;
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la voiture",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateCar = (carId: string, updates: Partial<Car>): boolean => {
    if (!user || userType !== 'agency') {
      toast({
        title: "Non autorisé",
        description: "Seules les agences peuvent mettre à jour les voitures",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log("Updating car:", carId);
      console.log("User ID:", user.id);
      
      const carIndex = allCars.findIndex(car => car.id === carId);
      if (carIndex === -1) {
        toast({
          title: "Erreur",
          description: "Voiture non trouvée",
          variant: "destructive"
        });
        return false;
      }
      
      const car = allCars[carIndex];
      console.log("Car found:", car);
      
      if (car.agencyId !== user.id) {
        console.log("Car agency ID:", car.agencyId);
        console.log("User ID:", user.id);
        toast({
          title: "Non autorisé",
          description: "Vous pouvez mettre à jour uniquement vos propres voitures",
          variant: "destructive"
        });
        return false;
      }
      
      const updatedCars = [...allCars];
      updatedCars[carIndex] = {
        ...car,
        ...updates
      };
      
      setAllCars(updatedCars);
      
      toast({
        title: "Voiture mise à jour",
        description: "Les détails de votre voiture ont été mis à jour avec succès",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating car:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la voiture",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteCar = (carId: string): boolean => {
    if (!user || userType !== 'agency') {
      toast({
        title: "Non autorisé",
        description: "Seules les agences peuvent supprimer des voitures",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log("Deleting car:", carId);
      console.log("User ID:", user.id);
      
      const carIndex = allCars.findIndex(car => car.id === carId);
      if (carIndex === -1) {
        toast({
          title: "Erreur",
          description: "Voiture non trouvée",
          variant: "destructive"
        });
        return false;
      }
      
      const car = allCars[carIndex];
      console.log("Car found:", car);
      
      if (car.agencyId !== user.id) {
        console.log("Car agency ID:", car.agencyId);
        console.log("User ID:", user.id);
        toast({
          title: "Non autorisé",
          description: "Vous pouvez supprimer uniquement vos propres voitures",
          variant: "destructive"
        });
        return false;
      }
      
      const activeReservations = reservations.some(
        res => res.carId === carId && ['pending', 'confirmed'].includes(res.status)
      );
      
      if (activeReservations) {
        toast({
          title: "Suppression impossible",
          description: "Cette voiture a des réservations actives et ne peut pas être supprimée",
          variant: "destructive"
        });
        return false;
      }
      
      const updatedCars = [...allCars];
      updatedCars.splice(carIndex, 1);
      setAllCars(updatedCars);
      
      toast({
        title: "Voiture supprimée",
        description: "Votre voiture a été supprimée avec succès de votre inventaire",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la voiture",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <CarsContext.Provider
      value={{
        filteredCars,
        agencies: allAgencies,
        filters,
        reservations,
        extraOptions,
        setFilters,
        resetFilters,
        getCarDetails,
        getAgencyDetails,
        addReview,
        makeReservation,
        cancelReservation,
        modifyReservation,
        updateReservationStatus,
        getUserReservations,
        getAgencyReservations,
        getAgencyCars,
        addCar,
        updateCar,
        deleteCar,
        isCarAvailable,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarsContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarsProvider");
  }
  return context;
};
