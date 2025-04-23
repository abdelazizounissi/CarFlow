import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    userType,
    logout
  } = useAuth();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return <header className="bg-carflow-black text-white py-4 shadow-md bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img alt="Car Flow Logo" className="h-8 w-8" src="/logo.svg" />
            <span className="text-xl font-bold text-green-500">CarFlow</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-500 transition-colors">Accueil</Link>
            <Link to="/cars" className="hover:text-green-500 transition-colors">Voitures</Link>
            <Link to="/about" className="hover:text-green-500 transition-colors">À Propos</Link>
            <Link to="/contact" className="hover:text-green-500 transition-colors">Contact</Link>
            <Link to="/terms" className="hover:text-green-500 transition-colors">Conditions</Link>
            
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-green-500 text-green-500 hover:text-white hover:bg-green-600">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-black border border-gray-200">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Mon Profil</Link>
                  </DropdownMenuItem>
                  {userType === 'client' && <DropdownMenuItem asChild>
                      <Link to="/reservations">Mes Réservations</Link>
                    </DropdownMenuItem>}
                  {userType === 'agency' && <>
                      <DropdownMenuItem asChild>
                        <Link to="/agency/reservations">Gérer les Réservations</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/agency/cars">Gérer les Voitures</Link>
                      </DropdownMenuItem>
                    </>}
                  <DropdownMenuItem onClick={logout}>
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <div className="flex gap-3">
                <Button asChild variant="outline" className="border-green-500 text-green-500 hover:bg-green-600 hover:text-white">
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button asChild className="bg-green-500 hover:bg-green-600 text-white border-none">
                  <Link to="/signup">Inscription</Link>
                </Button>
              </div>}
          </div>
          
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isOpen && <div className="mt-4 py-4 border-t border-gray-700 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-green-500" onClick={toggleMenu}>Accueil</Link>
              <Link to="/cars" className="hover:text-green-500" onClick={toggleMenu}>Voitures</Link>
              <Link to="/about" className="hover:text-green-500" onClick={toggleMenu}>À Propos</Link>
              <Link to="/contact" className="hover:text-green-500" onClick={toggleMenu}>Contact</Link>
              <Link to="/terms" className="hover:text-green-500" onClick={toggleMenu}>Conditions</Link>
              
              {user ? <>
                  <Link to="/profile" className="hover:text-green-500" onClick={toggleMenu}>Mon Profil</Link>
                  {userType === 'client' && <Link to="/reservations" className="hover:text-green-500" onClick={toggleMenu}>Mes Réservations</Link>}
                  {userType === 'agency' && <>
                      <Link to="/agency/reservations" className="hover:text-green-500" onClick={toggleMenu}>Gérer les Réservations</Link>
                      <Link to="/agency/cars" className="hover:text-green-500" onClick={toggleMenu}>Gérer les Voitures</Link>
                    </>}
                  <button onClick={() => {
              logout();
              toggleMenu();
            }} className="text-left hover:text-green-500">
                    Déconnexion
                  </button>
                </> : <div className="flex flex-col gap-3">
                  <Button asChild variant="outline" className="border-green-500 text-green-500 hover:bg-green-600 hover:text-white w-full">
                    <Link to="/login" onClick={toggleMenu}>Connexion</Link>
                  </Button>
                  <Button asChild className="bg-green-500 hover:bg-green-600 text-white border-none w-full">
                    <Link to="/signup" onClick={toggleMenu}>Inscription</Link>
                  </Button>
                </div>}
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;
