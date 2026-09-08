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

**Il sottopercorso `https://<account>.github.io/<repository>/` richiede una configurazione diversa da quella di un dominio personalizzato.** GitHub Pages serve i progetti senza dominio personalizzato sotto un percorso che include il nome del repository (es. `/MasterWebSite/`), non nella radice del dominio. Astro non riscrive automaticamente i link interni scritti come stringhe assolute (`href="/programma/"`): li riscrive solo se `base` è configurato in `astro.config.mjs` e il codice usa l'helper `withBase()` (`src/utils/url.ts`) per costruirli, cosa che questo repository fa. Le due modalità di pubblicazione supportate:

- **(a) Dominio reale (nessun sottopercorso):** un dominio personalizzato serve il sito dalla propria radice, esattamente come il dominio placeholder `master.example.it` con cui il progetto è stato originariamente pensato. Per usarlo: rimuovere (o impostare a `undefined`) `base` in `astro.config.mjs`, impostare `site` sul dominio reale, completare la sostituzione coordinata descritta al punto 8 e configurare il DNS come da punto 9. Con `base` rimosso, `withBase()` diventa un no-op e tutti i link tornano assoluti alla radice.
- **(b) Sottopercorso `<account>.github.io/<repository>/` (nessun dominio personalizzato):** questo repository è attualmente configurato così — `astro.config.mjs` ha `site: 'https://<account>.github.io'` e `base: '/<repository>'`, e `public/CNAME` non esiste (va lasciato assente: la sua presenza fa impostare a GitHub Pages un dominio personalizzato, causando un redirect verso un dominio che potrebbe non esistere ancora). Se si clona/rinomina il repository, aggiornare `base` in `astro.config.mjs`, `site` con il proprio account, e la riga `Sitemap:` in `public/robots.txt` con lo stesso prefisso, **negli stessi tre punti nello stesso commit** (stesso principio di sincronizzazione del punto 8, applicato a sottopercorso anziché a dominio).

La verifica locale (`npm run build` seguito da `npm run preview`, che rispetta lo stesso `base` configurato) riproduce fedelmente il comportamento del sottopercorso pubblicato; usarla prima di ogni push per controllare che stili e link interni funzionino con il prefisso corretto.

## 8. Dominio personalizzato: sostituzione coordinata

Questa sezione si applica solo se si passa dal sottopercorso `<account>.github.io/<repository>/` (opzione (b) del punto 7, attualmente attiva) a un dominio personalizzato (opzione (a)). Un dominio personalizzato serve il sito dalla propria radice: **non serve e non va configurato `base`** in `astro.config.mjs` in questo caso.

Il progetto originariamente usava il dominio placeholder **`https://master.example.it`**, servito dalla radice, presente in **tre punti che devono restare sempre sincronizzati**:

| File | Chiave/valore da impostare | Cosa aggiornare |
|---|---|---|
| `astro.config.mjs` | `site: 'https://<dominio-reale>'`, e rimuovere/impostare a `undefined` la chiave `base` | URL assoluto del sito, usato da Astro per generare canonical, Open Graph e sitemap; `base` va rimosso perché un dominio personalizzato non usa un sottopercorso |
| `public/CNAME` | `<dominio-reale>` (ricreare il file: nella configurazione attuale a sottopercorso non esiste) | file letto da GitHub Pages per servire il sito sul dominio personalizzato |
| `public/robots.txt` | `Sitemap: https://<dominio-reale>/sitemap-index.xml` | URL assoluto della sitemap dichiarato ai crawler |

Aggiornare tutti e tre i file **nello stesso commit**: un disallineamento produce canonical/sitemap che puntano al dominio sbagliato, oppure un CNAME che non corrisponde al dominio effettivamente configurato su GitHub Pages (in quel caso GitHub Pages può disabilitare il dominio personalizzato). Ricordarsi inoltre di rimuovere `base` da `astro.config.mjs` e di verificare che nessun link interno resti prefissato con il vecchio sottopercorso (`npm run build && npm run check:links` lo rileverebbe comunque come destinazione mancante).

Dopo aver aggiornato i tre file, aggiungere il nuovo dominio anche in **Settings → Pages → Custom domain** del repository su GitHub (GitHub propone di norma di scrivere lì lo stesso valore già presente in `public/CNAME`, e li tiene sincronizzati ai commit successivi).

## 9. DNS per un sottodominio personalizzato

Per pubblicare il sito su un sottodominio (es. `master.tuodominio.it`) puntato a GitHub Pages, è necessario creare presso il proprio **gestore DNS** un record **CNAME** che punti il sottodominio a `<account>.github.io` (dove `<account>` è l'account o l'organizzazione GitHub che ospita il repository).

I valori esatti (nome del record, TTL, eventuale necessità di un record `ALIAS`/`ANAME` se si usa un apex domain anziché un sottodominio) dipendono dal pannello del proprio gestore DNS e vanno verificati lì. Per la procedura completa, aggiornata alle regole correnti di GitHub, fare riferimento alla documentazione ufficiale: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site). Questa guida non sostituisce quella documentazione, che va sempre considerata la fonte definitiva in caso di conflitto.

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
7. **Eseguire la sostituzione coordinata del dominio** descritta al punto 8 (`astro.config.mjs`, `public/CNAME`, `public/robots.txt`) e configurare il DNS come da punto 9.
8. **Eseguire `npm run validate`** e correggere ogni errore segnalato (schema non valido, test falliti, link interni rotti) prima di considerare il sito pronto.
9. **Eseguire una revisione manuale finale** in locale (`npm run dev`) su viewport mobile e desktop: navigazione da tastiera, focus visibili, FAQ, immagini/documenti effettivamente presenti, link esterni funzionanti, e verificare che l'avviso demo sia stato effettivamente rimosso da ogni pagina.
10. Solo a questo punto, effettuare il push su `main` con la sorgente GitHub Pages già configurata come da punto 7: il sito pubblicato sostituirà automaticamente il contenuto demo con quello reale.
