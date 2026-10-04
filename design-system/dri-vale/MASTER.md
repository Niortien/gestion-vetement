# Dri Valé — Design System (Master)

> Source de vérité visuelle : le **logo** (`public/images/logo/logo.jpeg`) — blanc sur noir, sans couleur d'accent.
> Le logo est utilisé tel quel (`<BrandMark />` : le JPEG sert de masque de luminance, aucun fichier dérivé), jamais redessiné.

## 1. Identité tirée du logo

| Élément du logo | Traduction dans l'interface |
|---|---|
| Noir profond du fond | `--color-accent` en clair (boutons, barre latérale), `--v-bg` sur la vitrine sombre |
| Blanc des lettres | `--color-accent` en sombre, `--v-gold` (accent) sur la vitrine sombre, texte principal |
| Étoiles qui montent | Motif de progression : jauges, rangs, « Nouveau » |
| Signature « Sortez toujours bien habillé » | Slogan des écrans d'accueil et de connexion |

Aucune couleur de marque n'est inventée : l'interface est **noir / blanc / gris chauds**. Les seules couleurs présentes
portent un **sens fonctionnel** (jamais décoratif) : vert = entrée / succès, rouge = sortie / erreur / promo / rupture,
ambre = retour / avertissement, violet = caisse / argent.

Règle `AGENTS.md` « pas de noir dominant » : le noir pur reste réservé à la **marque** (barre latérale, boutons, logo) ;
les surfaces de travail sont blanches (clair) ou graphite `#111113` (sombre).

## 2. Tokens (`app/globals.css`)

| Rôle | Clair | Sombre |
|---|---|---|
| Fond app | `#F6F6F5` | `#111113` |
| Surface | `#FFFFFF` | `#19191C` |
| Accent / CTA | `#0C0C0E` (texte `#FFFFFF`) | `#F5F5F4` (texte `#0C0C0E`) |
| Barre latérale | `#0C0C0E` | `#08080A` |
| Vitrine | fond `#F6F6F5`, accent `#0C0C0E` | fond `#0C0C0E`, accent `#FFFFFF` |
| Rouge d'urgence (vitrine) | `#D61F36` | `#FF4D5E` |

Texte sur un aplat d'accent : toujours `text-on-accent` (back-office) ou `var(--v-on-gold)` (vitrine) — jamais `white`/`black`
en dur, l'accent change de valeur selon le thème.

## 3. Typographie

Titres : Bricolage Grotesque (600–800) · Corps : DM Sans · Données : JetBrains Mono (`tabular-nums`).

## 4. Mouvement

Une animation = une cause (apparition d'une page, survol d'une carte, changement de filtre). Durées 120 / 220 / 380 ms,
`transform`/`opacity` uniquement, jamais plus d'un élément en boucle par écran (le fond aurore du héros, en noir et blanc,
est le seul), tout est neutralisé sous `prefers-reduced-motion`.

## 5. Psychologie marketing appliquée (honnêtement)

| Principe | Application | Garde-fou |
|---|---|---|
| **Rareté** | « Dernière pièce » / « Plus que N en stock » sur les cartes produit (`StockUrgency`) | Uniquement si le stock réel est de 1 à 3 ; aucun compte à rebours |
| **Preuve sociale** | Le héros n'affiche plus de chiffres (clients, note) : seuls des faits vérifiables — boutique physique à Yopougon, commande WhatsApp, pièces authentiques | Ne jamais réintroduire un chiffre non sourcé |
| **Ancrage / aversion à la perte** | Promotion = prix barré + pastille `-X %` en rouge | Le prix barré est le vrai prix de vente |
| **Nouveauté honnête** | « Nouveau » calculé sur la vraie date d'ajout (14 jours, `lib/merchandising.ts`), plus d'étiquette décorative | — |
| **Loi de Hick / énergie d'activation** | Un seul appel à l'action principal par écran ; commande en un message WhatsApp | — |
| **Effet de défaut** | Taille et couleur présélectionnées quand il n'existe qu'une combinaison | — |
| **Zeigarnik / progression** | Back-office : checklist de démarrage du tableau de bord (produits → entrée → caisse → première vente) | — |
