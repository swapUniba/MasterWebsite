# Master in Intelligenza Artificiale e Data Science

Sito statico del Master universitario di II livello in Intelligenza Artificiale e Data Science, offerto congiuntamente da **Università degli Studi di Bari Aldo Moro** e **Politecnico di Bari**.

## 1. Stato del contenuto: sito dimostrativo

> **Attenzione:** tutti i contenuti attualmente pubblicati (testi, date, quote, contatti, docenti, corsi, news) sono **dati dimostrativi (demo)** creati per validare struttura, design e processo editoriale del sito. Non rappresentano informazioni ufficiali del Master.
>
> Ogni pagina mostra un avviso dimostrativo visibile (`demo_notice` in `src/data/master.yml`) finché i contenuti reali non vengono inseriti. **Non pubblicare questo sito con dominio definitivo finché non è stata completata la procedura al punto 11.**

## 2. Requisiti

- **Node.js 22.12 o superiore** (vedi `engines` in `package.json`)
- **npm** (incluso con Node.js)

Nessun altro strumento è richiesto: il sito è generato staticamente con [Astro](https://astro.build), non usa framework client-side, database o backend.

## 3. Comandi principali

Installare le dipendenze una sola volta:

```bash
npm install
```

Comandi disponibili (definiti in `package.json`):

| Comando | Effetto |
|---|---|
| `npm run dev` | avvia il server di sviluppo con ricarica automatica (di norma su `http://localhost:4321`) |
| `npm run build` | genera il sito statico in `dist/` |
| `npm run preview` | serve localmente il contenuto già generato in `dist/` (utile per verificare l'output di produzione) |
| `npm run validate` | esegue in sequenza `astro check` (tipi/contenuti), la build, i test Vitest e il controllo dei link interni; deve terminare senza errori prima di ogni deploy manuale o modifica strutturale |

Comandi accessori: `npm run check` (solo type-check), `npm test` (solo test Vitest), `npm run check:links` (solo controllo link). **Attenzione:** parte dei test Vitest e l'intero controllo dei link leggono l'output generato in `dist/`, quindi richiedono una build già presente; su un checkout pulito eseguire `npm run build` prima di `npm test`/`npm run check:links`, oppure semplicemente `npm run validate`, che li ordina già correttamente.

## 4. Mappa dei contenuti

Il sito **non ha contenuti editoriali scritti nei file `.astro`**: ogni testo, immagine o documento proviene da file in `src/content/`, `src/data/` o `public/`. Chi modifica solo questi file non deve mai toccare componenti o pagine.

### `src/content/` (collezioni gestite da Astro Content Layer, schemi in `src/content/schemas.ts`)

| Collezione | Percorso | Contenuto |
|---|---|---|
| `editorial` | `src/content/editorial/*.md` | Testi editoriali di ciascuna pagina (titolo, eyebrow, descrizione, heading, corpo) — una entry per pagina (`home`, `programma`, `ammissione`, `docenti`, `faq`, `contatti`, `news`) |
| `courses` | `src/content/courses/*.md` | Corsi del programma didattico (codice, CFU, ore, semestre, docenti, corpo descrittivo) |
| `faculty` | `src/content/faculty/*.md` | Persone del corpo docente/comitato (nome, ruolo, affiliazione, categoria, foto, contatti) |
| `news` | `src/content/news/*.md` | Notizie ed eventi (titolo, data, sintesi, immagine, flag `draft`/`featured`) |

### `src/data/` (dati strutturati globali, YAML puro)

| File | Contenuto |
|---|---|
| `master.yml` | Anagrafica del Master: titolo, atenei, durata, CFU, quota, modalità, sede, link candidatura/bando/brochure, testo dell'avviso demo |
| `deadlines.yml` | Scadenze in evidenza (titolo, data, ora, descrizione, link) |
| `contacts.yml` | Sedi, coordinatori e link istituzionali |
| `faq.yml` | Domande frequenti (domanda, risposta, categoria, ordine) |

### `public/images/` e `public/documents/`

Asset statici serviti as-is: `public/images/` per foto docenti e immagini news (referenziate dai campi `photo`/`image` delle collezioni), `public/documents/` per PDF (bando ufficiale, brochure) referenziati da `official_call_url`/`brochure_url` in `master.yml`. Entrambe le cartelle contengono solo un `.gitkeep` nel repository demo: nessun asset reale è ancora presente.

## 5. Editing dei contenuti con Pages CMS

Il repository è predisposto per l'editing tramite [Pages CMS](https://pagescms.org), un'interfaccia web che scrive direttamente nei file del repository via GitHub.

Procedura di attivazione, una tantum:

1. **Installare la GitHub App di Pages CMS** sull'account/organizzazione proprietaria del repository, concedendo accesso al solo repository di questo sito (da [app.pagescms.org](https://app.pagescms.org), pulsante di installazione GitHub).
2. **Aprire il repository in Pages CMS**: dopo l'installazione, il repository compare nella dashboard di Pages CMS; aprendolo, l'interfaccia legge automaticamente `.pages.yml` nella root e costruisce i form di editing in base a quel file.
3. **Modificare i contenuti** dai form generati (pagine editoriali, corsi, docenti, news, impostazioni). Ogni salvataggio in Pages CMS crea un **commit diretto sul branch `main`** — non esiste un flusso di bozza/pull request integrato in questa configurazione.
4. **Build automatica conseguente**: ogni push su `main` (compreso quello generato da Pages CMS) avvia il workflow `.github/workflows/deploy.yml`, che esegue `npm run validate` (type-check, build, test, controllo dei link) e pubblica il risultato su GitHub Pages. Non è necessaria alcuna azione manuale dopo il salvataggio in Pages CMS: entro pochi minuti le modifiche sono online.

Chi ha accesso in scrittura a `main` di fatto pubblica direttamente sul sito: va quindi trattato come un ambiente di produzione anche per gli editor non tecnici.

## 6. `.pages.yml`: cosa possono modificare gli editor

`.pages.yml` nella root del repository definisce l'intero schema visto da Pages CMS: due sezioni `media` (dove caricare immagini e documenti) e una sezione `content` che contiene due **gruppi** (`type: group`) più tre **collezioni** di primo livello, indipendenti da qualunque gruppo:

- Gruppo **`impostazioni`** (`master`, `deadlines`, `contacts`, `faq`): quattro file YAML singoli in `src/data/`, mappati con `type: file`.
- Gruppo **`pagine`**: contiene una sola voce, `editorial` (le pagine editoriali in `src/content/editorial`, `type: collection`).
- Collezioni **`courses`**, **`faculty`** e **`news`**: voci separate allo stesso livello di `impostazioni` e `pagine` sotto `content:`, non annidate in nessun gruppo.

Ogni voce dentro i due gruppi (i quattro file YAML di `impostazioni` e la collezione `editorial` di `pagine`) ha `operations: { create: false, rename: false, delete: false }`: gli editor possono **solo modificare i campi esistenti**, non creare nuovi file di impostazioni, non rinominarli né cancellarli, perché sono referenziati per percorso fisso dal codice (`src/content.config.ts`) e da un numero fisso di pagine `.astro`. Le collezioni di primo livello `courses`, `faculty` e `news` **non hanno questa restrizione**: gli editor possono aggiungere, rinominare ed eliminare voci liberamente, perché il sito le itera dinamicamente (nessuna pagina `.astro` referenzia una entry specifica per nome).

I campi esposti in `.pages.yml` corrispondono esattamente agli schemi Zod in `src/content/schemas.ts`: qualunque valore non conforme (es. `academic_year` non nel formato `AAAA/AAAA`, email non valida, URL malformato) viene rifiutato in build da `astro check`/dalla validazione dei contenuti, non silenziosamente accettato. Non è possibile, tramite Pages CMS, aggiungere campi non previsti dallo schema, né modificare markup o struttura delle pagine: quella parte resta sempre nei componenti `.astro`, fuori dalla portata degli editor.

## 7. Configurazione di GitHub Pages

Il deploy è gestito dal workflow `.github/workflows/deploy.yml`, che si attiva a ogni push su `main` (o manualmente via `workflow_dispatch`) ed esegue esattamente lo stesso comando usato in locale, `npm run validate` (type-check, build, test, controllo dei link interni), seguito dalla build dell'artefatto Pages (`withastro/action`) e dalla pubblicazione tramite `actions/deploy-pages`.

Perché il workflow possa pubblicare, nel repository su GitHub è necessario impostare, una tantum:

1. **Settings → Pages → Build and deployment → Source**: selezionare **"GitHub Actions"** (non la sorgente legacy "Deploy from a branch"). Con questa impostazione, GitHub Pages pubblica esattamente l'artefatto prodotto dal workflow, senza richiedere un branch `gh-pages` separato.
2. Verificare che il workflow abbia i permessi già dichiarati in `deploy.yml` (`pages: write`, `id-token: write`): sono sufficienti così come sono, nessuna configurazione aggiuntiva dei permessi del repository è richiesta oltre l'abilitazione della sorgente "GitHub Actions".

**Il sito è configurato per il dominio personalizzato `https://masteriads.com`.** Un dominio personalizzato serve il sito dalla propria radice, mentre GitHub Pages senza dominio personalizzato serve un progetto sotto un percorso che include il nome del repository (es. `/MasterWebsite/`). Astro non riscrive automaticamente i link interni scritti come stringhe assolute (`href="/programma/"`): quando si usa un sottopercorso, `base` deve essere configurato in `astro.config.mjs` e il codice deve usare l'helper `withBase()` (`src/utils/url.ts`). Le due modalità di pubblicazione supportate sono:

- **(a) Dominio reale (nessun sottopercorso, configurazione attiva):** `astro.config.mjs` usa `site: 'https://masteriads.com'` e non definisce `base`; `public/robots.txt` e `public/CNAME` riportano lo stesso dominio. In questo modo `withBase()` lascia i link assoluti alla radice.
- **(b) Sottopercorso `<account>.github.io/<repository>/` (nessun dominio personalizzato):** impostare `site: 'https://<account>.github.io'` e `base: '/<repository>'` in `astro.config.mjs`, rimuovere `public/CNAME` e aggiornare la riga `Sitemap:` in `public/robots.txt` con lo stesso prefisso. Eseguire queste modifiche nello stesso commit per evitare URL incoerenti.

La verifica locale (`npm run build` seguito da `npm run preview`) riproduce la struttura degli URL generati; usarla prima di ogni push per controllare che stili e link interni funzionino dalla radice.

## 8. Dominio personalizzato: sostituzione coordinata

Il dominio attivo è **`https://masteriads.com`**. Poiché è un dominio personalizzato servito dalla radice, **non va configurato `base`** in `astro.config.mjs`.

Il dominio è presente in **tre punti che devono restare sempre sincronizzati**:

| File | Chiave/valore da impostare | Cosa aggiornare |
|---|---|---|
| `astro.config.mjs` | `site: 'https://masteriads.com'`, senza chiave `base` | URL assoluto usato da Astro per canonical, Open Graph e sitemap |
| `public/CNAME` | `masteriads.com` | mantiene la dichiarazione del dominio nell'artefatto statico e documenta la destinazione del deploy |
| `public/robots.txt` | `Sitemap: https://masteriads.com/sitemap-index.xml` | URL assoluto della sitemap dichiarato ai crawler |

In caso di un futuro cambio di dominio, aggiornare tutti e tre i file **nello stesso commit** e verificare che nessun link interno resti prefissato con il vecchio sottopercorso (`npm run build && npm run check:links` lo rileverebbe come destinazione mancante).

Poiché questo repository pubblica tramite un workflow GitHub Actions, `public/CNAME` non configura da solo GitHub Pages: inserire anche `masteriads.com` in **Settings → Pages → Custom domain**, attendere la verifica DNS e poi abilitare **Enforce HTTPS**.

## 9. DNS per `masteriads.com`

Presso il proprio gestore DNS, configurare il dominio apex `masteriads.com` con quattro record **A** verso gli indirizzi GitHub Pages correnti:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

È inoltre consigliato creare `www` come record **CNAME** verso `swapUniba.github.io` (senza `/MasterWebsite`): GitHub Pages reindirizzerà automaticamente `www.masteriads.com` verso il dominio apex configurato.

In alternativa ai record A, alcuni gestori permettono un record `ALIAS` o `ANAME` per l'apex. I nomi esatti dei campi e il TTL dipendono dal pannello del gestore. Prima di collegare il DNS, è consigliato verificare `masteriads.com` in **Settings dell'organizzazione swapUniba → Pages** tramite il record TXT proposto da GitHub, così da prevenire acquisizioni del dominio da altri repository. Per la procedura aggiornata, fare riferimento alla documentazione ufficiale: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) e [Verifying your custom domain for GitHub Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

## 10. Dimensioni consigliate per le immagini

Per mantenere pagine leggere e nitide su schermi ad alta densità:

- **Foto docenti**: formato **WebP o AVIF**, **quadrate**, almeno **640 × 640 px**, idealmente sotto **250 KB**.
- **Immagini news**: **1600 × 900 px** (rapporto 16:9), idealmente sotto **400 KB**.

Caricare le immagini tramite Pages CMS (categoria `images` in `.pages.yml`, cartella `public/images/`) o direttamente nel repository; compilare sempre il relativo campo di testo alternativo (`photo_alt`/`image_alt`), obbligatorio quando l'immagine è presente (vincolo imposto dagli schemi in `src/content/schemas.ts`).

## 11. Procedura per sostituire i dati demo prima della pubblicazione

Prima di rendere il sito pubblico con dominio definitivo, seguire questa lista in ordine:

1. **Rimuovere l'avviso demo**: svuotare o eliminare `demo_notice` in `src/data/master.yml` (impostarlo a stringa vuota lo rimuove dalla UI, poiché il campo è opzionale).
2. **Sostituire `src/data/master.yml`**: titolo, sottotitolo, sintesi, anno accademico, atenei, durata, CFU, ore, posti, quota, modalità, calendario, sede, link di candidatura/bando/brochure con i valori ufficiali.
3. **Sostituire `src/data/deadlines.yml`, `contacts.yml`, `faq.yml`** con le scadenze, i contatti/coordinatori e le domande frequenti reali.
4. **Sostituire i contenuti in `src/content/editorial/`** (uno per pagina) con i testi editoriali definitivi.
5. **Sostituire le entry in `src/content/courses/`, `src/content/faculty/`, `src/content/news/`** con corsi, docenti e news reali; rimuovere le entry demo non pertinenti; verificare che nessuna news da pubblicare resti con `draft: true` e che eventuali bozze reali lo abbiano.
6. **Caricare gli asset reali** in `public/images/` (foto docenti, immagini news, dimensioni come da punto 10) e `public/documents/` (bando, brochure in PDF), aggiornando i relativi campi (`photo`, `image`, `official_call_url`, `brochure_url`).
7. **Verificare il dominio definitivo** nei tre file descritti al punto 8 (`astro.config.mjs`, `public/CNAME`, `public/robots.txt`) e controllare il DNS come da punto 9.
8. **Eseguire `npm run validate`** e correggere ogni errore segnalato (schema non valido, test falliti, link interni rotti) prima di considerare il sito pronto.
9. **Eseguire una revisione manuale finale** in locale (`npm run dev`) su viewport mobile e desktop: navigazione da tastiera, focus visibili, FAQ, immagini/documenti effettivamente presenti, link esterni funzionanti, e verificare che l'avviso demo sia stato effettivamente rimosso da ogni pagina.
10. Solo a questo punto, effettuare il push su `main` con la sorgente GitHub Pages già configurata come da punto 7: il sito pubblicato sostituirà automaticamente il contenuto demo con quello reale.
