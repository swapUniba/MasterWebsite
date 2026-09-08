Devo realizzare un sito web per un Master universitario.

Il sito deve essere moderno, responsive, molto semplice da mantenere e aggiornare, con una forte separazione tra contenuto e presentazione.

## Obiettivo generale

Realizza un sito statico per un Master universitario, in italiano, con una sola edizione attiva.

Il sito deve essere ospitato su GitHub Pages con dominio personalizzato.

Gli utenti che modificano il sito saranno di due tipi:

1. utenti tecnici, che possono modificare direttamente file Markdown/YAML tramite Git/GitHub;
2. utenti non tecnici, che devono poter modificare i contenuti tramite un CMS visuale senza dover conoscere Markdown, YAML, HTML, CSS o Git.

La soluzione scelta deve essere:

* Astro;
* Markdown/YAML come sorgente dei contenuti;
* Astro Content Collections per i contenuti strutturati;
* Pages CMS come interfaccia editoriale;
* GitHub come repository;
* GitHub Actions per build e deploy;
* GitHub Pages per hosting;
* custom domain tramite GitHub Pages.

Non usare database.

Non usare backend.

Non usare React, Next.js o framework client-side se non strettamente necessario.

Il sito deve essere principalmente statico e informativo.

Eventuali azioni come iscrizione, bando, pagamento, candidatura o accesso a sistemi universitari devono essere link verso servizi esterni ufficiali.

---

# Architettura

La separazione concettuale deve essere:

* `src/pages/`: struttura e routing delle pagine;
* `src/components/`: componenti visuali riutilizzabili;
* `src/content/`: contenuti strutturati e ripetibili;
* `src/data/`: dati globali e informazioni brevi;
* `src/styles/`: CSS e design system;
* `public/images/`: immagini;
* `public/documents/`: PDF, bandi e altri documenti;
* `.pages.yml`: configurazione di Pages CMS;
* `.github/workflows/`: deployment automatico.

Organizza inizialmente il repository in modo simile a questo:

```text
master-website/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── programma.astro
│   │   ├── ammissione.astro
│   │   ├── docenti.astro
│   │   ├── faq.astro
│   │   ├── contatti.astro
│   │   └── news/
│   │       ├── index.astro
│   │       └── [slug].astro
│   │
│   ├── content/
│   │   ├── courses/
│   │   ├── faculty/
│   │   ├── news/
│   │   └── faq/
│   │
│   ├── data/
│   │   ├── master.yml
│   │   ├── deadlines.yml
│   │   └── contacts.yml
│   │
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── KeyFacts.astro
│   │   ├── CourseCard.astro
│   │   ├── FacultyCard.astro
│   │   ├── NewsCard.astro
│   │   ├── DeadlineSection.astro
│   │   └── CallToAction.astro
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro
│   │
│   └── styles/
│       ├── global.css
│       ├── variables.css
│       └── components.css
│
├── public/
│   ├── images/
│   ├── documents/
│   ├── favicon.svg
│   └── CNAME
│
├── .pages.yml
├── astro.config.mjs
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

La struttura può essere migliorata se necessario, ma deve restare semplice e facilmente comprensibile.

---

# Information architecture

Il sito deve avere una struttura ibrida.

La homepage deve essere una landing page completa ma sintetica.

Le informazioni più approfondite devono essere disponibili in pagine dedicate.

Routing principale:

```text
/
├── /
├── /programma
├── /ammissione
├── /docenti
├── /news
├── /faq
└── /contatti
```

Non implementare per ora:

* edizioni precedenti;
* archivio storico delle edizioni;
* multilingua;
* area riservata;
* autenticazione utenti;
* database;
* ricerca interna complessa;
* backend;
* form custom con server-side processing.

Il sito è solo in italiano.

---

# Homepage

La homepage deve contenere indicativamente:

1. Header / navbar;
2. Hero;
3. informazioni chiave;
4. presentazione sintetica del Master;
5. preview del programma;
6. scadenze principali;
7. preview docenti;
8. ultime news;
9. call to action;
10. footer.

Schema concettuale:

```text
HEADER

HERO
- nome del Master
- eventuale sottotitolo
- breve descrizione
- CTA "Scopri il Master"
- CTA "Come iscriversi"

KEY FACTS
- CFU
- durata
- numero posti
- quota iscrizione
- eventuale modalità didattica

PRESENTAZIONE
- breve testo
- eventuali obiettivi

PROGRAMMA
- preview di alcuni moduli/corsi
- link "Vedi il programma"

SCADENZE
- candidatura
- pubblicazione graduatoria
- iscrizione
- inizio lezioni
- altre date rilevanti

DOCENTI
- preview di alcuni docenti
- link "Tutti i docenti"

NEWS
- ultime 3 news
- link a tutte le news

CTA
- testo tipo "Pronto a candidarti?"
- link alla pagina Ammissione o al portale ufficiale

FOOTER
- contatti
- dipartimento
- università
- link istituzionali
```

La home non deve contenere tutto il contenuto del sito.

Deve dare una panoramica e rimandare alle pagine di dettaglio.

---

# Modello dei contenuti

Il principio fondamentale è:

> Gli editor modificano i contenuti. Gli sviluppatori modificano la presentazione.

Gli editor NON devono poter modificare:

* layout;
* CSS;
* griglie;
* spaziature;
* responsive behaviour;
* struttura HTML;
* logica Astro;
* configurazione GitHub Actions;
* componenti.

Gli editor devono poter modificare solo contenuti semantici.

---

# Dati globali del Master

Usa un file tipo:

```text
src/data/master.yml
```

Esempio:

```yaml
title: "Master di II livello in ..."
short_title: "Master ..."
subtitle: "..."
department: "Dipartimento di ..."
university: "Università degli Studi di ..."
academic_year: "2026/2027"

duration: "12 mesi"
cfu: 60
places: 30
fee: "€ 3.500"

teaching_mode: "In presenza"
location: "Bari"

application_url: "https://..."
official_call_url: "/documents/bando.pdf"
```

Questi dati devono essere facilmente modificabili tramite Pages CMS.

---

# Scadenze

Usa ad esempio:

```text
src/data/deadlines.yml
```

Struttura possibile:

```yaml
items:
  - title: "Scadenza domanda di ammissione"
    date: "2027-01-15"
    description: ""

  - title: "Pubblicazione graduatoria"
    date: "2027-01-30"
    description: ""

  - title: "Inizio lezioni"
    date: "2027-02-15"
    description: ""
```

Il frontend deve mostrare le date in formato italiano leggibile.

---

# Contatti

Usa ad esempio:

```text
src/data/contacts.yml
```

Campi possibili:

```yaml
email: "master@example.it"
phone: ""
department: "..."
address: "..."
city: "..."
postal_code: ""
secretariat: "..."
```

Non hardcodare queste informazioni nei componenti.

---

# Corsi / moduli

I corsi devono essere una Content Collection Astro.

Ogni corso può essere un file Markdown.

Esempio:

```text
src/content/courses/machine-learning.md
```

Frontmatter indicativo:

```yaml
---
title: "Machine Learning"
slug: "machine-learning"
lecturer: "Mario Rossi"
cfu: 6
hours: 48
semester: "Primo semestre"
order: 10
featured: true
---
```

Nel corpo Markdown deve essere possibile inserire:

* descrizione;
* obiettivi;
* contenuti;
* eventuali prerequisiti.

Definisci uno schema con Astro Content Collections.

Campi obbligatori e tipi devono essere validati.

Ordina i corsi con un campo `order`.

Usa `featured` per decidere quali mostrare nella homepage.

---

# Docenti

Anche i docenti devono essere una Content Collection.

Esempio:

```text
src/content/faculty/mario-rossi.md
```

Frontmatter indicativo:

```yaml
---
name: "Mario Rossi"
role: "Professore Ordinario"
affiliation: "Università degli Studi di ..."
photo: "/images/faculty/mario-rossi.jpg"
email: ""
website: ""
order: 10
featured: true
---
```

Il corpo Markdown contiene una breve bio.

Supporta l'assenza della foto con un fallback elegante.

Non rendere email o sito obbligatori.

---

# News

Le news devono essere una Content Collection.

Esempio:

```text
src/content/news/apertura-iscrizioni.md
```

Frontmatter:

```yaml
---
title: "Apertura iscrizioni"
date: 2026-10-01
summary: "Sono aperte le candidature..."
featured: true
draft: false
---
```

Ogni news deve avere una pagina dedicata.

La pagina `/news` deve mostrare l'elenco delle news ordinate dalla più recente.

Le news con:

```yaml
draft: true
```

non devono essere pubblicate.

La homepage deve mostrare le ultime 3 news pubblicate.

---

# FAQ

Le FAQ devono essere modificabili tramite CMS.

Possono essere una Content Collection oppure una struttura YAML, scegliendo la soluzione più semplice e robusta.

Ogni FAQ deve avere almeno:

* domanda;
* risposta;
* ordine;
* eventuale categoria.

La pagina FAQ può utilizzare un accordion accessibile, preferibilmente basato su HTML nativo `details/summary` se adeguato.

---

# Pagine editoriali

Per testi come:

* presentazione;
* ammissione;
* organizzazione;
* obiettivi;
* modalità didattiche;

evita di mettere grandi quantità di testo direttamente nei file `.astro`.

Preferisci Markdown o file dati editabili.

I componenti Astro devono presentare il contenuto, non contenerlo.

---

# Pages CMS

Configura `.pages.yml`.

Pages CMS deve consentire a utenti non tecnici di modificare:

* informazioni generali del Master;
* scadenze;
* contatti;
* corsi;
* docenti;
* news;
* FAQ;
* immagini;
* documenti PDF, se supportato in modo adeguato.

Il CMS deve offrire campi comprensibili.

Esempio:

* text;
* textarea;
* rich-text / markdown;
* number;
* checkbox;
* select;
* date;
* image;
* file.

Evita di mostrare agli editor nomi tecnici quando non necessario.

Per esempio usa etichette:

* "Nome del Master"
* "Quota di iscrizione"
* "Numero di CFU"
* "Docente"
* "Numero di ore"
* "Mostra in homepage"
* "Bozza"

e non semplicemente il nome interno della variabile.

Gli utenti non tecnici devono poter premere Salva e pubblicare direttamente.

Non implementare per ora workflow di approvazione o pull request editoriali.

Flusso:

```text
Pages CMS
    ↓
salvataggio
    ↓
commit nel repository GitHub
    ↓
push su main
    ↓
GitHub Actions
    ↓
Astro build
    ↓
GitHub Pages
```

---

# GitHub Pages

Configura correttamente Astro per GitHub Pages.

Usa il deploy ufficiale tramite GitHub Actions.

Il deploy deve avvenire automaticamente quando viene effettuato un push su `main`.

Prevedi un dominio custom, per esempio:

```text
master.example.it
```

Imposta la configurazione Astro in modo compatibile con un custom domain.

Aggiungi:

```text
public/CNAME
```

con un dominio placeholder facilmente modificabile.

Non configurare un `base` path relativo al repository se il sito viene pubblicato tramite custom domain.

Documenta nel README cosa modificare quando sarà noto il dominio definitivo.

---

# CSS e design system

Non utilizzare un grande framework CSS salvo reale necessità.

Preferisco CSS semplice e mantenibile.

Puoi usare CSS moderno:

* custom properties;
* Grid;
* Flexbox;
* clamp();
* container/query responsive se utili;
* CSS nesting solo se supportato dalla toolchain scelta senza complicazioni.

Crea un piccolo design system.

In `variables.css` definisci almeno:

```css
:root {
  --color-primary: ...;
  --color-primary-dark: ...;
  --color-secondary: ...;
  --color-text: ...;
  --color-text-muted: ...;
  --color-background: ...;
  --color-surface: ...;
  --color-border: ...;

  --font-sans: ...;

  --space-xs: ...;
  --space-sm: ...;
  --space-md: ...;
  --space-lg: ...;
  --space-xl: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;

  --container-width: ...;
}
```

Il design deve essere:

* istituzionale;
* moderno;
* sobrio;
* leggibile;
* professionale;
* non eccessivamente "startup";
* adatto a un'università;
* responsive;
* accessibile.

Evitare animazioni decorative inutili.

---

# Header

Realizza una navbar responsive.

Desktop:

* logo/nome Master;
* Il Master;
* Programma;
* Ammissione;
* Docenti;
* News;
* FAQ;
* Contatti;
* eventuale CTA "Iscriviti".

Mobile:

* menu accessibile;
* navigazione semplice;
* nessuna dipendenza JavaScript pesante.

La pagina corrente dovrebbe essere distinguibile.

---

# Componenti

Crea componenti Astro piccoli e focalizzati.

Esempi:

```text
Header
Footer
Hero
SectionHeading
KeyFacts
CourseCard
FacultyCard
NewsCard
DeadlineList
CallToAction
Button
Breadcrumb
```

Evita componenti giganteschi.

Evita di duplicare markup tra pagine.

I componenti devono ricevere dati via props.

---

# Accessibilità

Prestare attenzione almeno a:

* HTML semantico;
* heading hierarchy corretta;
* contrasto;
* focus keyboard;
* navigazione da tastiera;
* `alt` immagini;
* link descrittivi;
* menu mobile accessibile;
* formattazione date comprensibile;
* `aria-*` solo dove realmente necessario.

Non usare `div` cliccabili se può essere usato un link o un button.

---

# SEO

Implementa SEO base.

Ogni pagina deve avere:

* title;
* meta description;
* canonical URL;
* Open Graph base;
* favicon.

Aggiungi:

* sitemap;
* robots.txt se opportuno;
* dati strutturati se semplici e realmente utili.

Non creare un sistema SEO complesso.

---

# Performance

Essendo un sito statico, punta a performance elevate.

Preferisci:

* HTML statico;
* zero JavaScript lato client quando non necessario;
* immagini ottimizzate;
* lazy loading dove opportuno;
* font con impatto limitato.

Evita hydration inutile.

---

# Documenti

I documenti ufficiali devono poter essere salvati in:

```text
public/documents/
```

Esempi:

```text
bando.pdf
regolamento.pdf
programma.pdf
```

I link ai documenti non devono essere sparsi hardcoded nel sito se sono documenti editoriali aggiornabili.

Metti i percorsi nei dati YAML quando appropriato.

---

# README

Crea un README molto chiaro.

Deve spiegare:

## Requisiti

* Node.js;
* npm.

## Sviluppo locale

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Modifica contenuti

Spiega:

* `src/content/`;
* `src/data/`;
* `public/images/`;
* `public/documents/`.

## Pages CMS

Spiega:

* dove si trova `.pages.yml`;
* quali contenuti vengono esposti;
* come il CMS interagisce con GitHub.

## Deployment

Spiega:

* GitHub Actions;
* GitHub Pages;
* branch `main`.

## Custom domain

Spiega:

* `public/CNAME`;
* configurazione GitHub Pages;
* record DNS da configurare lato dominio;
* dove modificare `site` in Astro.

---

# Esempi di contenuto iniziale

Inserisci contenuto placeholder realistico in italiano.

Non usare `Lorem ipsum`.

Ad esempio:

* "Master di II livello in Intelligenza Artificiale e Data Science";
* 60 CFU;
* durata 12 mesi;
* corsi di esempio;
* docenti di esempio;
* una o due news;
* FAQ di esempio;
* date di esempio.

Deve essere evidente quali dati siano placeholder.

---

# Requisito fondamentale di manutenibilità

Il sito deve poter cambiare quasi completamente nei contenuti senza toccare i file `.astro`.

Per esempio, aggiornare:

* quota;
* CFU;
* nome Master;
* scadenze;
* corsi;
* ore;
* docenti;
* testi;
* news;
* FAQ;
* immagini;
* PDF;

non deve richiedere modifiche ai componenti.

---

# Scope

Non aggiungere funzionalità non richieste.

In particolare non implementare:

* backend;
* database;
* autenticazione;
* dashboard custom;
* area studenti;
* pagamenti;
* form di candidatura;
* CMS proprietario;
* analytics complessi;
* ricerca full-text;
* multilingua;
* archivio delle vecchie edizioni;
* dark mode, salvo sia estremamente semplice e giustificata;
* dipendenze pesanti non necessarie.

Segui il principio YAGNI.

---

# Workflow di sviluppo

Prima di implementare:

1. analizza i requisiti;
2. proponi l'architettura finale del repository;
3. evidenzia eventuali assunzioni;
4. identifica eventuali rischi tecnici relativi a Pages CMS, GitHub Pages o Astro;
5. definisci il modello dati/content collections;
6. definisci la struttura delle pagine.

Poi implementa in piccoli step verificabili.

Durante l'implementazione:

* mantieni il codice semplice;
* usa nomi chiari;
* evita astrazioni premature;
* mantieni i componenti piccoli;
* valida il contenuto con Astro Content Collections;
* verifica che `npm run build` funzioni;
* verifica link interni e routing;
* verifica il deploy GitHub Pages;
* verifica che `.pages.yml` corrisponda realmente ai file presenti.

Alla fine esegui una revisione complessiva del progetto.

---

# Risultato finale atteso

Il repository finale deve essere pronto per:

```bash
npm install
npm run dev
```

e successivamente per essere pubblicato su GitHub Pages.

Deve contenere:

* sito Astro funzionante;
* homepage ibrida;
* pagine Programma, Ammissione, Docenti, News, FAQ e Contatti;
* Content Collections;
* YAML globali;
* CMS Pages CMS configurato;
* CSS responsive;
* GitHub Actions;
* GitHub Pages;
* configurazione custom domain;
* README;
* dati demo realistici;
* nessun backend;
* nessun database.

Prima di scrivere codice, mostra la proposta di architettura e il modello dei contenuti e attendi l'approvazione.
