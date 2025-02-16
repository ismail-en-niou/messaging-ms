# Documentation du Backend de l'Application de Chat

## Aperçu du Projet
Le **serveur** est le backend d'une application de chat en temps réel qui permet aux utilisateurs d'envoyer et de recevoir des messages instantanément. Il utilise **Express.js** pour le serveur, **Socket.io** pour la communication en temps réel et **MongoDB** comme base de données. L'authentification est gérée via **JWT (JSON Web Tokens)** pour un accès sécurisé.

## Stack Technologique
- **Version de Node.js :** v21.6.2
- **Version d'Express.js :** ^4.21.2
- **Base de données :** MongoDB
- **Méthode d'authentification :** JWT (JSON Web Token)
- **Communication en temps réel :** Socket.io

## Points de Terminaison de l'API
### 1. Routes Utilisateur
- **Enregistrer un utilisateur**
  - **Route :** `POST /api/v1/users/register`
  - **Description :** Enregistre un nouvel utilisateur.
  - **Corps de la requête :** JSON contenant `username`, `email` et `password`.
  - **Réponse :** Message de succès et détails de l'utilisateur.

- **Connexion de l'utilisateur**
  - **Route :** `POST /api/v1/users/login`
  - **Description :** Authentifie un utilisateur.
  - **Corps de la requête :** JSON contenant `email` et `password`.
  - **Réponse :** Jeton JWT après authentification réussie.

- **Trouver un utilisateur par ID**
  - **Route :** `GET /api/v1/users/find/:userId`
  - **Description :** Récupère les détails d'un utilisateur par ID.

- **Obtenir tous les utilisateurs**
  - **Route :** `GET /api/v1/users/`
  - **Description :** Récupère une liste de tous les utilisateurs.

- **Vérification de l'utilisateur**
  - **Route :** `POST /api/v1/users/verification`
  - **Description :** Génère un code de vérification.

- **Soumettre un code de vérification**
  - **Route :** `POST /api/v1/users/verification-code`
  - **Description :** Vérifie le code de vérification soumis.

### 2. Routes des Messages
- **Envoyer un message**
  - **Route :** `POST /api/v1/messages/`
  - **Description :** Crée un nouveau message de chat.
  - **Corps de la requête :** JSON contenant `chatId`, `senderId` et `text`.

- **Obtenir les messages d'un chat**
  - **Route :** `GET /api/v1/messages/:chatId`
  - **Description :** Récupère les messages d'un chat spécifique.

### 3. Routes des Chats
- **Créer un chat**
  - **Route :** `POST /api/v1/chat/create`
  - **Description :** Crée un nouveau chat entre utilisateurs.
  - **Corps de la requête :** JSON contenant un tableau de `members`.

- **Trouver les chats d'un utilisateur**
  - **Route :** `GET /api/v1/chat/user/:userId`
  - **Description :** Récupère tous les chats associés à un utilisateur.

- **Trouver un chat entre deux utilisateurs**
  - **Route :** `GET /api/v1/chat/:firstId/:secondId`
  - **Description :** Récupère le chat entre deux utilisateurs spécifiques.

## Modèles de Base de Données
### 1. Modèle Utilisateur
```javascript
const userSchema = new Schema({
    id: { type: String },
    username: { type: String, minlength: 3, maxlength: 20, required: true },
    email: { type: String, minlength: 3, maxlength: 200, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, maxlength: 200 },
    verifiy: { type: Boolean, default: false },
    verificationCode: { type: String },
    codeExpiresAt: { type: Date }
}, { timestamps: true });
```

### 2. Modèle Chat
```javascript
const chatSchema = new Schema({
    members: [String]
}, { timestamps: true });
```

### 3. Modèle Message
```javascript
const messageshema = new Schema({
    chatId: String,
    sendeId: String,
    text: String
}, { timestamps: true });
```

## Middleware
Aucun middleware personnalisé n'a été spécifié.

## Variables d'Environnement
Les variables d'environnement suivantes sont requises pour l'application :
- (Non spécifiées dans les détails fournis, ajoutez les variables pertinentes si nécessaire.)

## Hébergement
- **Fournisseur d'hébergement :** AWS

## Considérations de Sécurité
- **CORS (Cross-Origin Resource Sharing) :** Implémenté pour contrôler l'accès à l'API depuis différentes origines.

## Installation et Déploiement
### Installation
1. Cloner le dépôt :
   ```sh
   git clone <repository-url>
   cd server
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Configurer les variables d'environnement dans un fichier `.env`.
4. Démarrer le serveur :
   ```sh
   npm start
   ```

## Améliorations Futures
- Ajouter plus de points d'API pour la messagerie, l'authentification des utilisateurs et les salons de discussion.
- Mettre en place une limitation du débit pour la sécurité.
- Améliorer la gestion des erreurs et la journalisation.

---
Ce document sert de référence de base pour la configuration et la compréhension des fonctionnalités du backend. Il peut être complété avec des détails et des fonctionnalités supplémentaires si nécessaire.

