# Akiba 📱

    Akiba     est une application web de gestion financière et de suivi de comptabilité journalière conçue pour les gérants de kiosques au Gabon. Elle permet de suivre les flux de caisse quotidiens et de calculer automatiquement les écarts.

L'interface utilisateur (Frontend) est entièrement personnalisée aux couleurs officielles d'    Airtel Gabon     (Rouge Airtel) pour offrir une expérience utilisateur familière et intuitive.

   

     🏗️ Architecture Technique (Stack MERN)

L'application est construite sur une architecture moderne, découplée et prête pour le cloud :

*     Frontend :     Interface fluide et responsive développée avec     React     (Vite), configurée pour être hébergée sur     Vercel    .
*     Backend :     Serveur API développé avec     Node.js     et     Express    , configuré avec le middleware `cors` pour l'interconnexion. Prévu pour être conteneurisé avec     Docker     et hébergé sur     Render    .
*     Base de données :     Stockage sécurisé et persistant sur     MongoDB Atlas     (Cloud).

   

     🚀 Fonctionnalités Actuelles

*     Formulaire Airtel personnalisé :     Saisie des données de caisse (Nom du Kiosque, Solde Airtel Money, Solde Moov Money / Express, Solde Espèces, Montant Attendu Théorique, Notes).
*     Calcul d'écarts :     Logique métier backend prête pour le calcul automatisé des écarts financiers (en plus ou en moins).
*     Persistance Cloud :     Connexion locale validée et pleinement fonctionnelle vers le cluster MongoDB Atlas.

   

      État d'avancement & Prochaines étapes

    # Déjà réalisé
* Environnement de développement Linux configuré sous     Ubuntu 24.04 LTS (WSL2)    .
* Initialisation et interconnexion de la structure `/frontend` et `/backend`.
* Nettoyage des styles CSS conflictuels pour une visibilité optimale de la saisie.
* Versioning local et sauvegarde réussie sur le dépôt distant GitHub (`AkeleNguema/akiba`).

    #  En cours / À faire
1. Création du fichier de configuration `Dockerfile` pour le serveur Node.js.
2. Déploiement de l'API Backend sur Render.
3. Déploiement de l'Interface Frontend sur Vercel.

   

     📦 Lancement en Développement Local

    # Démarrage du Backend
```bash
cd backend
npm install
# Assurez-vous d'avoir votre fichier .env configuré avec votre MONGO_URI
npm run dev
