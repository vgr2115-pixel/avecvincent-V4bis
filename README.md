# AVEC VINCENT

Site vitrine de Vincent, professeur particulier : cours à domicile à Lyon et en visioconférence. Mathématiques, géopolitique, anglais, allemand et méthodologie du lycée à la prépa ECG ; français et philosophie au lycée uniquement.

## Fonctionnement

Site statique HTML/CSS/JavaScript, sans bibliothèque ni police distante. Publication GitHub Pages depuis la branche `main`, domaine `avecvincent.fr` défini dans `CNAME`. Conserver les adresses `.html` et les ancres existantes pour préserver les liens externes. Une page `404.html` aide le visiteur sans transformer les erreurs HTTP en faux succès.

Pour prévisualiser : `python3 -m http.server 8765`, puis ouvrir `http://127.0.0.1:8765`.

## Formulaire

`script.js` conserve le service Google Apps Script existant. L’envoi est un POST URL-encodé ; le succès nécessite une réponse JSON avec `ok: true` et une référence. Une erreur conserve les champs et propose l’e-mail direct. Le formulaire présente uniquement trois champs obligatoires : nom, e-mail et message. La classe et la matière sont demandées dans le texte d’aide, sans menu supplémentaire. Le service existant exige encore les clés `level` et `subject` : `level` vaut explicitement « Voir le message » ; `subject` conserve la matière du lien entrant ou vaut « Premier contact ». Aucune classe n’est déduite.

Le destinataire est configuré côté Apps Script. Ne pas publier de coordonnées clients, factures, messages reçus ni identifiants de connexion dans ce dépôt. Les coordonnées professionnelles et l’URL publique du formulaire sont volontairement publiques.

## Contenu à maintenir

Les tarifs sont identiques sur toutes les pages. Le crédit d’impôt est présenté avec son taux de 50 % et les montants après avantage fiscal. Les notes précisent l’enregistrement SAP et les conditions ; le détail administratif figure dans la FAQ fiscale et les mentions légales. La déclaration a été déposée le 5 octobre 2026, son enregistrement reste en cours. L’effet au dépôt est lié au dossier complet et à la date retenue sur le récépissé. Mettre à jour ce statut uniquement sur preuve. Les coordonnées du médiateur de consommation désigné devront être ajoutées aux informations légales dès qu’elles seront connues.

Le sitemap contient les cinq pages éditoriales ; les informations légales et la page 404 sont en `noindex,follow`. Le robots.txt permet leur exploration afin que les moteurs puissent lire cette directive. Les métadonnées de partage utilisent des PNG 1200 × 630 propres à l’accueil, aux cours, à la méthode, au contact et au crédit d’impôt. Les sources SVG sont dans `images/og-*.svg`. Les icônes navigateur et iPhone partagent le même V bleu ; `tools/build-brand-assets.cjs` régénère les PNG et le fichier ICO avec `sharp`. Le manifeste reste en mode navigateur, sans service worker.

## Vérification du 22 octobre 2026

Contrôles de structure, liens, ancres, métadonnées, navigation au clavier et affichage sur mobile 320/390 px et ordinateur 1280 px. Tests isolés du formulaire : préremplissage, niveau/matière, réponse confirmée, erreur HTTP/API/réseau, absence de double envoi et conservation des champs. Service réel contrôlé par GET et POST vide rejeté, sans créer de demande ni envoyer d’e-mail. La livraison d’une demande réelle n’a pas été testée.

## Interactions
Les matières, FAQ et navigation ont des mouvements distincts. Les disclosures natifs sont améliorés avec une animation de hauteur interrompable ; le contenu qui se ferme devient inaccessible au clavier jusqu’à sa réouverture. Le groupe natif reste disponible sans JavaScript, tandis que le script gère l’exclusivité pour permettre les transitions de fermeture. La préférence de réduction des animations et l’absence d’API déclenchent une bascule immédiate.

## Dernière revue locale

La revue du 22 octobre 2026 vérifie les sept pages à 320, 375, 390, 430, 700, 844 paysage et 1280 px ; les liens, ancres, métadonnées, prix, périmètres lycée/prépa et données structurées ; les menus, liens de matière et l’accès au clavier. Le lien d’évitement cible un contenu principal focalisable. Les données structurées décrivent le professeur, les services et les prix réellement réglés par heure, sans présenter les prix après crédit d’impôt comme les tarifs facturés.

Le formulaire conserve trois champs visibles. Les contrôles isolés vérifient les erreurs et les confirmations ; le service répond au GET de disponibilité. Cela ne prouve pas la livraison d’un e-mail réel. Aucune nouvelle soumission réelle n’a été effectuée pendant cette revue. Le rendu local n’est pas une publication : les aperçus de partage et les changements SEO ne peuvent être utilisés par les moteurs qu’une fois la version correspondante mise en ligne.
