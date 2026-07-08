# 1. Utiliser une image de base officielle de Node.js (version 20 légère)
FROM node:20-alpine

# 2. Définir le dossier de travail à l'intérieur du conteneur
WORKDIR /app

# 3. Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# 4. Installer les dépendances du projet
RUN npm install

# 5. Copier tout le reste du code du backend dans le conteneur
COPY . .

# 6. Exposer le port sur lequel ton serveur Node écoute (le port 5000)
EXPOSE 5000

# 7. Commande pour lancer le serveur
CMD ["npm", "start"]