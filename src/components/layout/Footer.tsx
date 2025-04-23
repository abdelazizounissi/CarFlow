import { Link } from "react-router-dom";
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
const Footer = () => {
  return <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Car Flow Logo" className="h-8 w-8" />
              <span className="font-bold text-[22c55e] text-green-500">CarFlow</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Le meilleur service de location de voitures en Tunisie. Trouvez la voiture parfaite pour vos besoins à des prix compétitifs.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-tunisia transition-colors">Accueil</Link></li>
              <li><Link to="/cars" className="text-gray-300 hover:text-tunisia transition-colors">Voitures</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-tunisia transition-colors">À Propos</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-tunisia transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-tunisia transition-colors">Conditions Générales</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">Contactez-nous</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-tunisia bg-transparent" />
                <span>Faculté des Sciences de Gabès, Gabès, Tunisie</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4 text-tunisia" />
                <span>+216 71 123 456</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4 text-tunisia" />
                <span>contact@carflow.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">Suivez-nous</h3>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-tunisia transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-tunisia transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-tunisia transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; 2025 CarFlow. Tous droits réservés.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
