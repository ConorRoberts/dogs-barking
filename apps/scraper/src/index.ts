import { writeFileSync } from "fs";
import { devices, chromium, ElementHandle } from "playwright";
import chalk from "chalk";

const labels = {
  "Offering(s):": "offerings",
  "Restriction(s):": "restrictions",
  "Requisites:": "requisites",
  "Locations:": "locations",
  Offered: "formats",
  "Department(s):": "departments",
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

const courses = [],
  labs = [],
  lectures = [],
  seminars = [],
  tutorials = [],
  exams = [],
  sections = [],
  instructors = [];

const logs: string[] = [];

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

    try {
      // Wait for the first course in the list to render (5s maximum)
      await dptPage.waitForSelector("#course-resultul > li:nth-child(1) span[id^=course-]", { timeout: 5000 });
    } catch (error) {
      continue;
    }

    log(chalk.blue(await dpt.textContent()));

    const courseElements = await dptPage.locator("#course-resultul > li").elementHandles();

    log(`Found ${courseElements.length} courses`);

    const scrape = async (elements: ElementHandle<Node>[]) => {
      for (const course of elements) {
        try {
          const title = (await course.$eval("div div h3 span", (e) => e.textContent)).trim();
          const code = ((title.match(/[A-Z]{3,4}\*[0-9]{4}/) ?? [])[0] ?? "").replace(/\*/g, "");
          const description = (await course.$eval("div.search-coursedescription", (e) => e.textContent)).trim();

          log(code);

          let courseObj = {
            id: Math.random(),
            description,
            code,
            department: (code.match(/[A-Z]+/g) ?? [])[0],
            number: parseInt((code.match(/[0-9]+/g) ?? [])[0]),
            name: title.replace(/([A-Z]+\*[0-9]{4})|(\([0-9\.]+ Credits\))/g, "").trim(),
            credits: parseFloat(
              ((title.match(/\([0-9\.]+ Credits\)/) ?? [])[0].match(/[0-9\.]+/g) ?? [] ?? "")[0].trim()
            ),
            HAS_SECTION: [],
          };

          // Fill out the rest of the course object
          // Properties such as offerings, restrictions, requisites, locations, formats, and departments
          const metaLabels = await course.$$("section div.search-coursedataheader");
          const metaContent = await course.$$("section div.search-coursedataheader + div > span:nth-child(1)");
          for (const idx in metaLabels) {
            const label = await metaLabels[idx].textContent();
            const content = await metaContent[idx].textContent();
            if (!label || !content) return;
            courseObj[labels[label.trim()]] = content.trim();
          }

          log(chalk.gray("Opening section list"));

          const sectionButton = await course.$("button.esg-collapsible-group__toggle");
          if (sectionButton) {
            await sectionButton?.click();

            await course.waitForSelector(
              "div.esg-collapsible-group__body.esg-is-open div[data-bind='foreach: TermsAndSections'] > h4:nth-child(1)",
              { timeout: 5000 }
            );

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
            for (const list of sectionElements) {
              for (const sectionElement of await list.$$("li")) {
                const textElement = await sectionElement.$("a.search-sectiondetailslink");
                const sectionCode = (await textElement.textContent()).trim().split("*")[2];

                let section = {
                  id: Math.random(),
                  code: sectionCode,
                  term: sectionTerms[groupIndex],
                  INSTRUCTED_BY: 0,
                  HAS_LECTURE: [],
                  HAS_EXAM: [],
                  HAS_SEMINAR: [],
                  HAS_LAB: [],
                  HAS_TUTORIAL: [],
                };

                const sectionId = await textElement.getAttribute("id");

                let meetings = [];

                // Iterate over section rows
                const tableRows = await sectionElement.$$("table tbody tr");
                let rowIndex = 0;
                for (const row of tableRows) {
                  // Is this some hidden garbage that we don't need? If so, skip.
                  if ((await row.getAttribute("style"))?.includes("display: none")) return;

                  // This is the row that contains instructor data
                  if (rowIndex === 0) {
                    // Get the last td in this row
                    const td = await row.$("td:last-child");
                    // Select first span within first div of this td
                    const instructorName = (await (await td.$("div > span:first-child")).textContent()).trim();

                    // Check for an instructor with a matching name
                    const instructor = instructors.find((i) => i.name === instructorName);

                    // If we don't have an instructor with this name, create one
                    if (!instructor) {
                      const id = Math.random();
                      instructors.push({
                        id,
                        name: instructorName,
                      });
                      section.INSTRUCTED_BY = id;
                    } else {
                      section.INSTRUCTED_BY = instructor.id;
                    }
                  }

                  // Text content for the "days" attribute
                  // const daysTextContent = (
                  //   await (await row.$(`#${sectionId}-meeting-days-${index}`)).textContent()
                  // ).trim();

                  // let meeting: any = {
                  //   days: daysTextContent.length === 0 ? [] : daysTextContent.split("/"),
                  //   startTime: (
                  //     await (await row.$(`#${sectionId}-meeting-times-start-${index}`))?.textContent()
                  //   )?.trim(),
                  //   endTime: (await (await row.$(`#${sectionId}-meeting-times-end-${index}`))?.textContent())?.trim(),
                  //   id: Math.random(),
                  // };

                  // let itemIndex = 0;
                  // for (const e of await row.$$("td.esg-table-body__td.search-sectionlocations div span")) {
                  //   let text = (await e?.textContent()).trim();
                  //   if (text.length === 0) return;
                  //   if (itemIndex === 2) meeting.location = text;
                  //   else if (itemIndex === 3) meeting.room = text;

                  //   itemIndex++;
                  // }

                  // if (meeting.location === "VIRTUAL") {
                  //   delete meeting.room;
                  // }

                  // LAB, LEC, SEM, etc.
                  // const meetingType = (
                  //   await (await row.$(`#${sectionId}-meeting-instructional-method-${index}`))?.textContent()
                  // ).trim();

                  // Convert meeting days into booleans on our section object
                  // Object.entries(meetingDays).forEach(([key, val]) => {
                  //   meeting[val] = meeting.days.includes(key);
                  // });

                  // delete meeting.days;

                  //   if (meetingType === "LEC") {
                  //     lectures.push(meeting);
                  //     section.HAS_LECTURE.push(meeting.id);
                  //   } else if (meetingType === "SEM") {
                  //     seminars.push(meeting);
                  //     section.HAS_SEMINAR.push(meeting.id);
                  //   } else if (meetingType === "TUT") {
                  //     tutorials.push(meeting);
                  //     section.HAS_TUTORIAL.push(meeting.id);
                  //   } else if (meetingType === "LAB") {
                  //     labs.push(meeting);
                  //     section.HAS_LAB.push(meeting.id);
                  //   } else if (meetingType === "EXAM") {
                  //     exams.push(meeting);
                  //     section.HAS_EXAM.push(meeting.id);
                  //   }

                  //   meetings.push(meeting);
                }

                courseObj.HAS_SECTION.push(section.id);
                sections.push(section);
              }
              groupIndex++;
            }
          }

          courses.push(courseObj);
        } catch (error) {
          log(chalk.red("Error scraping course", error.message));
        }
      }
    };

    await scrape(courseElements);

    const hasNextPage = !(await dptPage.locator("#course-results-next-page").isDisabled());

    if (hasNextPage) {
      await dptPage.locator("#course-results-next-page").click();

      // Wait for all of these conditions to be met before continuing
      await dptPage.locator("#aria-announcements p").waitFor({ state: "attached" });
      await dptPage.locator("#aria-announcements p").waitFor({ state: "detached" });
      await dptPage.locator("#main-content #loading").waitFor({ state: "hidden" });

      log(chalk.green("Scraping next page..."));

      const newCourseElements = await dptPage.locator("#course-resultul > li").elementHandles();
      await scrape(newCourseElements);
    } else {
      writeFileSync(
        "scrape-data.json",
        JSON.stringify({ courses, labs, lectures, seminars, tutorials, exams, sections, instructors }, null, 2)
      );

      log(chalk.green("Done"));
      await dptPage.close();
    }
  }

  await browser.close();

  log(chalk.green("Scraping done!"));
  log(chalk.blue("Saving to file..."));

  log(chalk.green("File saved! Exiting."));

  writeFileSync("logs.txt", logs.join("\n"));
})();



//   // Iterate over all courses
//   cy.get("#course-resultul > li")
//     .each(($li) => {
//       const title = $li.find("div div h3 span").text().trim();

//       const code = ((title.match(/[A-Z]{3,4}\*[0-9]{4}/) ?? [])[0] ?? "").replace(/\*/g, "");
//       cy.task("log", code);

//       let course = {
//         id: Math.random(),
//         description: $li.find("div.search-coursedescription").text().trim(),
//         code,
//         department: (code.match(/[A-Z]+/g) ?? [])[0],
//         number: parseInt((code.match(/[0-9]+/g) ?? [])[0]),
//         name: title.replace(/([A-Z]+\*[0-9]{4})|(\([0-9\.]+ Credits\))/g, "").trim(),
//         credits: parseFloat(((title.match(/\([0-9\.]+ Credits\)/) ?? [])[0].match(/[0-9\.]+/g) ?? [] ?? "")[0].trim()),
//         HAS_SECTION: [],
//       };

//       // Fill out the rest of the course object
//       // Properties such as offerings, restrictions, requisites, locations, formats, and departments
//       $li.find("div.search-coursedataheader").each((_index, $div) => {
//         const label = $div.textContent.trim();
//         if (!label) return;

//         const content = $div.nextSibling;
//         const span = content.childNodes[0];

//         if (span) course[labels[label]] = span.textContent.trim();
//       });

//       // Get the terms for this course's sections
//       const sectionTerms = [];
//       $li.find("div[data-bind='foreach: TermsAndSections'] > h4").each((index, e) => {
//         const term = e.textContent.trim();
//         sectionTerms[index] = term;
//       });

//       // Iterate over all sections for this course
//       $li.find(`div[data-bind='foreach: TermsAndSections'] > ul`).each((groupIndex, list) => {
//         list.querySelectorAll("li").forEach((sectionElement) => {
//           const textElement = sectionElement.querySelector("a.search-sectiondetailslink");
//           const sectionCode = textElement.textContent.trim().split("*")[2];
//           const section = {
//             id: Math.random(),
//             code: sectionCode,
//             term: sectionTerms[groupIndex],
//             INSTRUCTED_BY: 0,
//             HAS_LECTURE: [],
//             HAS_EXAM: [],
//             HAS_SEMINAR: [],
//             HAS_LAB: [],
//             HAS_TUTORIAL: [],
//           };

//           const sectionId = textElement.getAttribute("id");

//           let meetings = [];

//           // Iterate over section rows
//           sectionElement.querySelectorAll("table tbody tr").forEach((row, index) => {
//             // Is this some hidden garbage that we don't need? If so, skip.
//             if (row.getAttribute("style")?.includes("display: none")) return;

//             // This is the row that contains instructor data
//             if (index === 0) {
//               // Get the last td in this row
//               const td = row.querySelector("td:last-child");
//               // Select first span within first div of this td
//               const instructorName = td.querySelector("div > span:first-child").textContent.trim();

//               // Check for an instructor with a matching name
//               const instructor = instructors.find((i) => i.name === instructorName);

//               // If we don't have an instructor with this name, create one
//               if (!instructor) {
//                 const id = Math.random();
//                 instructors.push({
//                   id,
//                   name: instructorName,
//                 });
//                 section.INSTRUCTED_BY = id;
//               } else {
//                 section.INSTRUCTED_BY = instructor.id;
//               }
//             }

//             // Text content for the "days" attribute
//             const daysTextContent = row.querySelector(`#${sectionId}-meeting-days-${index}`)?.textContent?.trim();

//             let meeting: any = {
//               days: daysTextContent.length === 0 ? [] : daysTextContent.split("/"),
//               startTime: row.querySelector(`#${sectionId}-meeting-times-start-${index}`)?.textContent?.trim(),
//               endTime: row.querySelector(`#${sectionId}-meeting-times-end-${index}`)?.textContent?.trim(),
//               id: Math.random(),
//             };

//             row.querySelectorAll("td.esg-table-body__td.search-sectionlocations div span").forEach((e, itemIndex) => {
//               let text = e?.textContent.trim();
//               if (text.length === 0) return;
//               if (itemIndex === 2) meeting.location = text;
//               else if (itemIndex === 3) meeting.room = text;
//             });

//             if (meeting.location === "VIRTUAL") {
//               delete meeting.room;
//             }

//             // LAB, LEC, SEM, etc.
//             const meetingType = row
//               .querySelector(`#${sectionId}-meeting-instructional-method-${index}`)
//               ?.textContent.trim();

//             // Convert meeting days into booleans on our section object
//             Object.entries(meetingDays).forEach(([key, val]) => {
//               meeting[val] = meeting.days.includes(key);
//             });

//             delete meeting.days;

//             if (meetingType === "LEC") {
//               lectures.push(meeting);
//               section.HAS_LECTURE.push(meeting.id);
//             } else if (meetingType === "SEM") {
//               seminars.push(meeting);
//               section.HAS_SEMINAR.push(meeting.id);
//             } else if (meetingType === "TUT") {
//               tutorials.push(meeting);
//               section.HAS_TUTORIAL.push(meeting.id);
//             } else if (meetingType === "LAB") {
//               labs.push(meeting);
//               section.HAS_LAB.push(meeting.id);
//             } else if (meetingType === "EXAM") {
//               exams.push(meeting);
//               section.HAS_EXAM.push(meeting.id);
//             }

//             meetings.push(meeting);
//           });

//           course.HAS_SECTION.push(section.id);
//           sections.push(section);
//         });
//       });

//       courses.push(course);
//     })
//     .then(() => {
//       cy.get("#loading").find("div:nth-child(1)", { timeout: 30000 }).should("not.have.attr", "style", "display: none");

//       scrape();
//     });
// };
