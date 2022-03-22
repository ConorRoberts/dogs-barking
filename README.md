# CIS3760 - Team 5

## Getting started

```text
Clone the repo using git clone https://gitlab.socs.uoguelph.ca/crober35/w22_cis3760_team5.git
```

Install the project dependencies by running

```text
pnpm install
```

### Installing dependencies

Ensure you run this in the root directory

```text
chmod +x docs/install-script.sh && ./docs/install-script.sh
```

## Running Programs

### CLI System

```text
cd apps/cli
npm run dev
```

### Scraper

```text
cd apps/scraper
npm start
```

### Web Client

```text
cd apps/client
npm run dev for development mode
npm start for production

Updating to production ->
Ensure any changes pass unit testing, then run the following commands:
- npm run build
This will push the required files to the nginx server
```

### Backend API

```text
cd apps/api
... Coming soon
```
