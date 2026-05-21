# hellobarber-booking-web

Application web **Next.js 16** pour la réservation publique et la boutique en ligne des salons KOUP (HelloBarber). Les clients accèdent via un lien du type `/r/mon-salon` sans modifier le backend existant.

## Prérequis

- Node.js 20+
- API HelloBarber en cours d'exécution (par défaut `http://127.0.0.1:7700/api`)

## Installation

```bash
cd hellobarber-booking-web
npm install
cp .env.example .env.local
```

Éditez `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:7700/api
NEXT_PUBLIC_DEEP_LINK_SCHEME=koup
```

## Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Testez un salon avec son slug public, par exemple [http://localhost:3000/r/votre-slug](http://localhost:3000/r/votre-slug).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing KOUP |
| `/r/[slug]` | Fiche salon, services, avis, aperçu boutique |
| `/r/[slug]/book` | Assistant RDV (service → date → créneau → invité → confirmation) |
| `/r/[slug]/shop` | Grille produits + panier |
| `/r/[slug]/shop/checkout` | Checkout invité + commande |
| `/r/[slug]/success` | Confirmation RDV ou commande |

## Checkout invité

Aligné sur l'app Flutter :

1. `POST /auth/register` avec `passwordHash` (7 caractères aléatoires) et email `guest_{timestamp}@hellobarber.guest` si l'email est vide
2. `POST /salons/:id/appointments` ou `POST /salons/:id/orders` avec le JWT reçu

## Build production

```bash
npm run build
npm run start
```

## Déploiement (Vercel recommandé)

1. Importez le dépôt dans Vercel
2. Variables d'environnement :
   - `NEXT_PUBLIC_API_URL` → URL de production de l'API (ex. `https://api-hellobarber.haut-numerique.com/api`)
   - `NEXT_PUBLIC_DEEP_LINK_SCHEME=koup`
   - Optionnel : `NEXT_PUBLIC_PLAY_STORE_URL`, `NEXT_PUBLIC_APP_STORE_URL`
3. Domaine personnalisé (ex. `booking.koup.app`) pointant vers le projet
4. Partagez les liens `https://booking.koup.app/r/{bookingSlug}` depuis l'app pro

### Autres hébergeurs

Tout hébergeur supportant Next.js 16 (Node standalone, Docker, etc.) fonctionne. Exemple Docker :

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Activez `output: "standalone"` dans `next.config.ts` si vous utilisez cette image.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS 4
- Axios, Zustand (panier persisté)
- Thème sombre KOUP (#131313 / #FFC37E), touches type Duolingo (cartes arrondies, barre de progression, badges)

## API utilisées

- `GET /salons/resolve-booking/:slug`
- `GET /salons/:id/detail`
- `GET /salons/:id/products`
- `GET /salons/:id/available-slots`
- `POST /auth/register`, `POST /auth/login`
- `POST /salons/:id/appointments`, `POST /salons/:id/orders`
