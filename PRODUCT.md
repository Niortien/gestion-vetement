# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Jeunes de 16 à 28 ans de Yopougon et d'Abidjan, qui visitent la vitrine **sur mobile** (arrivée par Instagram, TikTok ou
WhatsApp). Ils cherchent une pièce précise (basket, ensemble, accessoire), veulent voir la photo, le prix et la taille tout
de suite, puis **commandent sur WhatsApp**. Côté boutique : l'équipe de Dri Valé gère stock et caisse dans le back-office.

## Product Purpose
Dri Valé est une boutique de mode (vêtements, sneakers, accessoires) basée à Yopougon, Abidjan. Le site a deux faces : une
vitrine publique (accueil, catalogue, fiche produit, lookbook, marque) et un back-office (stock, caisse, entrées/sorties).
Objectif n°1 de la vitrine : **déclencher des commandes WhatsApp** ; objectif n°2 : faire vivre l'univers de la marque.

## Positioning
Une vraie boutique de quartier avec un vrai stock : ce qui est affiché est ce qui est en rayon à Yopougon. La signature de
la marque est « Sortez toujours bien habillé ».

## Operating Context
Connexions mobiles variables ; commande finalisée par message WhatsApp (pas de paiement en ligne sur le site) ; plusieurs
boutiques physiques (ex. Dri Valé Oasis, Dri Valé Toit Rouge) avec leur propre stock.

## Capabilities and Constraints
- Catalogue alimenté par l'API (produits, variantes taille/couleur, stock par boutique, promotions, catégories).
- Panier local + commande envoyée sur WhatsApp ; lookbook avec photos clients modérées ; thème clair/sombre.
- Next.js 14 (App Router), HeroUI, Tailwind, Framer Motion ; routes minces, composants dans `components/vitrine/`.

## Brand Commitments
- **Palette figée par le client : noir, blanc et or `#F0B429`** (tokens `--v-*` dans `app/globals.css`) — ne pas la modifier.
- Logo officiel `public/images/logo/logo.jpeg`, utilisé tel quel via `<BrandMark />`.
- Slogan : « Sortez toujours bien habillé ».

## Evidence on Hand
Photos de la boutique (`public/images/dri_style/`), vraies pièces et vrais prix via l'API. **Aucune** statistique, avis ou
note client chiffrée n'est fournie : ne pas en inventer.

## Product Principles
1. Le produit et son prix d'abord : photo, prix, taille, puis un seul geste pour commander.
2. Mobile d'abord, au pouce.
3. Dire seulement ce que la boutique peut tenir (stock réel, nouveauté réelle).
4. L'univers de la rue de Yopougon est le décor, jamais un costume.

## Accessibility & Inclusion
Contraste 4.5:1, cibles tactiles ≥ 44 px, focus visible, `prefers-reduced-motion` respecté, lecteurs d'écran (libellés sur
les boutons-icônes).
