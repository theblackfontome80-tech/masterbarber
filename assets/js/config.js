/* ==========================================================================
   MASTER BARBER — FICHIER DE CONFIGURATION
   --------------------------------------------------------------------------
   C'est le SEUL fichier à modifier pour mettre à jour le site :
   tarifs, horaires, photos de la galerie, avant/après.
   Les informations ci-dessous proviennent de la fiche Google Maps du salon.
   ========================================================================== */

window.MB_CONFIG = {
  business: {
    name: "Salon de coiffure Master Barber",
    phoneDisplay: "29 030 826",
    phoneIntl: "+21629030826",        // utilisé pour le lien « Appeler »
    whatsapp: "21629030826",          // numéro WhatsApp, format international sans « + »
    address: "10 Rue Ahmed Chaouki, El Yesminet, Ben Arous",
    mapsUrl: "https://maps.app.goo.gl/tJL4CfiGog7XBjWE6",
    rating: "5,0",
    reviewCount: 10
  },

  /* ---------------- TARIFS ----------------
     Indiquez le prix tel qu'il doit s'afficher, ex. "25 DT" ou "dès 20 DT".
     Laissez null pour afficher « Tarif en salon ». */
  prices: {
    "coupe-classique": null,
    "degrade":         null,
    "ciseaux":         null,
    "barbe":           null,
    "coupe-barbe":     null,
    "contours":        null
  },

  /* ---------------- HORAIRES ----------------
     Aucun horaire n'est publié sur la fiche Google : à compléter.
     Format : "09:00 – 20:00", "Fermé", ou null (non renseigné).
     Tant que TOUS les jours sont null, le site invite à appeler le salon. */
  hours: {
    lundi:    null,
    mardi:    null,
    mercredi: null,
    jeudi:    null,
    vendredi: null,
    samedi:   null,
    dimanche: null
  },

  /* ---------------- GALERIE ----------------
     category : "degrades" | "coupes" | "barbes" | "salon"
     src : URL d'image (ou chemin local, ex. "assets/img/galerie/fade-01.jpg").
     Les images Unsplash sont des photos d'illustration : remplacez-les
     dès que possible par les réalisations du salon. */
  gallery: [
    /* --- Photos réelles du salon --- */
    { src: "assets/img/salon/degrade-coiffage-peigne.webp", alt: "Dégradé et coiffage au peigne réalisés chez Master Barber", category: "degrades", tall: true },
    { src: "assets/img/salon/degrade-boucles-motif.webp", alt: "Cheveux bouclés, dégradé bas et motif tracé à la tondeuse chez Master Barber", category: "degrades", tall: true },
    { src: "assets/img/salon/barbier-tondeuse.webp", alt: "Le barbier de Master Barber au travail à la tondeuse", category: "salon", tall: true },
    { src: "assets/img/salon/facade-master-barber.webp", alt: "Façade du salon Master Barber à El Yesminet, Ben Arous", category: "salon", tall: true },
    /* --- Photos d'illustration (Unsplash) : à remplacer progressivement --- */
    { src: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8", alt: "Dégradé net avec raie tracée, vue de profil", category: "degrades", tall: true },
    { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a", alt: "Finition d'un dégradé au rasoir près de l'oreille", category: "degrades" },
    { src: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5", alt: "Coupe aux ciseaux sur cheveux mi-longs", category: "coupes" },
    { src: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186", alt: "Taille de barbe aux ciseaux en noir et blanc", category: "barbes", tall: true },
    { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70", alt: "Intérieur d'un barber shop avec fauteuils et miroirs", category: "salon" },
    { src: "https://images.unsplash.com/photo-1567894340315-735d7c361db0", alt: "Dégradé sur cheveux bouclés en cours de réalisation", category: "degrades" },
    { src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c", alt: "Coupe moderne texturée sur le dessus", category: "coupes", tall: true },
    { src: "https://images.unsplash.com/photo-1596728325488-58c87691e9af", alt: "Rasage et entretien de barbe au rasoir", category: "barbes" },
    { src: "https://images.unsplash.com/photo-1512690459411-b9245aed614b", alt: "Fauteuil de barbier en cuir", category: "salon" },
    { src: "https://images.unsplash.com/photo-1647140655214-e4a2d914971f", alt: "Contours précis au peigne et aux ciseaux", category: "coupes" },
    { src: "https://images.unsplash.com/photo-1532710093739-9470acff878f", alt: "Barbe travaillée, profil en noir et blanc", category: "barbes" },
    { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033", alt: "Outils du barbier : tondeuse, ciseaux, peigne", category: "salon" }
  ],

  /* ---------------- AVANT / APRÈS ----------------
     Ajoutez ici de VRAIES paires de photos du même client.
     La section reste masquée tant que la liste est vide.
     Exemple :
     { before: "assets/img/avant-apres/client1-avant.jpg",
       after:  "assets/img/avant-apres/client1-apres.jpg",
       label:  "Dégradé américain + barbe" } */
  beforeAfter: []
};
