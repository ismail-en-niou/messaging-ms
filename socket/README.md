## Configuration de Socket.io
Le frontend utilise **Socket.io-client** pour la communication en temps réel avec le backend.
### Connexion au serveur Socket.io
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connecté au serveur Socket.io");
});
```
### Envoi et réception de messages
```javascript
socket.emit("sendMessage", { senderId, recipientId, text });

socket.on("receiveMessage", (message) => {
    console.log("Message reçu :", message);
});
```

## Conteneurisation avec Docker
Le frontend peut être conteneurisé à l'aide de **Docker** pour une gestion facile du déploiement.
### Création du Dockerfile
Créer un fichier `Dockerfile` à la racine du projet frontend :
```Dockerfile
# Utiliser une image de base Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]
```
### Construction et exécution du conteneur
1. **Construire l'image Docker**
   ```sh
   docker build -t chat-frontend .
   ```
2. **Exécuter le conteneur**
   ```sh
   docker run -p 3000:3000 chat-frontend
   ```

## Améliorations Futures
- Ajout de WebRTC pour les appels vidéo/audio
- Optimisation des performances et réduction de la latence
- Ajout de tests unitaires et de bout en bout pour garantir la fiabilité de l'application

---
Ce document sert de guide de référence pour la configuration et l'utilisation du frontend de l'application de chat, y compris l'intégration de Socket.io et Docker.

