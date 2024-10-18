# Tx Manager

Tx Manager est un module de transactions permettant de créer et de programmer des transactions développé avec Next.js tant pour l'interface utilisateur que pour les API Routes.

Garder la logique au sein d'une même app permet une meilleure integration du frontend avec le backend. Le framework permet également d'exposer l'api à d'éventuels autres services qui voudraient l'exploiter. Nous simlpifions ainsi la structure du projet en centralisant la logique de routage, les types TypeScript, la validation des données et certaines autres fonctionnalités au sein d'une même codebase.

## Installation

Avant de commencer, assurez-vous d'avoir Docker & Docker Compose installés sur votre machine

### Cloner le repo

```bash
git clone git@github.com:DavNej/tx-manager.git
cd tx-manager
```

### Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet et configurez les variables nécessaires en accord avec le fichier `.env.example` . Adaptez les informations selon votre configuration.

### Lancement de l'Application et de ses services

L'application utilise plusieurs services à savoir:

* Une base de données Postgres (persistance des donnéees)
* Un scheduler (pour la gestion des tâches planifiées avec BullMQ)
* Un Redis (utilisé par le scheduler)

Afin de tous les démarrer, utilisez la commande suivante :

```bash
docker compose up -d
```

Cela peut prendre quelques minutes

Vous pouvez désormais visiter l'url [http://localhost:3000](http://localhost:3000)

### Population de la base de données

Effectuer une requête `POST` sur le endpoint `/transactions/seed` afin d'insérer de nouvelles transactions dans la base de données. Le body de la requête est de la forme `{ count : '<tx_count>' }`

```bash
curl -X POST http://localhost:3000/api/transactions/seed -H "Content-Type: application/json" -d '{"count":30}'
```

## Technologies et Librairies

* **Next.js** : framework principal pour l'interface et l'API
* **Drizzle** : ORM et gestion de la base de données Postgres
* **Zod** : validation des données
* **BullMQ** : la gestion des transactions programmées
* **Server Actions** : gestion côté serveur plus performante
* **React Hook Form** : gestion des formulaires avec validation
* **Tanstack Query** : gestion des requêtes asynchrones et du cache côté client
* **Sentry** : error tracking tool
* **Playwright** : End to end testing
* **Jest** : Unit testing framework testing
