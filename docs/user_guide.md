# User Guide

## About this Project

This project aims to create a command line interface (CLI) that allows users to access the University of Guelph's course offerings in an offline setting. Users will be able to search/query courses based on semester offering, credit value, course number, course code, etc.

Our tech stack for the project includes

- Node.js => Command line interaction
- Playwright => Web Scraping
- Typescript => The language behind our codebase
- Jest => Unit testing
- Docker => Seamless cross-platform compatability

## Dependencies Required

Before attempting to run this program, make sure that the following dependencies are installed on your machine:

- Docker
- Node.js version 10.4.0 or higher
- npm/yarn package manager

## Building/Running the Program

Our program uses a docker image to ensure compatibility across all platforms (OSX, Windows, Linux)

1. Pull  our docker image:
   - Linux:

    ```text
    sudo docker pull conorroberts/cis3760-sprint-1
    ```

   - Windows:

    ```text
    docker pull conorroberts/cis3760-sprint-1
    ```

    *requires admin perms/elevated command prompt*

   - OSX:

    ```text
    docker pull conorroberts/cis3760-sprint-1
    ```

2. Run a docker container from our image
   > **Note:** this command is awkward since we have to access the docker command line

    - Linux:

   ```text
   sudo docker run --rm -it --entrypoint /bin/bash conorroberts/cis3760-sprint-1
   npm run query
   ```

   - Windows/OSX:

   ```text
   sudo docker run --rm -it --entrypoint /bin/bash conorroberts/cis3760-sprint-1
   npm run query
   ```

3. Enter any valid command and query your heart's content (See below)

### Valid commands

| Command | Description | Usage |
|---------|-------------|-------|
| `query` | This command allows users to search for courses based on a variety of parameters. See *sample_queries.md* for more detailed documentation| `query [semestersoffered] -hdrw -[asc/dsc] -prq [prereqs] -dpt [departmentcode] -coursecode [coursecode] -title [keyword] -coursenumber [number]` |

## FAQ

### Where is this data coming from?

[https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/](https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/)

### What's in store for the future?

- Web/Desktop based application => (React.js/Electron)
- Increased scraper functionality => Getting services/contact information
- Optimization of the query system

## For Developers

### DEV: Running the program

```text
npm install
npm run dev
```

### DEV: Running test cases

```text
npm test
```

### DEV: Pushing a new build

```text
docker build -t conorroberts/cis3760-sprint-1
```
