# Chat App - README

## Introduction
Chat App est une application de messagerie en temps réel permettant aux utilisateurs de communiquer instantanément via des messages. Ce projet est construit avec **React** pour le frontend et **Express.js avec Socket.io** pour le backend. L'application utilise **MongoDB** pour le stockage des données et **JWT** pour l'authentification sécurisée.

## Stack Technologique
### Frontend
- **React.js** (Framework JavaScript pour l'interface utilisateur)
- **Tailwind CSS** (Pour le stylisme)
- **Axios** (Pour les requêtes API)
- **Socket.io-client** (Pour la communication en temps réel)

### Backend
- **Node.js** (Runtime JavaScript)
- **Express.js** (Framework backend léger)
- **MongoDB** (Base de données NoSQL)
- **Mongoose** (ODM pour MongoDB)
- **JWT (JSON Web Tokens)** (Authentification sécurisée)
- **Socket.io** (Communication en temps réel)
- **CORS** (Gestion des accès cross-origin)

### Déploiement & Conteneurisation
- **Docker** (Conteneurisation de l'application backend et de la base de données)
- **AWS** (Hébergement de l'application)

## Installation et Configuration
### Prérequis
- Node.js installé (`>= v14` recommandé)
- MongoDB installé et configuré
- Docker (optionnel pour la conteneurisation)

### Installation Backend
1. Cloner le projet :
   ```sh
   git clone <repository-url>
   cd messaging-ms/server
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Configurer les variables d'environnement :
   Créez un fichier `.env` et ajoutez les valeurs requises (exemple ci-dessous) :
   ```env
   MONGO_URI=mongodb://localhost:27017/chatApp
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. Démarrer le serveur :
   ```sh
   npm start
   ```

### Installation Frontend
1. Aller dans le dossier frontend :
   ```sh
   cd ../client
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Démarrer le serveur React :
   ```sh
   npm start
   ```

### Utilisation avec Docker
1. Construire et exécuter les conteneurs :
   ```sh
   docker-compose up --build
   ```
2. Arrêter les conteneurs :
   ```sh
   docker-compose down
   ```

## Fonctionnalités Principales
✅ Inscription et connexion des utilisateurs via JWT  
✅ Messagerie en temps réel avec **Socket.io**  
✅ Création et gestion des discussions  
✅ Sécurité renforcée avec **CORS** et authentification JWT  
✅ Interface utilisateur moderne et intuitive  
✅ Support de la conteneurisation avec **Docker**  

## Architecture du Projet
```
 messaging-ms/
 ├── server/ (Backend avec Express.js)
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── socket/
 │   ├── server.js
 │   ├── .env
 │   ├── package.json
 │
 ├── client/ (Frontend avec React.js)
 │   ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── App.js
 │   ├── index.js
 │
 ├── docker-compose.yml
 ├── README.md
```

## Déploiement
Le projet est conçu pour être déployé sur **AWS**, **VPS** ou tout autre fournisseur cloud. Vous pouvez utiliser **Docker** pour une installation rapide et reproductible.

## Améliorations Futures
🚀 Ajouter la gestion des notifications en temps réel  
🚀 Implémenter les appels audio/vidéo  
🚀 Optimiser les performances du backend et du frontend  
🚀 Ajouter un support multilingue  

---

💡 **Contributeurs :** Merci de suivre les bonnes pratiques de développement et d’ouvrir une PR (Pull Request) pour toute contribution !

📧 **Contact :** Pour toute question ou suggestion, contactez-nous via [ismail.enniou@gmail.com](mailto:ismail.enniou@gmail.com).

