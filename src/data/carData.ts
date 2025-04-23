
export interface Car {
  id: string;
  agencyId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  category: string;
  transmission: "Automatique" | "Manuelle";
  fuelType: string;
  seats: number;
  images: string[];
  description: string;
  features: string[];
  available: boolean;
  location: string;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  description: string;
  rating: number;
}

// Define car makes and models
const carMakes = [
  {
    make: "Renault",
    models: ["Clio", "Megane", "Captur", "Kadjar", "Symbol", "Duster"]
  },
  {
    make: "Peugeot",
    models: ["208", "2008", "308", "3008", "508"]
  },
  {
    make: "Volkswagen",
    models: ["Golf", "Polo", "Passat", "Tiguan", "T-Roc"]
  },
  {
    make: "Citroën",
    models: ["C3", "C4", "Berlingo", "C-Elysée", "C5"]
  },
  {
    make: "Dacia",
    models: ["Logan", "Sandero", "Duster", "Stepway", "Lodgy"]
  },
  {
    make: "Hyundai",
    models: ["i10", "i20", "i30", "Tucson", "Accent"]
  },
  {
    make: "Kia",
    models: ["Picanto", "Rio", "Ceed", "Sportage", "Stonic"]
  },
  {
    make: "Ford",
    models: ["Fiesta", "Focus", "Kuga", "Puma", "EcoSport"]
  },
  {
    make: "Toyota",
    models: ["Yaris", "Corolla", "C-HR", "RAV4", "Camry"]
  },
  {
    make: "Seat",
    models: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"]
  },
  {
    make: "Mercedes-Benz",
    models: ["A-Class", "C-Class", "E-Class", "GLA", "GLC"]
  },
  {
    make: "BMW",
    models: ["1 Series", "3 Series", "5 Series", "X1", "X3"]
  },
  {
    make: "Audi",
    models: ["A1", "A3", "A4", "Q2", "Q3"]
  }
];

// Tunisian cities
const cities = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", 
  "Gafsa", "Monastir", "Kasserine", "Hammamet", "Nabeul", "Médenine", "Djerba"
];

// Tunisian street names to make addresses more realistic
const streets = [
  "Rue Habib Bourguiba", "Avenue Mohamed V", "Rue Ibn Khaldoun", "Avenue Farhat Hached", 
  "Rue de Marseille", "Avenue de Carthage", "Rue 7 Novembre", "Avenue de Paris",
  "Rue Alain Savary", "Avenue Hédi Nouira", "Rue de Rome", "Avenue de la Liberté",
  "Rue Charles de Gaulle", "Avenue Habib Thameur", "Rue Mokhtar Attia", "Avenue Jean Jaurès"
];

// Generate random address
const getRandomAddress = () => {
  const streetNumber = Math.floor(Math.random() * 200) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  return `${streetNumber} ${street}, ${city}, Tunisie`;
};

// Sample agencies with randomized addresses
export const agencies: Agency[] = [
  {
    id: "a1",
    name: "STB Car Location",
    email: "stb@carflow.tn",
    phone: "+216 71 123 456",
    address: getRandomAddress(),
    description: "Service de location de voitures premium au cœur de la Tunisie",
    rating: 4.8
  },
  {
    id: "a2",
    name: "Royal Car Location",
    email: "royal@carflow.tn",
    phone: "+216 73 987 654",
    address: getRandomAddress(),
    description: "Explorez la Tunisie avec nos véhicules fiables et abordables",
    rating: 4.5
  },
  {
    id: "a3",
    name: "Golden Car Location",
    email: "golden@carflow.tn",
    phone: "+216 74 567 890",
    address: getRandomAddress(),
    description: "Véhicules de luxe et économiques pour tous vos besoins de voyage",
    rating: 4.7
  },
  {
    id: "a4",
    name: "Carthage Car Location",
    email: "carthage@carflow.tn",
    phone: "+216 72 345 678",
    address: getRandomAddress(),
    description: "Location de voitures familiale avec service personnalisé",
    rating: 4.6
  },
  {
    id: "a5",
    name: "Tunisia Location",
    email: "tunisia@carflow.tn",
    phone: "+216 75 234 567",
    address: getRandomAddress(),
    description: "La meilleure expérience de location de voitures en Tunisie",
    rating: 4.4
  },
  {
    id: "a6",
    name: "Europcar Tunisie",
    email: "europcar@carflow.tn",
    phone: "+216 71 876 543",
    address: getRandomAddress(),
    description: "Location de voitures internationale avec standards européens",
    rating: 4.7
  },
  {
    id: "a7",
    name: "Hertz Tunisie",
    email: "hertz@carflow.tn",
    phone: "+216 73 456 789",
    address: getRandomAddress(),
    description: "Service de location fiable avec une large gamme de véhicules",
    rating: 4.5
  },
  {
    id: "a8",
    name: "Ada Tunisie",
    email: "ada@carflow.tn",
    phone: "+216 74 321 654",
    address: getRandomAddress(),
    description: "Location de voitures économique avec service client exceptionnel",
    rating: 4.3
  },
  {
    id: "a9",
    name: "Locauto Tunisie",
    email: "locauto@carflow.tn",
    phone: "+216 72 789 123",
    address: getRandomAddress(),
    description: "Solutions de mobilité innovantes pour tous vos déplacements",
    rating: 4.6
  },
  {
    id: "a10",
    name: "Best Way Location",
    email: "bestway@carflow.tn",
    phone: "+216 75 654 321",
    address: getRandomAddress(),
    description: "Le meilleur moyen de découvrir la Tunisie à votre rythme",
    rating: 4.7
  },
  {
    id: "a11",
    name: "Budget Location",
    email: "budget@carflow.tn",
    phone: "+216 71 234 567",
    address: getRandomAddress(),
    description: "Location de voitures abordable sans compromis sur la qualité",
    rating: 4.4
  }
];

// Tunisian names for reviews - let's add more names to generate more ratings
const tunisianNames = [
  "Ahmed Bejaoui", "Leila Mansour", "Karim Zouari", "Sonia Trabelsi", "Mehdi Chaabane", 
  "Amina Khaled", "Youssef Gharbi", "Fatma Riahi", "Rami Ben Salah", "Nadia Mrad",
  "Sami Fehri", "Yasmine Zidi", "Mohamed Jouini", "Lina Ayari", "Tarek Bouslama",
  "Amel Jebali", "Slim Hamdaoui", "Rania Ouerghi", "Amine Chebbi", "Olfa Mejri",
  "Nizar Karoui", "Sara Belghith", "Farid Jlassi", "Zeineb Saidi", "Hedi Ferchichi",
  "Rim Amri", "Omar Farhat", "Asma Malouki", "Sofiene Khayati", "Ines Dridi",
  "Aymen Mabrouk", "Salma Jaziri", "Taoufik Hammami", "Mariem Kriaa", "Bilel Laabidi",
  "Emna Derbel", "Mourad Talbi", "Rihab Moussa", "Wadii Mejri", "Sirine Brahmi",
  "Chokri Hajri", "Amira Labidi", "Adnene Khiari", "Wafa Stambouli", "Bassem Krichene",
  "Dorra Hmida", "Issam Besbes", "Hiba Zaafouri", "Khaled Djerbi", "Sabrine Riahi",
  "Faouzi Khemiri", "Manel Rebai", "Majdi Mzoughi", "Hela Ghariani", "Zied Torkhani"
];

// Car features in French
const features = [
  "Bluetooth", "Climatisation", "GPS", "Caméra de recul", "Régulateur de vitesse", 
  "Siège enfant", "Vitres électriques", "Verrouillage centralisé", "ABS", "ESP", 
  "Airbags", "Radio/CD", "Entrée USB", "Toit ouvrant", "Jantes alliage",
  "Phares LED", "Radar de stationnement", "Chargeur sans fil", "Apple CarPlay/Android Auto",
  "Sièges chauffants", "Capteurs de pluie", "Démarrage sans clé", "Coffre électrique",
  "Système audio premium", "Écran tactile", "Frein de stationnement électrique"
];

// Car categories in French
const categories = ["Économique", "Compact", "Berline", "SUV", "Familial", "Premium", "Luxe", "Utilitaire"];

// Fuel types in French
const fuelTypes = ["Essence", "Diesel", "Hybride", "Électrique"];

// Price ranges by category in TND - LOWERED by ~30%
const priceRanges = {
  "Économique": { min: 50, max: 85 },
  "Compact": { min: 70, max: 110 },
  "Berline": { min: 100, max: 150 },
  "SUV": { min: 120, max: 200 },
  "Familial": { min: 120, max: 180 },
  "Premium": { min: 170, max: 280 },
  "Luxe": { min: 250, max: 500 },
  "Utilitaire": { min: 80, max: 150 }
};

// Generate car descriptions in French
const generateDescription = (make: string, model: string, category: string, year: number, fuelType: string) => {
  const descriptions = [
    `Découvrez notre ${make} ${model} ${year}, idéal pour vos déplacements en Tunisie. Ce véhicule ${category.toLowerCase()} offre confort et fiabilité à un prix compétitif.`,
    `Profitez de votre séjour en Tunisie au volant de notre ${make} ${model}. Ce modèle ${category.toLowerCase()} de ${year} combine élégance et performance avec son moteur ${fuelType.toLowerCase()}.`,
    `Notre ${make} ${model} ${year} est parfait pour explorer la Tunisie en toute liberté. Cette voiture ${category.toLowerCase()} offre un excellent rapport qualité-prix et une consommation optimisée.`,
    `Voyagez confortablement avec notre ${make} ${model}. Ce véhicule ${category.toLowerCase()} de ${year} est équipé des dernières technologies et offre une conduite agréable sur tous types de routes.`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Generate a random sample of car features
const getRandomFeatures = () => {
  const count = 3 + Math.floor(Math.random() * 6); // 3-8 features
  const shuffled = [...features].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate random photo URL for cars
const carImages = [
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1605371591425-68706951854d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1609053947185-a67bba808797?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1596768336967-50756991e1d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1593055357429-62eaf3b259cc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592070097732-18d38753d2c9?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

// Generate random car images
const getRandomCarImages = () => {
  const shuffled = [...carImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 1 + Math.floor(Math.random() * 2)); // 1-3 images
};

// Generate many more reviews (100+ in total)
const generateReviews = (count: number) => {
  const reviews: Review[] = [];
  const usedNames = new Set();
  
  for (let i = 0; i < count; i++) {
    let name;
    do {
      name = tunisianNames[Math.floor(Math.random() * tunisianNames.length)];
    } while (usedNames.has(name));
    usedNames.add(name);
    
    const rating = 3.5 + Math.random() * 1.5; // Rating between 3.5 and 5
    const reviewTexts = [
      "Très satisfait de cette voiture. Propre, bien entretenue et très économique en carburant.",
      "Excellent service, voiture en parfait état, je recommande !",
      "Expérience agréable. La voiture était confortable et idéale pour notre voyage.",
      "Bon rapport qualité-prix. Véhicule fiable sans aucun problème.",
      "Service impeccable et voiture très propre. Je relouerai sans hésiter.",
      "Très bonne expérience. La voiture était comme décrite et le processus de location simple.",
      "Super service client et voiture en excellent état. Je recommande vivement.",
      "La voiture correspondait parfaitement à mes besoins. Location sans problème.",
      "Prix raisonnable et véhicule confortable. Parfait pour notre séjour.",
      "Très satisfait de la propreté et de l'état du véhicule. À refaire !",
      "Service rapide et efficace. Voiture propre et bien entretenue.",
      "Location impeccable, voiture économique et confortable."
    ];
    
    const today = new Date();
    const pastDate = new Date();
    pastDate.setMonth(today.getMonth() - Math.floor(Math.random() * 6)); // Random date within last 6 months
    
    reviews.push({
      id: `r${i + 1}`,
      userId: `c${i + 20}`, // Random client ID
      userName: name,
      rating: Math.round(rating * 10) / 10,
      comment: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
      date: pastDate.toISOString().split('T')[0]
    });
  }
  
  return reviews;
};

// Generate cars
export const cars: Car[] = [];

let carId = 1;
agencies.forEach(agency => {
  // Each agency gets between 5 and 9 cars
  const carCount = 5 + Math.floor(Math.random() * 5);
  
  for (let i = 0; i < carCount; i++) {
    const makeModelObj = carMakes[Math.floor(Math.random() * carMakes.length)];
    const make = makeModelObj.make;
    const model = makeModelObj.models[Math.floor(Math.random() * makeModelObj.models.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priceRange = priceRanges[category];
    const year = 2018 + Math.floor(Math.random() * 6); // 2018-2023
    const transmission = Math.random() > 0.4 ? "Automatique" : "Manuelle";
    const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
    const location = cities[Math.floor(Math.random() * cities.length)];
    const price = priceRange.min + Math.floor(Math.random() * (priceRange.max - priceRange.min));
    const seats = category === "Familial" || category === "SUV" ? 5 + Math.floor(Math.random() * 3) : 5;
    
    // Generate more reviews per car (5-15 reviews each)
    const reviewCount = 5 + Math.floor(Math.random() * 11); 
    const reviews = generateReviews(reviewCount);
    
    // Calculate average rating from reviews
    const rating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 4 + Math.random(); // Default rating between 4-5
    
    cars.push({
      id: `c${carId}`,
      agencyId: agency.id,
      make,
      model,
      year,
      price,
      category,
      transmission,
      fuelType,
      seats,
      images: getRandomCarImages(),
      description: generateDescription(make, model, category, year, fuelType),
      features: getRandomFeatures(),
      available: Math.random() > 0.15, // 85% availability
      location,
      rating: Math.round(rating * 10) / 10,
      reviews
    });
    
    carId++;
  }
});

export const getCarsByAgency = (agencyId: string) => {
  return cars.filter(car => car.agencyId === agencyId);
};

export const getAgencyById = (agencyId: string) => {
  return agencies.find(agency => agency.id === agencyId);
};

export const getCarById = (carId: string) => {
  return cars.find(car => car.id === carId);
};
