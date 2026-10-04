# Vitrine — direction « La fenêtre de boutique »

Mode : **Persuade** (commande WhatsApp). Palette inchangée (noir / blanc / or, tokens `--v-*`).

## Idée
Une vitrine de magasin tenue à la main : de grandes photos de pièces, des **étiquettes** comme celles accrochées aux
vêtements (nom, prix, tailles), et une affiche typographique en tête de page. Le site se lit comme on passe devant une
boutique : on s'arrête sur une pièce, on lit l'étiquette, on entre (WhatsApp).

## Ce qui change
- **Typographie** : Bricolage Grotesque en deux voix — *affiche* condensée (`wdth 75`, majuscules, serrée) uniquement pour
  le titre d'accueil et les grands chiffres ; *étiquette* en graisse 600, casse normale, pour les noms de produits et les
  titres de section. Fini le tout-majuscules gras partout.
- **Accueil** : affiche plein écran (photo + titre en bandes), rail horizontal « Nouveautés » à défilement par aimantation
  (mobile), **index des catégories** en lignes typographiques avec aperçu photo au survol (composant 21st.dev
  « Hover Image List », adapté), promos en rail, appel WhatsApp final.
- **Navigation mobile** : barre basse à 4 actions (Accueil, Catalogue, Panier, Commander) ; la barre haute se réduit au logo.
- **Carte produit** : photo 4:5, étiquette dessous ; action rapide toujours visible au tactile.
- **Fiche produit** : barre de commande collée en bas sur mobile (prix + « Commander sur WhatsApp »).

## Interdits suivis (impeccable)
Pas de sur-titre au-dessus des titres, pas de dégradé de texte, pas de ligne de chiffres « héros », pas de cartes
icône + titre + texte identiques, pas d'emoji ni de glyphes-icônes, pas de numéros de section.

## Mouvement
Un seul moment signé : l'affiche d'accueil se découvre par bandes (clip-path, 0,7 s, ease-out expo). Ailleurs : apparition
au défilement discrète, survol d'image, aimantation du rail. Tout est neutralisé sous `prefers-reduced-motion`.
