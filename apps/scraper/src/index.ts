import fs from "fs";
import "tsconfig-paths/register";
import getNeo4jDriver from "./getNeo4jDriver";

(async () => {
  const data = JSON.parse(fs.readFileSync("scrape-data.json", "utf-8"));
  const driver = getNeo4jDriver();
  let session = driver.session();

  // Clear database
  await session.run(`
    MATCH (e)
    DETACH DELETE e
  `);

  await session.close();
  session = driver.session();

  // Add School
  await session.run(`
    CREATE (s:School {
        name: "The University of Guelph",
        code: "UOFG",
        url: "https://www.uoguelph.ca/",
        type: "University",
        address:"50 Stone Rd E",
        city: "Guelph",
        province: "Ontario",
        postalCode: "N1G4V4",
        country: "Canada",
        phone: "519-824-4120"
    })
  `);

  await session.close();

  // Add courses
  for (const course of data.courses) {
    try {
      session = driver.session();
      await session.run(
        `
        MATCH (school: School {code: "UOFG"})
        CREATE (c:Course {
            code: $code,
            name: $name,
            description: $description,
            credits: $credits,
            department: $department,
            number: $number
        }) 
        CREATE (school)-[:HAS_COURSE]->(c)
        `,
        course
      );
      await session.close();
    } catch (error) {
      console.error("Failed to add course");
    }

    for (const sectionId of course.HAS_SECTION) {
      const section = data.sections.find((e) => e.id === sectionId);
      const instructor = data.instructors.find((e) => e.id === section.INSTRUCTED_BY);
      if (!instructor || !section) continue;

      // Add section, instructors
      session = driver.session();
      await session.run(
        `   
            MATCH 
            (school:School {code: "UOFG"})
            -[:HAS_COURSE]->
            (course:Course {code: $courseCode})

            CREATE (section:Section {
                code: $code,
                term: $term
            })

            CREATE (course)-[:HAS_SECTION]->(section)

            MERGE (instructor:Instructor {
                name: $instructorName
            })

            CREATE (section)-[:INSTRUCTED_BY]->(instructor)
        `,
        { ...section, courseCode: course.code, instructorName: instructor.name }
      );
      await session.close();

      for (const lectureId of section.HAS_LECTURE) {
        const lecture = data.lectures.find((e) => e.id === lectureId);
        if (!lecture) continue;
        try {
          session = driver.session();
          await session.run(
            `
            MATCH 
            (course:Course {code :$courseCode})
            -[:HAS_SECTION]->
            (section:Section {code: $sectionCode})

            CREATE (lecture:Lecture {
                startTime: $endTime,
                endTime: $endTime,
                location: $location,
                room: $room,
                monday: $monday,
                tuesday: $tuesday,
                wednesday: $wednesday,
                thursday: $thursday,
                friday: $friday,
                saturday: $saturday,
                sunday: $sunday
            })

            CREATE (section)-[:HAS_LECTURE]->(lecture)
        `,
            { ...lecture, courseCode: course.code, sectionCode: section.code }
          );
          await session.close();
        } catch (error) {
          console.error("Error creating lecture");
        }
      }
      for (const labId of section.HAS_LAB) {
        const lab = data.lectures.find((e) => e.id === labId);
        if (!lab) continue;
        try {
          session = driver.session();
          await session.run(
            `
            MATCH 
            (course:Course {code :$courseCode})
            -[:HAS_SECTION]->
            (section:Section {code: $sectionCode})

            CREATE (lab:Lab {
                startTime: $endTime,
                endTime: $endTime,
                location: $location,
                room: $room,
                monday: $monday,
                tuesday: $tuesday,
                wednesday: $wednesday,
                thursday: $thursday,
                friday: $friday,
                saturday: $saturday,
                sunday: $sunday
            })

            CREATE (section)-[:HAS_LAB]->(lab)
        `,
            { ...lab, courseCode: course.code, sectionCode: section.code }
          );
          await session.close();
        } catch (error) {
          console.error("Error creating lab");
        }
      }
      for (const seminarId of section.HAS_SEMINAR) {
        const seminar = data.seminars.find((e) => e.id === seminarId);
        if (!seminar) continue;
        try {
          session = driver.session();
          await session.run(
            `
            MATCH 
            (course:Course {code :$courseCode})
            -[:HAS_SECTION]->
            (section:Section {code: $sectionCode})

            CREATE (seminar:Seminar {
                startTime: $endTime,
                endTime: $endTime,
                location: $location,
                room: $room,
                monday: $monday,
                tuesday: $tuesday,
                wednesday: $wednesday,
                thursday: $thursday,
                friday: $friday,
                saturday: $saturday,
                sunday: $sunday
            })

            CREATE (section)-[:HAS_SEMINAR]->(seminar)
        `,
            { ...seminar, courseCode: course.code, sectionCode: section.code }
          );
          await session.close();
        } catch (error) {
          console.error("Error creating seminar");
        }
      }
      for (const tutorialId of section.HAS_SEMINAR) {
        const tutorial = data.tutorials.find((e) => e.id === tutorialId);
        if (!tutorial) continue;
        try {
          session = driver.session();
          await session.run(
            `
            MATCH 
            (course:Course {code :$courseCode})
            -[:HAS_SECTION]->
            (section:Section {code: $sectionCode})

            CREATE (tutorial:Tutorial {
                startTime: $endTime,
                endTime: $endTime,
                location: $location,
                room: $room,
                monday: $monday,
                tuesday: $tuesday,
                wednesday: $wednesday,
                thursday: $thursday,
                friday: $friday,
                saturday: $saturday,
                sunday: $sunday
            })

            CREATE (section)-[:HAS_TUTORIAL]->(tutorial)
        `,
            { ...tutorial, courseCode: course.code, sectionCode: section.code }
          );
          await session.close();
        } catch (error) {
          console.error("Error creating tutorial");
        }
      }
    }
  }

  await driver.close();
})();
