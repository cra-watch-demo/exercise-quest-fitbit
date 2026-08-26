# Exercise Quest Live

Online dashboard dat echte data uit de Fitbit Web API kan ophalen.

## GitHub Pages
Publiceer de repository via GitHub Pages vanaf de `main` branch en root (`/`).

De verwachte URL is:

`https://cra-watch-demo.github.io/exercise-quest-fitbit/`

Gebruik exact die URL als OAuth 2.0 Redirect URL in je Fitbit developer app.

## Fitbit koppelen
1. Maak/gebruik een Fitbit developer app.
2. Voeg de GitHub Pages URL toe als redirect/callback URL.
3. Open het dashboard.
4. Vul je Fitbit Client ID in.
5. Klik `Connect Fitbit`.
6. Geef toestemming bij Fitbit.
7. Daarna kan `Sync` je Fitbit-data ophalen.

## Data
De huidige versie haalt op:
- profiel
- stappen
- afstand
- calories out
- resting heart rate
- slaap

## Security
- Geen client secret in de browsercode.
- Access token wordt alleen in browser `sessionStorage` opgeslagen.
- Dit is bedoeld als persoonlijke/testimplementatie; voor productie is Authorization Code + PKCE/backend aan te raden.
