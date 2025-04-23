
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">À Propos de CarFlow</h1>
          <p className="text-xl text-muted-foreground">
            Une nouvelle façon de louer des voitures en Tunisie
          </p>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
          <p className="mb-4">
            CarFlow est une plateforme de location de voitures en version bêta actuellement en construction. Développée par des étudiants de la Faculté des Sciences de Gabès, cette plateforme vise à révolutionner le secteur de la location de voitures en Tunisie en offrant une expérience utilisateur fluide et moderne.
          </p>
          <p className="mb-4">
            Notre mission est de connecter les agences de location locales avec des clients à la recherche de solutions de mobilité flexibles et abordables. Nous nous efforçons de simplifier le processus de location de voitures tout en offrant un service personnalisé et de qualité.
          </p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
            <p className="font-medium">Note importante :</p>
            <p>Ce site est actuellement en version bêta et en cours de développement. Certaines fonctionnalités peuvent être limitées ou en cours d'implémentation.</p>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Notre Équipe</h2>
          <p className="mb-4">
            CarFlow est un projet développé par une équipe d'étudiants passionnés de la Faculté des Sciences de Gabès, sous la supervision de leurs professeurs. Notre équipe combine des compétences en développement web, design d'interface utilisateur, et gestion de projet pour créer une plateforme innovante et fonctionnelle.
          </p>
          <p>
            Nous travaillons continuellement à améliorer notre service en nous basant sur les retours des utilisateurs et les dernières technologies disponibles.
          </p>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <div className="text-center">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Nous cherchons constamment à innover et à améliorer notre plateforme pour offrir une expérience utilisateur exceptionnelle.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Communication</h3>
              <p className="text-muted-foreground">
                Nous valorisons une communication transparente avec nos clients et partenaires pour construire des relations de confiance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M6 18h8" />
                  <path d="M3 22h18" />
                  <path d="M14 22a7 7 0 1 0 0-14h-1" />
                  <path d="M9 14h2" />
                  <path d="M9 12a2 2 0 0 1 2-2c2.4 0 2.4 6 4.8 6 .9 0 1.6-.6 2-1.3" />
                  <path d="M12 22v-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité</h3>
              <p className="text-muted-foreground">
                Nous nous engageons à offrir un service de qualité supérieure en collaborant avec des agences de location fiables.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button className="bg-green-500 hover:bg-green-600" size="lg" onClick={() => navigate("/contact")}>
            Contactez-nous
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default About;
