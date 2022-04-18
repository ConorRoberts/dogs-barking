import fs, { readdirSync } from "fs";
import "tsconfig-paths/register";
import { courseCodeRegex } from "./config";
import getNeo4jDriver from "./getNeo4jDriver";
import chalk from "chalk";
import { randomUUID } from "crypto";

const save = async () => {
  const startTime = new Date().getTime();

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
    console.log(text);
  };

  const files = readdirSync("./data");

  // Get file with greatest number
  const file = files.reduce((prev, curr) => {
    const prevNum = Number(prev.split(".")[0]);
    const currNum = Number(curr.split(".")[0]);
    return prevNum > currNum ? prev : curr;
  });

  const data = JSON.parse(fs.readFileSync("data/" + file, "utf-8"));
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
        MATCH (school: School {code: "UOFG"})
        CREATE (c:Course {
            code: $code,
            name: $name,
            description: $description,
            credits: $credits,
            department: $department,
            number: $number,
            id: $id
        }) 
        CREATE (school)-[:HAS_COURSE]->(c)
        `,
        { ...course, id: randomUUID() }
      );
      await session.close();

      log(chalk.green(`Added ${course.code}`));
    } catch (error) {
      console.error("Failed to add course");
      log(chalk.red(error));
    }

    for (const sectionId of course.HAS_SECTION) {
      const section = data.sections.find((e: any) => e.id === sectionId);
      const instructor = data.instructors.find((e: any) => e.id === section.INSTRUCTED_BY);
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

  for (const course of data.courses) {
    //   ("(ACCT*3330 or BUS*3330), (ACCT*3340 or BUS*3340)");
    // ("15.00 credits including ACCT*3280, ACCT*3340, ACCT*3350");
    // ("CIS*2520, (CIS*2430 or ENGG*1420)");
    // ("[CIS*1910 or (CIS*2910 and ENGG*1500)], CIS*2520");

    
    // Handle requisites
    let requisiteText = (course.requisites as string)
    .replace("- Must be completed prior to taking this course.", "")
    .trim();
    
    log(chalk.gray(requisiteText));
    
    const ONE_OF_REGEX = /[0-9]+ of ([A-Z]{2,4}\*[0-9]{4}, )+[A-Z]{2,4}\*[0-9]{4}/g;
    const numberOfBlocks = requisiteText.match(ONE_OF_REGEX) ?? [];
    requisiteText = requisiteText.replaceAll(ONE_OF_REGEX, "");

    // ("3 of CIS*1200, CIS*1300, CIS*1500");
    for (const statement of numberOfBlocks) {
      const numCourses = statement.match(/^[0-9]+/g).at(0);

      const courses = statement.match(courseCodeRegex) ?? [];

      const orBlockId = randomUUID();

      // Create an OrBlock using numCourses as target
      session = driver.session();
      await session.run(
        `
          MATCH (c:Course {code: $code})
          CREATE (orBlock:OrBlock {
              target: $numCourses,
              id: $id,
              type: "course"
          })
          CREATE (c)-[:HAS_PREREQUISITE]->(orBlock)
        `,
        { code: course.code.replace("*", ""), numCourses: Number(numCourses), id: orBlockId }
      );
      await session.close();

      log(chalk.yellow(`Added OrBlock for ${course.code.replace("*", "")}`));

      // Attach courses to that OrBlock
      for (const orBlockCourse of courses) {
        session = driver.session();
        await session.run(
          `
            MATCH (course:Course {code: $code})
            MATCH (block:OrBlock {id: $orBlockId})
            CREATE (block)-[:REQUIRES]->(c)
          `,
          { code: orBlockCourse.replace("*", ""), numCourses: Number(numCourses), orBlockId }
        );
        await session.close();

        log(
          chalk.yellowBright(
            `Added link ${course.code.replace("*", "")} -> OrBlock -> ${orBlockCourse.replace("*", "")}`
          )
        );
      }
    }

    const courses = requisiteText.match(courseCodeRegex) ?? [];

    for (const requisite of courses) {
      session = driver.session();
      await session.run(
        `
          MATCH (c:Course {code: $code})
          MATCH (req:Course {code: $requisiteCode})
          CREATE (c)-[:HAS_PREREQUISITE]->(req)
        `,
        { code: course.code.replace("*", ""), id: randomUUID(), requisiteCode: requisite.replace("*", "") }
      );
      await session.close();

      log(chalk.yellowBright(`Added link ${course.code.replace("*", "")} -> ${requisite.replace("*", "")}`));
    }
  }

  await driver.close();
};

(async () => {
  await save();
})();

export default save;
