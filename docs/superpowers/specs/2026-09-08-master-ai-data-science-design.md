# Sito del Master in AI e Data Science — Specifica di progetto

Data: 8 settembre 2026

Stato: design approvato in chat, in attesa di revisione della specifica

Committenza: Master congiunto dell’Università degli Studi di Bari Aldo Moro e del Politecnico di Bari

## 1. Obiettivo

Realizzare un sito informativo statico, in italiano, per una sola edizione attiva del Master universitario di II livello in AI e Data Science.

Il sito deve servire con pari importanza:

- professionisti che vogliono aggiornare o ampliare le proprie competenze;
- neolaureati magistrali che vogliono specializzarsi ed entrare nel settore.

La homepage deve offrire un percorso sintetico verso programma e candidatura. Le pagine dedicate devono contenere gli approfondimenti. Tutti i contenuti demo devono essere chiaramente riconoscibili come provvisori.

## 2. Vincoli e decisioni confermate

- Astro come generatore statico.
- Markdown e YAML come fonti dei contenuti.
- Astro Content Collections con schemi Zod per caricamento, tipi e validazione.
- Pages CMS come interfaccia per utenti non tecnici.
- GitHub come repository e sorgente editoriale.
- GitHub Actions e GitHub Pages per build e deploy da `main`.
- Dominio personalizzato, senza configurazione Astro `base`.
- Nessun backend, database, sistema di autenticazione, area riservata o framework client-side.
- Nessun workflow editoriale basato su pull request: Pages CMS salva direttamente nel repository.
- Identità autonoma del Master; UniBa e Politecnico sono presentati come istituzioni congiunte.
- I siti esistenti sono riferimenti per gerarchia informativa e tono, non per colori o implementazione:
  - <https://sisinflab.github.io/Master-di-II-livello-in-Intelligenza-Artificiale-e-Data-Science/>
  - <https://masterdatascienceuniba.github.io/>

## 3. Ambito escluso

Non sono previsti:

- edizioni precedenti o archivio storico;
- multilingua;
- candidatura, pagamenti o form elaborati dal sito;
- ricerca full-text;
- dashboard o CMS proprietario;
- analytics complessi;
- dark mode;
- animazioni decorative o dipendenze UI pesanti.

Candidatura, bando, pagamento e servizi universitari sono link a sistemi ufficiali esterni.

## 4. Architettura del repository

```text
MasterSite/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── programma.astro
│   │   ├── ammissione.astro
│   │   ├── docenti.astro
│   │   ├── faq.astro
│   │   ├── contatti.astro
│   │   ├── 404.astro
│   │   └── news/
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── content/
│   │   ├── editorial/
│   │   ├── courses/
│   │   ├── faculty/
│   │   └── news/
│   ├── data/
│   │   ├── master.yml
│   │   ├── deadlines.yml
│   │   ├── contacts.yml
│   │   └── faq.yml
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── sections/
│   │   └── cards/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── styles/
│   │   ├── variables.css
│   │   ├── global.css
│   │   └── components.css
│   ├── utils/
│   │   ├── content.ts
│   │   └── dates.ts
│   └── content.config.ts
├── public/
│   ├── images/
│   ├── documents/
│   ├── favicon.svg
│   ├── robots.txt
│   └── CNAME
├── tests/
├── .github/workflows/deploy.yml
├── .pages.yml
├── astro.config.mjs
├── package.json
└── README.md
```

### Responsabilità

- `src/pages/` definisce URL, composizione e query dei contenuti.
- `src/components/` contiene presentazione riutilizzabile e non contiene dati editoriali.
- `src/content/` contiene testi lunghi e raccolte ripetibili.
- `src/data/` contiene impostazioni globali e liste brevi.
- `src/content.config.ts` è la fonte autorevole degli schemi applicativi.
- `.pages.yml` rispecchia gli stessi campi con etichette italiane, senza esporre layout o codice.
- `public/images/` e `public/documents/` contengono media gestibili dal CMS.

## 5. Modello dei contenuti

### 5.1 Informazioni generali — `src/data/master.yml`

Campi:

- `title`: stringa obbligatoria;
- `short_title`: stringa obbligatoria;
- `subtitle`: stringa obbligatoria;
- `summary`: testo breve obbligatorio;
- `academic_year`: stringa obbligatoria;
- `institutions`: lista obbligatoria di oggetti con `name`, `short_name` e `url`;
- `duration`: stringa obbligatoria;
- `cfu`: numero positivo obbligatorio;
- `total_hours`: numero positivo obbligatorio;
- `places`: numero positivo opzionale;
- `fee`: stringa obbligatoria;
- `teaching_mode`: valore tra `In presenza`, `Online` e `Mista`;
- `schedule`: stringa breve obbligatoria;
- `location`: stringa obbligatoria;
- `attendance`: stringa opzionale;
- `application_url`: URL HTTP(S) opzionale;
- `official_call_url`: URL HTTP(S) o percorso `/documents/...` opzionale;
- `brochure_url`: URL HTTP(S) o percorso `/documents/...` opzionale;
- `demo_notice`: testo opzionale ma valorizzato nei dati iniziali.

`demo_notice` viene mostrato in una barra visibile su tutte le pagine finché contiene testo.

### 5.2 Scadenze — `src/data/deadlines.yml`

Contiene `items`, una lista di:

- `title`: stringa obbligatoria;
- `date`: data ISO `YYYY-MM-DD` obbligatoria;
- `time`: orario opzionale;
- `description`: testo opzionale;
- `url`: URL esterno o percorso interno opzionale.

Le date sono ordinate cronologicamente e rese con `Intl.DateTimeFormat('it-IT')`. Nessuna data viene trasformata usando un fuso orario implicito.

### 5.3 Contatti — `src/data/contacts.yml`

Campi:

- `general_email`: email obbligatoria;
- `general_phone`: stringa opzionale;
- `offices`: lista di oggetti con istituzione, dipartimento, indirizzo, città, CAP, email e sito opzionale;
- `coordinators`: lista di nome, ruolo, affiliazione ed email opzionale;
- `institutional_links`: lista di etichetta e URL.

### 5.4 FAQ — `src/data/faq.yml`

Contiene `items`, una lista di:

- `question`: stringa obbligatoria;
- `answer`: testo semplice multilinea obbligatorio;
- `category`: stringa opzionale;
- `order`: intero non negativo obbligatorio.

La scelta di un singolo file YAML rende più semplice il riordino nel CMS ed evita molti file minimi.
Le risposte non accettano HTML o Markdown: questo evita un parser aggiuntivo e mantiene il modello adatto a risposte brevi. Eventuali collegamenti utili sono inseriti come link descrittivi nelle pagine di dettaglio pertinenti.

### 5.5 Pagine editoriali — `src/content/editorial/*.md`

File fissi iniziali:

- `home.md`;
- `programma.md`;
- `ammissione.md`;
- `contatti.md`.

Frontmatter comune:

- `title`: stringa obbligatoria;
- `eyebrow`: stringa opzionale;
- `description`: meta description obbligatoria;
- `heading`: titolo visibile obbligatorio.

Il corpo contiene Markdown editabile con Pages CMS. Creazione, rinomina e cancellazione dei file editoriali sono disabilitate nel CMS.

### 5.6 Corsi — `src/content/courses/*.md`

Frontmatter:

- `code`: stringa obbligatoria;
- `title`: stringa obbligatoria;
- `summary`: testo breve obbligatorio;
- `cfu`: numero non negativo obbligatorio, anche decimale;
- `hours`: intero non negativo obbligatorio;
- `semester`: valore controllato, inizialmente `Primo semestre`, `Secondo semestre`, `Annuale` o `Altro`;
- `lecturers`: lista opzionale di nomi;
- `order`: intero non negativo obbligatorio;
- `featured`: booleano, predefinito a `false`.

Il corpo Markdown contiene descrizione, obiettivi, contenuti e prerequisiti. Lo slug è derivato dal nome del file.

I docenti restano nomi testuali per consentire docenti ospiti senza una scheda obbligatoria e per evitare relazioni fragili durante la fase demo.

### 5.7 Docenti — `src/content/faculty/*.md`

Frontmatter:

- `name`: stringa obbligatoria;
- `role`: stringa obbligatoria;
- `affiliation`: stringa obbligatoria;
- `category`: valore tra `Coordinamento`, `Comitato scientifico`, `Docente` e `Professionista`;
- `photo`: percorso immagine opzionale;
- `photo_alt`: stringa obbligatoria quando è presente `photo`;
- `email`: email opzionale;
- `website`: URL opzionale;
- `order`: intero non negativo obbligatorio;
- `featured`: booleano, predefinito a `false`.

Il corpo Markdown contiene la biografia. In assenza di foto viene mostrato un avatar con iniziali.

### 5.8 News — `src/content/news/*.md`

Frontmatter:

- `title`: stringa obbligatoria;
- `date`: data obbligatoria;
- `summary`: testo breve obbligatorio;
- `image`: percorso opzionale;
- `image_alt`: stringa obbligatoria quando è presente `image`;
- `featured`: booleano, predefinito a `false`;
- `draft`: booleano, predefinito a `true`.

Il corpo Markdown contiene l’articolo. Il nome del file genera lo slug. Le bozze non compaiono nelle query pubbliche e non generano pagine statiche.

## 6. Pagine e gerarchia informativa

### 6.1 Homepage `/`

Ordine delle sezioni:

1. avviso sui dati demo;
2. header con istituzioni, navigazione e CTA;
3. hero con promessa formativa e due CTA;
4. dati chiave;
5. motivazioni e obiettivi per entrambi i pubblici;
6. anteprima dei corsi `featured`;
7. organizzazione didattica e prossime scadenze;
8. anteprima dei docenti `featured`;
9. ultime tre news non in bozza;
10. CTA verso ammissione;
11. footer istituzionale.

La voce di navigazione “Il Master” punta alla sezione introduttiva della homepage. Non viene creata una pagina `/il-master`.

### 6.2 Pagine di dettaglio

- `/programma`: introduzione editoriale, struttura didattica, corsi ordinati, stage e prova finale.
- `/ammissione`: requisiti, procedura, quota, documenti e scadenze.
- `/docenti`: persone raggruppate per categoria e ordinate.
- `/news`: archivio delle news pubblicate, dalla più recente.
- `/news/[slug]`: articolo singolo con metadati e ritorno all’archivio.
- `/faq`: FAQ ordinate e raggruppate per categoria.
- `/contatti`: contatto generale, coordinamento, uffici e sedi dei due Atenei.
- `/404`: pagina di errore con ritorno alla homepage e alla navigazione principale.

In `/programma`, ogni modulo mostra sempre codice, titolo, sintesi, CFU e ore; il corpo Markdown con obiettivi e contenuti è disponibile in un elemento nativo `details/summary`. Non vengono generate pagine separate per i singoli corsi.

## 7. Componenti e flusso dati

Componenti previsti:

- layout: `BaseLayout`, `PageHeader`, `Section`, `SectionHeading`;
- navigazione: `Header`, `MobileMenu`, `Footer`, `Breadcrumb`;
- elementi: `Button`, `Notice`, `EmptyState`;
- sezioni: `Hero`, `KeyFacts`, `DeadlineList`, `CallToAction`;
- schede: `CourseCard`, `FacultyCard`, `NewsCard`.

Ogni componente riceve dati tramite proprietà. Nomi del Master, istituzioni, costi, date, contatti e URL non vengono hardcoded nei componenti.

```text
Markdown/YAML
    → loader e schemi di src/content.config.ts
    → getCollection/getEntry
    → ordinamento e filtri in src/utils/content.ts
    → pagine Astro
    → componenti presentazionali
    → HTML statico
```

Le utility centralizzano soltanto regole realmente condivise: formato delle date, ordinamento, esclusione delle bozze e selezione dei contenuti in evidenza.

## 8. Pages CMS

`.pages.yml` definisce:

- due sorgenti media distinte:
  - immagini in `public/images`, limitate ai formati immagine previsti;
  - documenti in `public/documents`, limitati almeno ai PDF;
- file singoli per informazioni generali, scadenze, contatti e FAQ;
- file editoriali fissi;
- collezioni per corsi, docenti e news;
- etichette, descrizioni e controlli in italiano;
- rich text salvato come Markdown per pagine editoriali, corsi, docenti e news;
- campi multilinea semplici per le risposte FAQ;
- checkbox per `featured` e `draft`;
- date picker, select e campi numerici coerenti con gli schemi Astro;
- disabilitazione di rinomina e cancellazione per file strutturali.

Gli editor non vedono CSS, componenti, routing, workflow o configurazioni di build.

Salvataggio editoriale:

```text
Pages CMS → commit su main → GitHub Actions → validazione/build → GitHub Pages
```

Una build non valida non sostituisce il sito pubblicato. Il flusso diretto non include anteprima o approvazione editoriale, come richiesto.

## 9. Direzione visiva

Direzione approvata: **Tecnologia mediterranea**.

Caratteristiche:

- atmosfera luminosa, contemporanea e professionale;
- riferimenti visivi a connessioni, dati e sistemi senza illustrazioni decorative complesse;
- palette autonoma rispetto ai siti esistenti e ai colori istituzionali;
- composizione ariosa con sezioni brevi, schede sobrie e gerarchia tipografica netta;
- tono meno burocratico di un portale universitario, senza sembrare una startup.

Token iniziali:

```css
:root {
  --color-primary: #102e38;
  --color-primary-dark: #08242d;
  --color-secondary: #0b9b90;
  --color-secondary-dark: #08776f;
  --color-accent: #ce8855;
  --color-text: #102e38;
  --color-text-muted: #5a7477;
  --color-background: #f7faf8;
  --color-background-tinted: #edf6f3;
  --color-surface: #ffffff;
  --color-border: #d7e5e2;
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
}
```

La palette definitiva deve superare i controlli WCAG AA nelle combinazioni effettivamente utilizzate. Il font di sistema evita richieste esterne e riduce il peso della pagina.

Il layout usa un contenitore centrale, CSS Grid e Flexbox, `clamp()` per la tipografia e breakpoint guidati dal contenuto. Non richiede un framework CSS.

## 10. Accessibilità, SEO e performance

### Accessibilità

- HTML semantico e gerarchia degli heading coerente;
- link “Salta al contenuto”;
- focus da tastiera sempre visibile;
- menu mobile raggiungibile e utilizzabile da tastiera;
- FAQ con `details/summary`;
- `aria-*` solo quando l’HTML nativo non esprime lo stato;
- testi alternativi per immagini informative;
- avatar testuale per docenti senza foto;
- link descrittivi e date leggibili in italiano;
- rispetto di `prefers-reduced-motion` per eventuali transizioni essenziali.

### SEO

`BaseLayout` riceve titolo, descrizione, immagine sociale opzionale e canonical URL. Produce:

- `lang="it"`;
- title e meta description;
- canonical URL basata su `Astro.site`;
- Open Graph essenziale;
- favicon;
- robots e sitemap tramite integrazione ufficiale Astro.

I dati strutturati vengono aggiunti solo se i dati reali permettono di descrivere correttamente l’offerta formativa; non fanno parte del primo incremento.

### Performance

- output statico e nessuna hydration;
- JavaScript client limitato al menu mobile;
- immagini con dimensioni esplicite e lazy loading fuori dalla prima viewport;
- nessun font remoto;
- nessuna animazione decorativa.

Le immagini in `public/images` non vengono ottimizzate automaticamente dalla pipeline Astro. Il CMS limita i formati e il README indica dimensioni e peso consigliati; un sistema automatico di trasformazione immagini è fuori scope.

## 11. Gestione degli errori e stati vuoti

- Un campo obbligatorio mancante o malformato interrompe la build con un errore di schema.
- Una news in bozza non viene pubblicata e non genera una route.
- Collezioni opzionali vuote nascondono la preview della homepage.
- Le pagine elenco vuote mostrano un messaggio informativo, non una griglia vuota.
- Immagini assenti usano un fallback previsto dal componente.
- Link opzionali a bando, candidatura o brochure non vengono renderizzati se mancanti.
- Link esterni mantengono un’etichetta esplicita; non viene imposto `target="_blank"`.
- La pagina 404 usa il layout condiviso e offre collegamenti alla homepage e alle sezioni principali.

## 12. Verifica

Script previsti:

- `npm run check`: verifica Astro e TypeScript;
- `npm test`: test delle funzioni di data e selezione dei contenuti;
- `npm run build`: generazione statica completa;
- `npm run validate`: esegue check, test e build.

I test automatici coprono almeno:

- formattazione italiana delle date senza slittamenti di giorno;
- ordinamento di scadenze, corsi e docenti;
- esclusione delle news in bozza;
- selezione delle ultime tre news pubblicate;
- selezione dei contenuti `featured`;
- presenza nel build delle route previste;
- assenza nel build delle route delle bozze;
- validità dei link interni noti.

Verifiche manuali:

- navigazione completa da tastiera;
- menu mobile;
- responsive alle larghezze principali e ai punti di rottura del contenuto;
- contrasto della palette;
- rendering con immagini e campi opzionali assenti;
- corrispondenza tra `.pages.yml` e file realmente presenti.

## 13. Deploy e dominio

Il workflow GitHub Actions si attiva su push a `main` e manualmente. Usa le azioni ufficiali per checkout, build/upload Astro e deploy GitHub Pages, con i permessi minimi necessari.

Configurazione finale con dominio personalizzato:

- `astro.config.mjs`: `site` uguale all’URL HTTPS definitivo;
- nessuna proprietà `base`;
- `public/CNAME`: solo il nome host definitivo;
- GitHub Pages configurato con GitHub Actions come sorgente;
- DNS configurato dal proprietario del dominio.

Durante lo sviluppo viene usato deliberatamente `https://master.example.it` come dominio dimostrativo. Prima della pubblicazione reale, `site` e `CNAME` devono essere modificati insieme. Finché il DNS non è configurato, la verifica primaria avviene con server locale e build locale, non tramite il sottopercorso `github.io/<repository>`.

## 14. Assunzioni aperte ma non bloccanti

- Titolo operativo: “Master in AI e Data Science”.
- Atenei: Università degli Studi di Bari Aldo Moro e Politecnico di Bari.
- Contenuti iniziali, persone, costi, date, URL e documenti sono esempi esplicitamente marcati come demo.
- Dominio dimostrativo: `master.example.it`.
- I loghi ufficiali non vengono incorporati finché non vengono forniti file e autorizzazioni d’uso; i nomi delle istituzioni restano testuali.

Questi valori possono essere sostituiti tramite YAML, Markdown e media senza modificare componenti o layout.
