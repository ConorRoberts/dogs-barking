import { writeFileSync } from "fs";
import { devices, chromium, ElementHandle } from "@playwright/test";
import chalk from "chalk";
import { v4 } from "uuid";

export type Meeting = {
  days: string[];
  startTime: string;
  endTime: string;
  location?: string;
  id: string;
  room?: string;
};

const labels = {
  "Offering(s):": "offerings",
  "Restriction(s):": "restrictions",
  "Requisites:": "requisites",
  "Locations:": "locations",
  "Offered:": "formats",
  "Department(s):": "departments",
  "Equate(s):": "equates",
};

const meetingDays = {
  M: "monday",
  T: "tuesday",
  W: "wednesday",
  Th: "thursday",
  F: "friday",
  Sa: "saturday",
  Su: "sunday",
};

const courses = [];

const logs: string[] = [];

const timestamp = new Date().getTime();

const baseUrl = "https://colleague-ss.uoguelph.ca";

(async () => {
  const browser = await chromium.launch();

  const context = await browser.newContext({
    ...devices["Desktop Chrome"],
  });

  const startTime = new Date().getTime();
  const page = await context.newPage();
  await page.goto("https://colleague-ss.uoguelph.ca/Student/Courses");

  await page.waitForSelector("section.esg-list-group");
  const dptLinks = await page.locator("section.esg-list-group > a").elementHandles();

  const log = (msg: string) => {
    const endTime = new Date().getTime();
    const time = (endTime - startTime) / 1000;
    const timestamp =
      Math.floor(time / 60)
        .toFixed(0)
        .padStart(2, "0") +
      ":" +
      (time % 60).toFixed(0).padStart(2, "0") +
      "s";

    const text = timestamp + "\t" + msg;
    logs.push(text);
    console.log(text);
  };

  log(`Found ${dptLinks.length} departments. Scraping...`);

  for (const dpt of dptLinks) {
    const dptPage = await context.newPage();
    const slug = await dpt.getAttribute("href");
    await dptPage.goto(baseUrl + slug);
    let currentPage = 1;

    try {
      // Wait for the first course in the list to render (5s maximum)
      await dptPage.waitForSelector("#course-resultul > li:nth-child(1) span[id^=course-]", { timeout: 5000 });
    } catch (error) {
      continue;
    }

    log(chalk.blue(await dpt.textContent()));

    let courseElements = await dptPage.locator("#course-resultul > li").elementHandles();

    let firstCourse = ((await courseElements[0].$eval("div div h3 span", (e) => e.textContent))
      .trim()
      .match(/[A-Z]{2,4}\*[0-9]{4}/) ?? [])[0]?.replace(/\*/g, "");

    const scrape = async (elements) => {
      log(`Found ${elements.length} courses`);
      let courseIndex = 0;
      for (const course of elements) {
        try {
          const title = (await course.$eval("div div h3 span", (e: ElementHandle) => e.textContent)).trim();
          const code = ((title.match(/[A-Z]{2,4}\*[0-9]{4}/) ?? [])[0] ?? "").replace(/\*/g, "");
          if (!code) continue;

          // Get the inner HTML and get all the text before the second <br> element
          // The description text is typically followed by 2x <br> so we just get the HTML + text up until the 2nd <br> then chop off the last 9 characters
          const description = (await course.$eval("div.search-coursedescription", (e) => e.innerHTML))
            .match(/(.+<br>)/)
            ?.at(0)
            .slice(0, -8)
            .trim()
            .replace(/ +/g, " ");

          log(chalk.blueBright(`${code} (${courseIndex++})`));

          const courseObj = {
            id: v4(),
            description,
            code,
            department: (code.match(/[A-Z]+/g) ?? [])[0].replace(/ +/g, " "),
            number: parseInt((code.match(/[0-9]+/g) ?? [])[0]),
            name: title
              .replace(/([A-Z]+\*[0-9]{4})|(\([0-9.]+ Credits\))/g, "")
              .trim()
              .replace(/ +/g, " "),
            credits: parseFloat(
              ((title.match(/\([0-9.]+ Credits\)/) ?? [])[0].match(/[0-9.]+/g) ?? [] ?? "")[0].trim()
            ),
          };

          const sections = [];

          // Fill out the rest of the course object
          // Properties such as offerings, restrictions, requisites, locations, formats, and departments
          const metaLabels = await course.$$("section div.search-coursedataheader");
          const metaContent = await course.$$("section div.search-coursedataheader + div > span:nth-child(1)");
          for (const idx in metaLabels) {
            const label = await metaLabels[idx].textContent();
            const content = await metaContent[idx].textContent();
            if (!label || !content) return;
            courseObj[labels[label.trim()]] = content.replace(/\r/g, "").trim();
          }

          const sectionButton = await course.$("button.esg-collapsible-group__toggle");
          if (sectionButton) {
            log(chalk.gray("Found sections. Waiting for button to be attached to the DOM."));
            await course.waitForSelector("button.esg-collapsible-group__toggle", { timeout: 5000 });

            log(chalk.gray("Clicking section button"));
            await sectionButton?.click();

            await course.waitForSelector(
              "div.esg-collapsible-group__body.esg-is-open div[data-bind='foreach: TermsAndSections'] > h4:nth-child(1)",
              { timeout: 5000 }
            );

            log(chalk.gray("Found section list"));

            const sectionTerms = [];
            const sectionTermElements = await course.$$("div[data-bind='foreach: TermsAndSections'] > h4");
            let index = 0;
            for (const e of sectionTermElements) {
              const term = (await e.textContent()).trim();
              sectionTerms[index++] = term;
            }

            log(chalk.gray(sectionTerms.join(", ")));

            // Iterate over all sections for this course
            const sectionElements = await course.$$(`div[data-bind='foreach: TermsAndSections'] > ul`);
            let groupIndex = 0;
            log(chalk.gray(`Found ${sectionElements.length} section groups`));
            for (const list of sectionElements) {
              for (const sectionElement of await list.$$("li")) {
                const textElement = await sectionElement.$("a.search-sectiondetailslink");
                const sectionCode = (await textElement.textContent()).trim().split("*")[2];
                log(chalk.gray(`Section code: ${sectionCode}`));

                const [semester, year] = sectionTerms[groupIndex].split(" ");

                const section = {
                  id: v4(),
                  code: sectionCode,
                  semester: semester.toLowerCase(),
                  year: parseInt(year),
                  instructor: "",
                };

                const lectures = [];
                const exams = [];
                const seminars = [];
                const labs = [];
                const tutorials = [];

                const sectionId = await textElement.getAttribute("id");

                // Iterate over section rows
                const tableRows = await sectionElement.$$("table tbody tr");
                let rowIndex = 0;
                for (const row of tableRows) {
                  // Is this some hidden garbage that we don't need? If so, skip.
                  if ((await row.getAttribute("style"))?.includes("display: none")) continue;

                  // This is the row that contains instructor data
                  if (rowIndex === 0) {
                    // Get the last td in this row
                    const td = await row.$("td:last-child");

                    // Select first span within first div of this td
                    let instructorName = (await (await td.$("div > span:first-child"))?.textContent())?.trim();
                    if (!instructorName) instructorName = "TBD";
                    log(chalk.gray(`Instructor name: ${instructorName}`));

                    section.instructor = instructorName;
                  }

                  // Text content for the "days" attribute
                  const daysTextContent = (
                    await (await row.$(`#${sectionId}-meeting-days-${rowIndex}`))?.textContent()
                  )?.trim();

                  const meeting: Meeting = {
                    days: daysTextContent?.length === 0 ? [] : daysTextContent?.split("/") ?? [],
                    startTime: (
                      await (await row.$(`#${sectionId}-meeting-times-start-${rowIndex}`))?.textContent()
                    )?.trim(),
                    endTime: (
                      await (await row.$(`#${sectionId}-meeting-times-end-${rowIndex}`))?.textContent()
                    )?.trim(),
                    id: v4(),
                  };

                  let itemIndex = 0;
                  for (const e of await row.$$("td.esg-table-body__td.search-sectionlocations div span")) {
                    const text = (await e?.textContent())?.trim();
                    if (text?.length === 0) continue;
                    if (itemIndex === 2) meeting.location = text;
                    else if (itemIndex === 3) meeting.room = text;

                    itemIndex++;
                  }

                  if (meeting.location === "VIRTUAL") {
                    delete meeting.room;
                  }

                  // LAB, LEC, SEM, etc.
                  const meetingType = (
                    await (await row.$(`#${sectionId}-meeting-instructional-method-${index}`))?.textContent()
                  )?.trim();

                  // Convert meeting days into booleans on our section object
                  meeting.days = meeting.days.map((day) => meetingDays[day]);

                  if (meetingType === "LEC") {
                    lectures.push({ ...meeting, id: v4() });
                  } else if (meetingType === "SEM") {
                    seminars.push({ ...meeting, id: v4() });
                  } else if (meetingType === "TUT") {
                    tutorials.push({ ...meeting, id: v4() });
                  } else if (meetingType === "LAB") {
                    labs.push({ ...meeting, id: v4() });
                  } else if (meetingType === "EXAM") {
                    exams.push({ ...meeting, id: v4() });
                  }

                  rowIndex++;
                }

                sections.push({ ...section, lectures, seminars, tutorials, labs, exams });
              }
              groupIndex++;
            }
          }

          courses.push({ ...courseObj, sections });
        } catch (error) {
          log(chalk.red(error.message));
        }
      }
      const hasNextPage = !(await dptPage.locator("#course-results-next-page").isDisabled());
      const totalPages = await dptPage.locator("#course-results-total-pages").textContent();

      log(chalk.gray(`Current page: ${currentPage}`));
      log(chalk.gray(`Total pages: ${totalPages}`));

      // If there is another page, we need to call scrape again
      // Exit loop if there are no more pages
      if (hasNextPage && currentPage < parseInt(totalPages)) {
        log(chalk.green("Triggering next page..."));
        await dptPage.locator("#course-results-next-page").click();

        // Wait for all of these conditions to be met before continuing
        await dptPage.locator("#aria-announcements p").waitFor({ state: "attached" });
        await dptPage.locator("#aria-announcements p").waitFor({ state: "detached" });
        await dptPage.locator("#main-content #loading").waitFor({ state: "hidden" });
        await dptPage.locator("#course-results-current-page").waitFor({ state: "visible" });
        await dptPage.locator("#course-results-total-pages").waitFor({ state: "visible" });

        currentPage++;

        let newCourseElements = [];
        let newFirstCourse = "";

        do {
          // Get first course in the list
          newCourseElements = await dptPage.locator("#course-resultul > li").elementHandles();
          newFirstCourse = ((await newCourseElements[0].$eval("div div h3 span", (e) => e.textContent))
            .trim()
            .match(/[A-Z]{2,4}\*[0-9]{4}/) ?? [])[0].replace(/\*/g, "");

          log(chalk.yellow(`Have courses ${firstCourse} and ${newFirstCourse}`));
        } while (newFirstCourse === firstCourse);

        courseElements = newCourseElements;
        firstCourse = newFirstCourse;

        log(chalk.green("Scraping next page..."));

        await scrape(courseElements);
      }
    };

    // Call scrape which will run recursively until the department has been scraped completely
    await scrape(courseElements);

    // Write data to file. This runs multiple times over the course of the program so that we have data "checkpoints"
    writeFileSync(`./data/courses/${timestamp}.json`, JSON.stringify({ courses }, null, 2), "utf8");
    writeFileSync("logs.txt", logs.join("\n"));

    log(chalk.green("Department finished. Saved to file."));
    await dptPage.close();
  }

  await browser.close();

  log(chalk.green("Scraping done!"));
})();
