# Master Barber — site vitrine

Site statique (HTML / CSS / JavaScript, sans dépendance ni build) pour le
**Salon de coiffure Master Barber**, 10 Rue Ahmed Chaouki, El Yesminet, Ben Arous.

## Structure

```
index.html            Page unique : accueil, prestations, galerie, salon, avis, contact
404.html              Page d'erreur
favicon.svg
robots.txt / sitemap.xml
assets/css/styles.css Styles (tokens de couleurs et typo en tête de fichier)
assets/js/config.js   ← LE fichier à modifier : tarifs, horaires, galerie, avant/après
assets/js/main.js     Interactions (menu, galerie, lightbox, formulaire, animations)
```

## Mettre à jour le contenu (assets/js/config.js)

| Besoin | Où |
|---|---|
| Tarifs | `prices` — ex. `"degrade": "20 DT"`. `null` affiche « Tarif en salon ». |
| Horaires | `hours` — ex. `lundi: "09:00 – 20:00"`, `dimanche: "Fermé"`. Tant que tout est `null`, le site invite à appeler. |
| Galerie | `gallery` — ajoutez vos photos (`assets/img/...`) avec un texte `alt` descriptif et une catégorie. |
| Avant / après | `beforeAfter` — paires de vraies photos d'un même client. La section apparaît automatiquement. |

**Photos :** les images actuelles sont des photos d'illustration libres de droits
(Unsplash). Remplacez-les dès que possible par les réalisations et l'intérieur
réels du salon : c'est ce qui convertit le mieux. Format conseillé : JPEG/WebP,
1600 px de large maximum, ~200 Ko.

## Formulaire de rendez-vous

Aucun serveur n'est nécessaire : le formulaire valide les champs puis ouvre
WhatsApp avec un message pré-rempli adressé au 29 030 826. Vérifiez que ce
numéro est bien actif sur WhatsApp (sinon, modifiez `business.whatsapp` et les
liens `wa.me` dans `index.html`).

## Mise en ligne

Déposez le dossier tel quel sur n'importe quel hébergeur statique
(Netlify, Vercel, GitHub Pages, OVH, cPanel…). Ensuite :

1. Remplacez `VOTRE-DOMAINE` dans `robots.txt` et `sitemap.xml`.
2. Ajoutez dans `index.html` : `<link rel="canonical" href="https://VOTRE-DOMAINE/">`
   et `<meta property="og:url" content="https://VOTRE-DOMAINE/">`.
3. Sur la fiche Google Business, revendiquez l'établissement et ajoutez
   l'adresse du site, les horaires et vos photos.

## Aperçu local

```
npx http-server -p 5520
```
