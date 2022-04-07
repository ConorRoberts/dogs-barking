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

describe("Scrape courses from UofG", () => {
  before(() => {
    cy.visit("https://colleague-ss.uoguelph.ca/Student/Courses/Search?keyword=");
  });

  it("Scrape courses from The University of Guelph", () => {
    const courses = [],
      labs = [],
      lectures = [],
      seminars = [],
      tutorials = [],
      exams = [],
      sections = [],
      instructors = [];

    // Wait for any course. This is ACCT*1220
    cy.get("#course-12586");

    // Click all the buttons that hold section times. This expands the group
    cy.get("button.esg-collapsible-group__toggle").click({ multiple: true, force: true });

    // Iterate over all courses
    cy.get("#course-resultul > li")
      .each(($li) => {
        const title = $li.find("div div h3 span").text().trim();

        const code = ((title.match(/[A-Z]{3,4}\*[0-9]{4}/) ?? [])[0] ?? "").replace(/\*/g, "");

        let course = {
          id: Math.random(),
          description: $li.find("div.search-coursedescription").text().trim(),
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
        $li.find("div.search-coursedataheader").each((_index, $div) => {
          const label = $div.textContent.trim();
          if (!label) return;

          const content = $div.nextSibling;
          const span = content.childNodes[0];

          if (span) course[labels[label]] = span.textContent.trim();
        });

        // Get the terms for this course's sections
        const sectionTerms = [];
        $li.find("div[data-bind='foreach: TermsAndSections'] > h4").each((index, e) => {
          const term = e.textContent.trim();
          sectionTerms[index] = term;
        });

        // Iterate over all sections for this course
        $li.find(`div[data-bind='foreach: TermsAndSections'] > ul`).each((groupIndex, list) => {
          list.querySelectorAll("li").forEach((sectionElement) => {
            const textElement = sectionElement.querySelector("a.search-sectiondetailslink");
            const sectionCode = textElement.textContent.trim().split("*")[2];
            const section = {
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

            const sectionId = textElement.getAttribute("id");

            let meetings = [];

            // Iterate over section rows
            sectionElement.querySelectorAll("table tbody tr").forEach((row, index) => {
              // Is this some hidden garbage that we don't need? If so, skip.
              if (row.getAttribute("style")?.includes("display: none")) return;

              // This is the row that contains instructor data
              if (index === 0) {
                // Get the last td in this row
                const td = row.querySelector("td:last-child");
                // Select first span within first div of this td
                const instructorName = td.querySelector("div > span:first-child").textContent.trim();

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
              const daysTextContent = row.querySelector(`#${sectionId}-meeting-days-${index}`)?.textContent?.trim();

              let meeting: any = {
                days: daysTextContent.length === 0 ? [] : daysTextContent.split("/"),
                startTime: row.querySelector(`#${sectionId}-meeting-times-start-${index}`)?.textContent?.trim(),
                endTime: row.querySelector(`#${sectionId}-meeting-times-end-${index}`)?.textContent?.trim(),
                id: Math.random(),
              };

              row.querySelectorAll("td.esg-table-body__td.search-sectionlocations div span").forEach((e, itemIndex) => {
                let text = e?.textContent.trim();
                if (text.length === 0) return;
                if (itemIndex === 2) meeting.location = text;
                else if (itemIndex === 3) meeting.room = text;
              });

              if (meeting.location === "VIRTUAL") {
                delete meeting.room;
              }

              // LAB, LEC, SEM, etc.
              const meetingType = row
                .querySelector(`#${sectionId}-meeting-instructional-method-${index}`)
                ?.textContent.trim();

              // Convert meeting days into booleans on our section object
              Object.entries(meetingDays).forEach(([key, val]) => {
                meeting[val] = meeting.days.includes(key);
              });

              delete meeting.days;

              if (meetingType === "LEC") {
                lectures.push(meeting);
                section.HAS_LECTURE.push(meeting.id);
              } else if (meetingType === "SEM") {
                seminars.push(meeting);
                section.HAS_SEMINAR.push(meeting.id);
              } else if (meetingType === "TUT") {
                tutorials.push(meeting);
                section.HAS_TUTORIAL.push(meeting.id);
              } else if (meetingType === "LAB") {
                labs.push(meeting);
                section.HAS_LAB.push(meeting.id);
              } else if (meetingType === "EXAM") {
                exams.push(meeting);
                section.HAS_EXAM.push(meeting.id);
              }

              meetings.push(meeting);
            });

            course.HAS_SECTION.push(section.id);
            sections.push(section);
          });
        });

        courses.push(course);
      })
      .then(() => {
        cy.writeFile(
          "scrape-data.json",
          JSON.stringify({ courses, labs, lectures, seminars, tutorials, exams, sections, instructors }, null, 2)
        );
      });
  });
});
