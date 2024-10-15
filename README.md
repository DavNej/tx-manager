# Tx Manager

Tx Manager est un module de transactions permettant de créer et de programmer des transactions développé avec Next.js tant pour l'interface utilisateur que pour les API Routes.

Garder la logique au sein d'une même app permet une meilleure integration du frontend avec le backend. Le framework permet également d'exposer l'api à d'éventuels autres services qui voudraient l'exploiter. Nous simlpifions ainsi la structure du projet en centralisant la logique de routage, les types TypeScript, la validation des données et certaines autres fonctionnalités au sein d'une même codebase.

## Installation

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

* Docker & Docker Compose
* Node.js (v20 ou plus récent)
* pnpm : pour la gestion des paquets.

### Cloner le repo

```bash
git clone git@github.com:DavNej/tx-manager.git
cd tx-manager
```

### Installer les dépendances

Utilisez `pnpm` pour installer les dépendances du projet

```bash
pnpm install
```

### Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet et configurez les variables nécessaires en accord avec le fichier `.env.example` . Adaptez les informations selon votre configuration.

### Lancer les services

L'application utilise une base de données Postgres et un service Redis pour la gestion des tâches planifiées (scheduling) avec BullMQ. Pour démarrer ces services, utilisez la commande suivante :

```bash
docker-compose up -d
```

### Lancement du worker

Pour la programmation de transactions, nous devons lancer le worker dans un terminal avec la commande suivante:

```bash
pnpm worker:run
```

### Lancement de l'Application

Dans un autre terminal, nous générerons un build optimisé pour la production puis lançons l'app en executant les commandes suivantes:

```bash
pnpm build
pnpm start
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
