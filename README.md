# AVEC VINCENT

Site vitrine de Vincent, professeur particulier : cours à domicile à Lyon et en visioconférence. Mathématiques, géopolitique, anglais, allemand et méthodologie du lycée à la prépa ECG ; français et philosophie au lycée uniquement.

## Fonctionnement

Site statique HTML/CSS/JavaScript, sans bibliothèque ni police distante. Publication GitHub Pages depuis la branche `main`, domaine `avecvincent.fr` défini dans `CNAME`. Conserver les adresses `.html` et les ancres existantes pour préserver les liens externes. Une page `404.html` aide le visiteur sans transformer les erreurs HTTP en faux succès.

Pour prévisualiser : `python3 -m http.server 8765`, puis ouvrir `http://127.0.0.1:8765`.

## Formulaire

`script.js` conserve le service Google Apps Script existant. L’envoi est un POST URL-encodé ; le succès nécessite une réponse JSON avec `ok: true` et une référence. Une erreur conserve les champs et propose l’e-mail direct. Le téléphone est facultatif. Le français et la philosophie ne peuvent pas être associés à la prépa.

Le destinataire est configuré côté Apps Script. Ne pas publier de coordonnées clients, factures, messages reçus ni identifiants de connexion dans ce dépôt. Les coordonnées professionnelles et l’URL publique du formulaire sont volontairement publiques.

## Contenu à maintenir

Les tarifs sont identiques sur toutes les pages. Le crédit d’impôt est conditionnel et le site indique la déclaration SAP déposée le 5 octobre 2026, dans l’attente de confirmation de l’enregistrement. Mettre à jour ce statut uniquement sur preuve. Les coordonnées du médiateur de consommation désigné devront être ajoutées aux informations légales dès qu’elles seront connues.

Le sitemap contient les cinq pages éditoriales ; les informations légales et la page 404 sont en `noindex,follow`. Le robots.txt permet leur exploration afin que les moteurs puissent lire cette directive. Les métadonnées de partage utilisent l’aperçu PNG 1200 × 630, dont le SVG source se trouve dans `images/og-preview.svg`.

## Vérification du 22 octobre 2026

Contrôles de structure, liens, ancres, métadonnées, navigation au clavier et affichage sur mobile 320/390 px et ordinateur 1280 px. Tests isolés du formulaire : préremplissage, niveau/matière, réponse confirmée, erreur HTTP/API/réseau, absence de double envoi et conservation des champs. Service réel contrôlé par GET et POST vide rejeté, sans créer de demande ni envoyer d’e-mail. La livraison d’une demande réelle n’a pas été testée.
