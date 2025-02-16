# Documentation du Frontend de l'Application de Chat

## Aperçu du Projet
Le frontend de l'application de chat est une interface utilisateur réactive qui permet aux utilisateurs d'envoyer et de recevoir des messages en temps réel. Il est développé avec **React.js** pour une expérience utilisateur fluide et dynamique, et utilise **Socket.io** pour la communication en temps réel avec le serveur.

## Stack Technologique
- **Framework Frontend :** React.js
- **Gestion d'état :** useState, useEffect, Context API
- **Communication en temps réel :** Socket.io-client
- **Requêtes HTTP :** Axios
- **Stylisation :** CSS / Tailwind CSS / Material-UI (si applicable)

## Structure du Projet
Le projet est organisé en plusieurs composants pour assurer une architecture modulaire et maintenable :

- **components/** : Contient les composants réutilisables (ex: Boutons, Modals, Formulaires)
- **pages/** : Contient les pages principales (ex: Login, Chat, Inscription)
- **services/** : Contient les fonctions pour interagir avec l'API backend
- **context/** : Gère l'état global de l'application

## Fonctionnalités Principales

### 1. Authentification
- **Inscription**
  - Route : `/register`
  - Utilisation d'un formulaire pour créer un compte utilisateur.
  - Envoi des informations via Axios au backend.

- **Connexion**
  - Route : `/login`
  - Authentification avec JWT.
  - Stockage du token dans `localStorage` ou `sessionStorage`.

### 2. Messagerie en Temps Réel
- **Connexion à Socket.io**
  - L'utilisateur se connecte à Socket.io dès qu'il est authentifié.

- **Envoi et Réception de Messages**
  - Envoi des messages via une requête POST à l'API backend.
  - Réception des messages en temps réel via Socket.io.

- **Affichage des Conversations**
  - Liste des discussions de l'utilisateur.
  - Affichage dynamique des messages.

### 3. Gestion des Utilisateurs
- **Liste des utilisateurs disponibles**
  - Récupération des utilisateurs via une requête GET.
  - Possibilité de lancer une conversation avec un utilisateur.

- **Mise à jour du profil utilisateur**
  - Modification des informations personnelles (nom, email, mot de passe).

## Installation et Exécution
### Installation
1. Cloner le dépôt :
   ```sh
   git clone <repository-url>
   cd frontend
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```

### Exécution
1. Démarrer le serveur de développement React :
   ```sh
   npm start
   ```
2. Accéder à l'application via `http://localhost:3000`

## Améliorations Futures
- Intégration des notifications en temps réel.
- Amélioration de l'UI/UX avec des animations et transitions.
- Implémentation d'un système de recherche et de filtres dans les conversations.

---
Ce document sert de référence pour comprendre l'architecture et les fonctionnalités du frontend de l'application de chat. Il peut être complété au fur et à mesure de l'évolution du projet.
