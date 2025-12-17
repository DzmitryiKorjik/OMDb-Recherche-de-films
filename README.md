# OMDb – Recherche de films

## Description

Cette application web permet de rechercher des films à partir de leur titre en utilisant l’API **OMDb (Open Movie Database)**.
Les résultats sont affichés sous forme de cartes contenant l’affiche, le titre, l’année et une description courte.

## Fonctionnalités

-   Recherche de films par titre
-   Appel API avec `fetch` et gestion des Promises
-   Affichage des résultats sous forme de cartes
-   Image par défaut si l’affiche est absente ou invalide
-   Description tronquée à 140 caractères avec option **“Lire la suite / Réduire”**
-   Message affiché en cas d’absence de résultats
-   Recherche possible via le bouton ou la touche **Entrée**

## Technologies utilisées

-   HTML5
-   CSS3
-   JavaScript (ES6)
-   API OMDb

## Structure du projet

```
/
├── scripts
|    └──script.js
├── styles
|    └──style.css
├── img/
|     └── no-poster.png
├── index.html
└── README.md

```

## API utilisée

-   URL : [https://www.omdbapi.com/](https://www.omdbapi.com/)
-   Requêtes :

    -   Recherche : `?s=title`
    -   Détails : `?i=imdbID&plot=short`

## Remarques

-   Certaines affiches fournies par l’API peuvent être indisponibles (404).
    Une image locale est utilisée par défaut pour garantir l’affichage.
-   Les descriptions complètes ne sont pas toujours disponibles pour tous les contenus (bonus, documentaires).

## Auteur

Projet réalisé dans un cadre pédagogique pour l’apprentissage de :

-   la manipulation du DOM
-   les appels API
-   la gestion des événements
-   l’asynchronisme en JavaScript
