import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { agencies } from "@/data/carData";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type: "client" | "agency";
  createdAt: Date;
}

// Define the user record type including password
interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  type: "client" | "agency";
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userType: "client" | "agency" | null;
  login: (
    email: string, 
    password: string, 
    type: "client" | "agency"
  ) => Promise<boolean>;
  register: (
    email: string, 
    password: string, 
    name: string, 
    type: "client" | "agency",
    phone?: string,
    address?: string
  ) => Promise<boolean>;
  logout: () => void;
  getUserById: (userId: string) => User | null;
  resetPassword: (email: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  signup: (
    userData: {
      name: string;
      email: string;
      phone?: string;
    },
    password: string,
    type: "client" | "agency"
  ) => Promise<boolean>;
  updateProfile: (userData: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Storage key for users
const USERS_STORAGE_KEY = "carflow_users";
// Storage key for current user
const CURRENT_USER_STORAGE_KEY = "carflow_current_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  // Initial users data with client and example agency
  const initialUsers: UserRecord[] = [
    {
      id: "c1",
      name: "John Doe",
      email: "client@example.com", 
      phone: "+216 55 123 456",
      address: "123 Avenue Habib Bourguiba, Tunis",
      password: "password", 
      type: "client",
      createdAt: new Date(2023, 0, 15)
    },
    {
      id: "a1",
      name: "Car Agency",
      email: "agency@example.com",
      phone: "+216 71 987 654",
      address: "456 Avenue Mohamed V, Sousse",
      password: "password",
      type: "agency",
      createdAt: new Date(2022, 6, 10)
    }
  ];
  
  // Add all agencies from carData.ts - use the agency's actual ID
  agencies.forEach((agency) => {
    initialUsers.push({
      id: agency.id,  // Use the actual agency ID from carData
      name: agency.name,
      email: agency.email,
      phone: agency.phone,
      address: agency.address,
      password: "admin", // All agencies have "admin" as password
      type: "agency",
      createdAt: new Date(2022, 6, 10)
    });
  });
  
  console.log("Initial agencies loaded:", initialUsers.filter(u => u.type === "agency"));
  
  // Initial state setup with localStorage persistence
  const [users, setUsers] = useState<UserRecord[]>(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      
      // Safety check to ensure users is an array
      let parsedUsers = savedUsers ? JSON.parse(savedUsers) : initialUsers;
      if (!Array.isArray(parsedUsers)) {
        console.error("Saved users data is not an array, resetting to initial state");
        return initialUsers;
      }
      
      // Make sure all agencies from carData exist in the users array
      const existingEmails = new Set(parsedUsers.map(u => u.email));
      const missingAgencies = agencies.filter(agency => !existingEmails.has(agency.email));
      
      if (missingAgencies.length > 0) {
        console.log("Adding missing agencies:", missingAgencies.map(a => a.email));
        missingAgencies.forEach((agency, index) => {
          parsedUsers.push({
            id: `ag${parsedUsers.length + index}`,
            name: agency.name,
            email: agency.email,
            phone: agency.phone,
            address: agency.address,
            password: "admin", // All agencies have "admin" as password
            type: "agency",
            createdAt: new Date(2022, 6, 10)
          });
        });
      }
      
      return parsedUsers;
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
      return initialUsers;
    }
  });
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Convert string date back to Date object
        return {
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt)
        };
      }
      return null;
    } catch (error) {
      console.error("Error loading current user from localStorage:", error);
      return null;
    }
  });
  
  const [userType, setUserType] = useState<"client" | "agency" | null>(
    () => user?.type || null
  );
  
  // Save users to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users to localStorage:", error);
    }
  }, [users]);
  
  // Save current user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error saving current user to localStorage:", error);
    }
  }, [user]);
  
  // Debug users to console
  useEffect(() => {
    if (Array.isArray(users)) {
      console.log("Available users for login:", users.map(u => ({ email: u.email, password: u.password, type: u.type })));
    } else {
      console.error("users is not an array:", users);
      // Reset users to initial data if it's not an array
      setUsers(initialUsers);
    }
  }, [users]);
  
  const login = async (
    email: string,
    password: string,
    type: "client" | "agency"
  ): Promise<boolean> => {
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Login attempt:", { email, password, type });
      console.log("Available users:", users);
      
      if (!Array.isArray(users)) {
        console.error("Users data is corrupted. Resetting to initial state.");
        setUsers(initialUsers);
        toast({
          title: "Erreur de données",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }
      
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && 
             u.password === password && 
             u.type === type
      );
      
      console.log("Found user:", foundUser);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser({
          ...userWithoutPassword,
          type: userWithoutPassword.type,
          createdAt: new Date(userWithoutPassword.createdAt)
        });
        setUserType(type);
        
        toast({
          title: "Connecté",
          description: "Bienvenue, " + foundUser.name + "!",
        });
        
        return true;
      }
      
      toast({
        title: "Échec de connexion",
        description: "Email ou mot de passe invalide",
        variant: "destructive"
      });
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const register = async (
    email: string,
    password: string,
    name: string,
    type: "client" | "agency",
    phone?: string,
    address?: string
  ): Promise<boolean> => {
    try {
      // Check if email already exists
      const userExists = users.some(u => u.email === email);
      
      if (userExists) {
        toast({
          title: "Inscription échouée",
          description: "Cet email est déjà utilisé",
          variant: "destructive"
        });
        return false;
      }
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new user
      const newUser: UserRecord = {
        id: `${type[0]}${Date.now()}`, // c12345... or a12345...
        name,
        email,
        password,
        phone,
        address,
        type: type,
        createdAt: new Date()
      };
      
      // Update users state
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      // Log in the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setUserType(type);
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue, " + name + "!",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setUserType(null);
    
    toast({
      title: "Déconnecté",
      description: "Vous avez été déconnecté avec succès",
    });
  };
  
  const getUserById = (userId: string): User | null => {
    if (!Array.isArray(users)) {
      console.error("Users data is corrupted in getUserById");
      return null;
    }
    
    const foundUser = users.find(u => u.id === userId);
    if (!foundUser) return null;
    
    // Return user without password
    const { password, ...userWithoutPassword } = foundUser;
    return {
      ...userWithoutPassword,
      type: userWithoutPassword.type as "client" | "agency",
      createdAt: new Date(userWithoutPassword.createdAt)
    };
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!Array.isArray(users)) {
        console.error("Users data is corrupted in resetPassword");
        toast({
          title: "Erreur de données",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }
      
      const userExists = users.some(u => u.email === email);
      
      if (!userExists) {
        toast({
          title: "Email non trouvé",
          description: "Aucun compte n'est associé à cet email",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Lien envoyé",
        description: "Un lien de réinitialisation a été envoyé à votre adresse email",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du lien de réinitialisation",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour mettre à jour votre profil",
          variant: "destructive"
        });
        return false;
      }

      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!Array.isArray(users)) {
        console.error("Users data is corrupted in updateUser");
        toast({
          title: "Erreur de données",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }

      // Update user in users array
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { ...u, ...userData, type: u.type } // Preserve the original type
            : u
        )
      );

      // Update current user
      setUser(prev => prev ? { ...prev, ...userData } : null);

      toast({
        title: "Profil mis à jour",
        description: "Les modifications ont été enregistrées avec succès",
      });

      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du profil",
        variant: "destructive"
      });
      return false;
    }
  };

  const signup = async (
    userData: {
      name: string;
      email: string;
      phone?: string;
    },
    password: string,
    type: "client" | "agency"
  ): Promise<boolean> => {
    return register(userData.email, password, userData.name, type, userData.phone);
  };

  const updateProfile = async (userData: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }): Promise<boolean> => {
    return updateUser(userData);
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour changer votre mot de passe",
          variant: "destructive"
        });
        return false;
      }

      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!Array.isArray(users)) {
        console.error("Users data is corrupted in updatePassword");
        toast({
          title: "Erreur de données",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }

      // Find user in users array
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        toast({
          title: "Erreur",
          description: "Utilisateur non trouvé",
          variant: "destructive"
        });
        return false;
      }

      // Check if current password is correct
      if (users[userIndex].password !== currentPassword) {
        toast({
          title: "Erreur",
          description: "Le mot de passe actuel est incorrect",
          variant: "destructive"
        });
        return false;
      }

      // Update password
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { ...u, password: newPassword } 
            : u
        )
      );

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès",
      });

      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du mot de passe",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      userType, 
      login, 
      register, 
      logout,
      getUserById,
      resetPassword,
      updateUser,
      signup,
      updateProfile,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
