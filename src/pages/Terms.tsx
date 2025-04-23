
import Layout from "@/components/layout/Layout";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-carflow">Conditions Générales</h1>
          <p className="text-muted-foreground mb-8">
            Dernière mise à jour: 16 Avril, 2025
          </p>

          <Separator className="my-6" />

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-foreground mb-4">
                Bienvenue sur CarFlow, un service de location de voitures exploité par trois étudiants universitaires de la Faculté des Sciences de Gabès. 
                Ces Conditions Générales régissent votre utilisation de notre site web et de nos services.
              </p>
              <p className="text-foreground">
                En accédant à notre site web et en utilisant nos services, vous acceptez ces Conditions Générales dans leur intégralité. 
                Si vous n'êtes pas d'accord avec ces Conditions Générales ou une partie de celles-ci, vous ne devez pas utiliser notre site web ou nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Conditions de Location</h2>
              <div className="space-y-4">
                <p className="text-foreground">
                  2.1. <span className="font-medium">Éligibilité:</span> Pour louer un véhicule, vous devez avoir au moins 21 ans et posséder un permis de conduire valide.
                </p>
                <p className="text-foreground">
                  2.2. <span className="font-medium">Réservation:</span> Les réservations sont soumises à la disponibilité des véhicules. Nous recommandons de réserver à l'avance.
                </p>
                <p className="text-foreground">
                  2.3. <span className="font-medium">Paiement:</span> Un paiement intégral ou un acompte peut être requis au moment de la réservation. Les méthodes de paiement acceptées comprennent la carte de crédit et l'espèce.
                </p>
                <p className="text-foreground">
                  2.4. <span className="font-medium">Annulation:</span> Les annulations effectuées 24 heures ou plus avant la période de location n'entraînent aucun frais. Les annulations tardives peuvent entraîner des frais partiels.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Utilisation du Véhicule</h2>
              <div className="space-y-4">
                <p className="text-foreground">
                  3.1. <span className="font-medium">Conducteurs autorisés:</span> Seules les personnes inscrites sur le contrat de location peuvent conduire le véhicule.
                </p>
                <p className="text-foreground">
                  3.2. <span className="font-medium">Utilisation interdite:</span> Les véhicules ne peuvent pas être utilisés pour la course, le tout-terrain, le remorquage ou toute activité illégale.
                </p>
                <p className="text-foreground">
                  3.3. <span className="font-medium">Restrictions géographiques:</span> Les véhicules doivent rester en Tunisie sauf autorisation explicite contraire.
                </p>
                <p className="text-foreground">
                  3.4. <span className="font-medium">État de retour:</span> Les véhicules doivent être rendus dans le même état que lors de la réception, sauf pour l'usure normale.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Assurance et Responsabilité</h2>
              <div className="space-y-4">
                <p className="text-foreground">
                  4.1. <span className="font-medium">Assurance de base:</span> Une assurance de base est incluse avec toutes les locations, couvrant la responsabilité civile.
                </p>
                <p className="text-foreground">
                  4.2. <span className="font-medium">Couverture supplémentaire:</span> Des options de couverture supplémentaires peuvent être achetées au moment de la location.
                </p>
                <p className="text-foreground">
                  4.3. <span className="font-medium">Responsabilité des dommages:</span> Le locataire est responsable des dommages non couverts par l'assurance.
                </p>
                <p className="text-foreground">
                  4.4. <span className="font-medium">Déclaration d'accident:</span> Tous les accidents doivent être signalés immédiatement à CarFlow et à la police.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Politique de Confidentialité</h2>
              <div className="space-y-4">
                <p className="text-foreground">
                  5.1. <span className="font-medium">Collecte de données:</span> Nous collectons les informations personnelles nécessaires aux services de location.
                </p>
                <p className="text-foreground">
                  5.2. <span className="font-medium">Utilisation des données:</span> Vos informations sont utilisées pour traiter les locations, améliorer les services et communiquer avec vous.
                </p>
                <p className="text-foreground">
                  5.3. <span className="font-medium">Partage de données:</span> Nous ne partageons pas vos informations avec des tiers non affiliés, sauf si la loi l'exige.
                </p>
                <p className="text-foreground">
                  5.4. <span className="font-medium">Sécurité des données:</span> Nous mettons en œuvre des mesures pour protéger vos informations personnelles.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Modifications des Conditions</h2>
              <p className="text-foreground">
                CarFlow se réserve le droit de modifier ces Conditions Générales à tout moment. 
                Les modifications seront effectives immédiatement après leur publication sur le site web. 
                L'utilisation continue de nos services après les modifications constitue une acceptation des conditions modifiées.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Informations de Contact</h2>
              <p className="text-foreground">
                Si vous avez des questions concernant ces Conditions Générales, veuillez nous contacter à:
              </p>
              <address className="not-italic mt-2 text-foreground">
                <strong>CarFlow</strong><br />
                Faculté des Sciences de Gabès<br />
                Gabès, Tunisie<br />
                Email: contact@carflow.tn<br />
                Téléphone: +216 XX XXX XXX
              </address>
            </section>
          </div>

          <Separator className="my-6" />
          
          <div className="text-center text-muted-foreground">
            <p>© 2025 CarFlow. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
