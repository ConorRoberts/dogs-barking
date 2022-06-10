import { chromium } from "@playwright/test";
import chalk from "chalk";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import dayjs from "dayjs";
import neo4j from "neo4j-driver";

interface RegistrationWindow {
  school: string;
  semester: "fall" | "winter" | "summer";
  minCredits: number;
  timestamp: number;
  year: number;
}

dotenv.config({ path: ".env" });

const BASE_URL = "https://www.uoguelph.ca/registrar/courseselectionwindow";

const logs = [];

const SCHOOL = "UOFG";

const timestamp = new Date().getTime();

const windows: RegistrationWindow[] = [];

const log = (msg: string) => {
  const endTime = new Date().getTime();
  const time = (endTime - timestamp) / 1000;
  const timeStr =
    Math.floor(time / 60)
      .toFixed(0)
      .padStart(2, "0") +
    ":" +
    (time % 60).toFixed(0).padStart(2, "0") +
    "s";

  const text = timeStr + "\t" + msg;
  logs.push(text);
  console.log(text);
};

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const scrapeRegistrationWindows = async () => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto(BASE_URL);

  const id = await page.locator("div.field-item.even h3 button").first().getAttribute("aria-controls");

  log(`ID: ${id}`);

  const undergraduateWindowsButton = page.locator(`button[aria-controls="UNDFf22"]`);
  await undergraduateWindowsButton.click();

  const undergraduateDates = await page.locator(`#${id}[aria-expanded="true"] > h4`).allInnerTexts();
  const undergraduateCredits = await page.locator(`#${id}[aria-expanded="true"] > h4 + p`).allInnerTexts();
  const [semester, year] = (await page.locator("div.field-item.even h2").first().innerText()).split(" ");

  const tmpWindows = undergraduateDates.map((e, index) => ({
    school: SCHOOL,
    semester: semester.toLowerCase() as "fall" | "winter" | "summer",
    year: parseInt(year),
    timestamp: dayjs(e.replace(/\.|at/g, "").split(",")[1].trim().replace(/\s\s+/g, " ").slice(0, -3), "MMMM D h")
      .set("year", dayjs().year())
      .valueOf(),
    minCredits: parseFloat(undergraduateCredits[index]),
  }));

  windows.push(...tmpWindows);

  console.log(windows);

  const fileName = `scraper_data/registration_windows/${timestamp}.json`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: Buffer.from(JSON.stringify({ windows }, null, 2)),
    })
  );

  log(`Saved file to S3 - ${chalk.blue(fileName)}`);

  s3.destroy();

  await browser.close();

  log(chalk.green("Done!"));
};

const saveRegistrationWindows = async () => {
  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const session = driver.session();

  await session.run(
    `
    unwind $windows as window

    match (s:School { short: window.school })

    MERGE (w:RegistrationWindow {
      semester: window.semester,
      year: window.year,
      minCredits: window.minCredits,
      timestamp: window.timestamp
    })

    create (s)-[:HAS]->(w)
    `,
    { windows }
  );

  await session.close();
  await driver.close();
};

(async () => {
  await scrapeRegistrationWindows();
  await saveRegistrationWindows();
})();
