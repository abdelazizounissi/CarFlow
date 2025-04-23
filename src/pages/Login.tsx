import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"client" | "agency">("client");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password, accountType);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur CarFlow",
        });
        
        // Redirect based on account type
        navigate(accountType === "agency" ? "/agency/cars" : "/");
      } else {
        toast({
          title: "Échec de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container flex items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="client" onValueChange={(value) => setAccountType(value as "client" | "agency")}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="client"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Client
                </TabsTrigger>
                <TabsTrigger 
                  value="agency"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Agence
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="client">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-client">Email</Label>
                    <Input
                      id="email-client"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-client">Mot de passe</Label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)} 
                        className="text-sm text-green-600 hover:underline"
                      >
                        Mot de passe oublié?
                      </button>
                    </div>
                    <Input
                      id="password-client"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <span>Vous n'avez pas de compte? </span>
                    <Link to="/signup" className="text-green-600 hover:underline">
                      Créer un compte
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="agency">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-agency">Email professionnel</Label>
                    <Input
                      id="email-agency"
                      type="email"
                      placeholder="votre@agence.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-agency">Mot de passe</Label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Mot de passe oublié?
                      </button>
                    </div>
                    <Input
                      id="password-agency"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                  >
                    {loading ? "Connexion en cours..." : "Se connecter en tant qu'Agence"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <span>Vous représentez une agence? </span>
                    <Link to="/signup" className="text-green-600 hover:underline">
                      Inscrivez votre agence
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <ForgotPasswordDialog 
        isOpen={forgotPasswordOpen} 
        onClose={() => setForgotPasswordOpen(false)} 
      />
    </Layout>
  );
};

export default Login;
