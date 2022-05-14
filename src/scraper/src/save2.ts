import { readdirSync, writeFileSync, readFileSync } from "fs";
import { courseCodeRegex } from "./config";
import getNeo4jDriver from "./getNeo4jDriver";
import chalk from "chalk";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import reqToList from "./parseRequisites";
import { v4 } from "uuid";
const logs = [];

const save = async () => {
  dotenv.config({ path: ".env" });

  const startTime = new Date().getTime();

  const log = (msg) => {
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

  const files = readdirSync("./data/courses");

  // Get file with greatest number
  const file = files.reduce((prev, curr) => {
    const prevNum = Number(prev.split(".")[0]);
    const currNum = Number(curr.split(".")[0]);
    return prevNum > currNum ? prev : curr;
  });

  const data = JSON.parse(readFileSync("./data/courses/" + file, "utf-8"));
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
        short: "UOFG",
        url: "https://www.uoguelph.ca/",
        type: "University",
        address:"50 Stone Rd E",
        city: "Guelph",
        province: "Ontario",
        postalCode: "N1G4V4",
        country: "Canada",
        phone: "519-824-4120",
        id: "${randomUUID()}"
    })
  `);

  log(chalk.blue("Added school"));

  await session.close();

  // Add courses
  for (const course of data.courses) {
    try {
      session = driver.session();
      await session.run(
        `
        MATCH (school: School {short: "UOFG"})

        CREATE (c:Course {
            code: $code,
            name: $name,
            description: $description,
            credits: $credits,
            department: $department,
            number: $number,
            id: $id
        })

        CREATE (school)-[:OFFERS]->(c)
        `,
        { description: "", ...course, id: randomUUID() }
      );
      await session.close();

      log(chalk.green(`Added ${course.code}`));
    } catch (error) {
      console.error("Failed to add course");
      log(chalk.red(error));
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
            (school:School {short: "UOFG"})
            -[:HAS_COURSE]->
            (course:Course {code: $courseCode})

            CREATE (section:Section {
                code: $code,
                term: $term
            })

            CREATE (course)-[:HAS]->(section)

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
            -[:HAS]->
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

            CREATE (section)-[:HAS]->(lecture)
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
            -[:HAS]->
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

            CREATE (section)-[:HAS]->(lab)
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
            -[:HAS]->
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

            CREATE (section)-[:HAS]->(seminar)
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
            -[:HAS]->
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

            CREATE (section)-[:HAS]->(tutorial)
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
  const output = [];
  // Polling requisite data and creating relationships between nodes
  for (const course of data.courses) {
    // Handle requisites
    const requisiteText = course.requisites.replace("- Must be completed prior to taking this course.", "").trim();

    log(chalk.gray(requisiteText));

    const parsedRequisites = reqToList(requisiteText);
    output.push({ ...parsedRequisites, course: course.code });

    for (const { type, ...req } of parsedRequisites) {
      try {
        if (type === "Course") {
          session = driver.session();
          await session.run(
            `
              MATCH (c1:Course {code: $courseCode})
              MATCH (c2:Course {code: $requisiteCode})
    
              MERGE (c1)-[:REQUIRES]->(c2)
              `,
            { courseCode: course.code, requisiteCode: req.code }
          );
          await session.close();
        } else if (type === "or" || type === "of") {
          const blockId = v4();
          session = driver.session();
          await session.run(
            `
            MATCH (course:Course {code: $courseCode})
            
            CREATE (course)-[:REQUIRES]->(block:OrBlock {
              id: $id,
              type: "course",
              target: $target
            })
            `,
            { courseCode: course.code, id: blockId, target: req?.num ?? 1 }
          );
          await session.close();

          const { list } = req;

          for (const { type, ...e } of list) {
            if (type === "Course" || !type) {
              session = driver.session();
              await session.run(
                `
              MATCH (block:OrBlock {id: $blockId})
              MATCH (course:Course {code: $courseCode})
  
              CREATE (block)-[:REQUIRES]->(course)
              `,
                { courseCode: e, blockId }
              );
              await session.close();
            }
          }
        } else if (type === "Credits including") {
          const { num, list } = req;

          // Create the CreditRequirement
          session = driver.session();
          await session.run(
            `
              MATCH (course: Course {code: $courseCode})
    
              CREATE (course)-[:REQUIRES]->(cr:CreditRequirement {
                id: $id,
                value: $value
              })
              `,
            { courseCode: course.code, id: v4(), value: num }
          );
          await session.close();

          // Create links for the rest of the courses in this block
          for (const e of list) {
            if (e.type === "Course") {
              // Plain old course
              session = driver.session();
              await session.run(
                `
                MATCH (c1: Course {code: $courseCode})
                MATCH (c2: Course {code: $reqCode})
    
                CREATE (c1)-[:REQUIRES]->(c2)
                `,
                { courseCode: course.code, reqCode: e.code }
              );
              await session.close();
            }
          }
        }
      } catch (error) {
        log(chalk.red(error));
      }
    }
  }

  try {
    session = driver.session();
    // Create fulltext search index for courses
    await session.run(
      `
      DROP INDEX courseSearch
      `
    );
    await session.close();
  } catch (error) {
    log(chalk.red(error));
  }
  try {
    session = driver.session();
    await session.run(
      `
      CREATE FULLTEXT INDEX courseSearch FOR (n:Course) ON EACH [n.name,n.code,n.description]
      `
    );
    await session.close();
  } catch (error) {
    log(chalk.red(error));
  }

  await driver.close();

  writeFileSync("Dan-Output.json", JSON.stringify(output, null, 2));
};

(async () => {
  await save();
  writeFileSync("logs.txt", logs.join("\n"));
})();
