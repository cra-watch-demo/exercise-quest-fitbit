# Google Health setup

De live GitHub Pages frontend gebruikt Google Health API. Voor OAuth token exchange is een kleine serverless backend nodig, omdat `GOOGLE_CLIENT_SECRET` nooit in publieke frontend-code mag staan.

## Google Cloud

Gebruik deze redirect URI:

`https://cra-watch-demo.github.io/exercise-quest-fitbit/`

Voeg je eigen Google-account toe als test user zolang de OAuth app op Testing staat.

Voeg minimaal deze readonly scopes toe:

- `https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly`
- `https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly`
- `https://www.googleapis.com/auth/googlehealth.sleep.readonly`
- `https://www.googleapis.com/auth/googlehealth.profile.readonly`

## Cloudflare Worker

1. Maak een gratis Worker aan.
2. Kopieer de inhoud van `worker.js` naar de Worker.
3. Voeg onder Settings > Variables and Secrets toe:
   - `GOOGLE_CLIENT_ID` = je Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET` = je NIEUWE/geroteerde Client Secret
   - `REDIRECT_URI` = `https://cra-watch-demo.github.io/exercise-quest-fitbit/`
   - `ALLOWED_ORIGIN` = `https://cra-watch-demo.github.io`
4. Deploy de Worker.
5. Kopieer de `https://...workers.dev` URL.
6. Open het dashboard en vul Client ID + Worker URL in.
7. Klik `Connect Google Health`.

## Security

Een Client Secret dat ooit in een screenshot/chat zichtbaar was, moet worden geroteerd voordat je deze backend gebruikt. Zet secrets alleen in Worker Secrets, nooit in `index.html`, JavaScript of GitHub repository files.

Deze persoonlijke testversie bewaart het Google access token alleen in `sessionStorage`. Er wordt geen refresh token naar de browser gestuurd. Na ongeveer 1 uur moet je opnieuw verbinden.