# CIS3760 - Team 5

This project serves as a course management utility for University of Guelph Students. It includes a full catalog of all courses and programs, with their respective prerequisite trees available on tap to anyone. It also includes a degree planner feature for students who want to map out their degree programs, semester by semester.

Our project leverages Next.js, hosted on an ECS cluster, for both its frontend and a API. React flow for graphing and Neo4j for our database storage. Our project uses Jest and Cypress as forms of web scraping and unit testing to ensure a clean production build.

## Getting started

```text
Clone/Fork the repo using git clone https://github.com/ConorRoberts/dogs-barking.git
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
Fork/Clone the repository making any necessary changes.
Ensure any changes pass linting and unit testing requirements.
Submit a pull request with a brief statement of any changes
```
