
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      toast({
        title: "Message Envoyé",
        description: "Merci! Nous vous répondrons bientôt.",
      });
    }, 1500);
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contactez-Nous</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
            Nous serions ravis d'avoir de vos nouvelles. Contactez notre équipe pour toute question ou assistance.
          </p>
        </div>
      </section>
      
      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 flex gap-4">
                    <MapPin className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-muted-foreground mt-1">
                        Faculté des Sciences de Gabès<br />
                        Gabès, Tunisie
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex gap-4">
                    <Phone className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-muted-foreground mt-1">
                        +216 71 123 456<br />
                        +216 99 789 012
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex gap-4">
                    <Mail className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground mt-1">
                        contact@carflow.com<br />
                        support@carflow.com
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex gap-4">
                    <Clock className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Heures d'ouverture</h3>
                      <p className="text-muted-foreground mt-1">
                        Lundi - Vendredi: 9:00 - 18:00<br />
                        Samedi: 10:00 - 16:00<br />
                        Dimanche: Fermé
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dès que possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="bg-green-100 rounded-full p-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Message envoyé avec succès!</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Merci de nous avoir contacté. Nous avons reçu votre message et nous vous répondrons dans les 24 heures.
                      </p>
                      <Button
                        className="mt-6 bg-green-500 hover:bg-green-600"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Nom complet <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Adresse email <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Sujet <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Notre localisation</h2>
          <div className="aspect-[16/7] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13394.116785298848!2d10.0848964!3d33.8462889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12556e1623754479%3A0x9756ae423fc4b53c!2sFacult%C3%A9%20des%20sciences%20de%20Gab%C3%A8s!5e0!3m2!1sfr!2stn!4v1713357400000!5m2!1sfr!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Questions fréquemment posées</h2>
            <p className="text-lg mt-4 text-muted-foreground max-w-2xl mx-auto">
              Trouvez des réponses aux questions courantes sur nos services de location de voitures
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quels documents sont nécessaires pour louer une voiture?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vous aurez besoin d'un permis de conduire valide, d'un passeport ou d'une carte d'identité, et d'une carte de crédit pour la caution. Le conducteur doit être âgé d'au moins 21 ans et détenir son permis depuis au moins un an.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je annuler ma réservation?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, vous pouvez annuler votre réservation gratuitement jusqu'à 24 heures avant l'heure de prise en charge prévue. Les annulations effectuées moins de 24 heures à l'avance peuvent entraîner des frais.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">L'assurance est-elle incluse dans le prix de location?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  L'assurance responsabilité civile est incluse dans le prix de location, couvrant la responsabilité envers les tiers. Nous vous recommandons de souscrire une couverture supplémentaire pour une tranquillité d'esprit totale pendant votre période de location.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puis-je prendre la voiture dans une ville et la rendre dans une autre?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Oui, nous proposons des locations aller simple entre les principales villes de Tunisie. Des frais supplémentaires peuvent s'appliquer en fonction de la distance entre les lieux de prise en charge et de restitution.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
