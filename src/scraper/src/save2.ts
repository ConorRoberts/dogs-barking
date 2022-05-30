import { readdirSync, writeFileSync, readFileSync } from "fs";
import { courseCodeRegex } from "./config";
import neo4j from "neo4j-driver";
import chalk from "chalk";
import dotenv from "dotenv";
import { v4 } from "uuid";
import convertTime from "./convertTime";
import { Client } from "@opensearch-project/opensearch";

(async () => {
  dotenv.config({ path: ".env" });

  const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}`,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
  );

  const client = new Client({
    node: `https://${process.env.OPENSEARCH_USERNAME}:${process.env.OPENSEARCH_PASSWORD}@${process.env.OPENSEARCH_URL}`,
  });

  const logs = [];
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
  let session;

  // session = driver.session();
  // // Clear database
  // await session.run(`
  //     MATCH (e)
  //     WHERE (e:OrBlock or e:Course or e:Seminar or e:Tutorial or e:Lab or e:CreditRequirement or e:RegistrationRequirement or e:Program or e:Section or e:Instructor or e:Lecture)
  //     DETACH DELETE e
  //   `);

  // await session.close();
  // session = driver.session();

  // Add School
  // await session.run(
  //   `
  //   MERGE (s:School {
  //       short: "UOFG"
  //   })

  //   set s = $data
  // `,
  //   {
  //     data: {
  //       id: v4(),
  //       name: "The University of Guelph",
  //       short: "UOFG",
  //       url: "https://www.uoguelph.ca/",
  //       type: "University",
  //       address: "50 Stone Rd E",
  //       city: "Guelph",
  //       province: "Ontario",
  //       postalCode: "N1G4V4",
  //       country: "Canada",
  //       phone: "519-824-4120",
  //     },
  //   }
  // );

  // log(chalk.blue("Added school"));

  // await session.close();

  // Add courses
  // for (const course of data.courses) {
  //   try {
  //     session = driver.session();
  //     await session.run(
  //       `
  //         MATCH (s: School {short: "UOFG"})

  //         MERGE (c: Course {
  //             code: $code
  //         })

  //         ON CREATE
  //           SET c.id = $id
  //           SET c.name = $name
  //           SET c.description = $description
  //           SET c.credits = $credits
  //           SET c.department = $department
  //           SET c.number = $number
  //           SET c.code = $code
  //           SET c.updatedAt = timestamp()

  //         CREATE (s)-[:OFFERS]->(c)
  //       `,
  //       { description: "", ...course }
  //     );
  //     await session.close();

  //     for (const section of course.sections) {
  //       try {
  //         session = driver.session();
  //         await session.run(
  //           `
  //           MATCH (c:Course {code: $courseCode})
  //           MERGE (c)-[:HAS]->(sec: Section {
  //             code: $section.code
  //           })

  //           ON CREATE
  //             SET sec.id = $section.id
  //             SET sec.code = $section.code
  //             SET sec.year = $section.year
  //             SET sec.semester = $section.semester
  //             SET sec.semester = $section.semester
  //             SET sec.updatedAt = timestamp()

  //           WITH sec

  //           MERGE (i:Instructor {
  //             name: $section.instructor
  //           })

  //           CREATE (sec)-[:INSTRUCTED_BY]->(i)
  //         `,
  //           { courseCode: course.code, section }
  //         );
  //         await session.close();

  //         for (const meetingType of ["lectures", "labs", "exams", "seminars", "tutorials"]) {
  //           try {
  //             session = driver.session();
  //             const label = meetingType[0].toUpperCase() + meetingType.slice(1, -1);
  //             await session.run(
  //               `
  //               MATCH (:Course {code: $courseCode})-[:HAS]->(s: Section {code: $sectionCode})

  //               UNWIND $meetings as meeting

  //               MERGE (m: ${label} {
  //                 days: meeting.days,
  //                 startTime: localtime(meeting.startTime),
  //                 endTime: localtime(meeting.endTime),
  //                 room: meeting.room,
  //                 location: meeting.location
  //               })

  //               ON CREATE
  //                 SET m.id = meeting.id
  //                 SET m:Meeting

  //               MERGE (s)-[:HAS]->(m)
  //           `,
  //               {
  //                 meetings: section[meetingType].map((e) => ({
  //                   ...e,
  //                   startTime: convertTime(e.startTime),
  //                   endTime: convertTime(e.endTime),
  //                 })),
  //                 courseCode: course.code,
  //                 sectionCode: section.code,
  //               }
  //             );
  //           } catch (error) {
  //             log(chalk.red(`Failed to add meeting type: ${meetingType}`));
  //             log(chalk.red(error));
  //           } finally {
  //             await session.close();
  //           }
  //         }
  //       } catch (error) {
  //         log(chalk.red(`Failed to add section: ${section.id}`));
  //         log(chalk.red(error));
  //       }
  //     }

  //     log(chalk.green(`Added ${course.code}`));
  //   } catch (error) {
  //     log(chalk.red(`Failed to add course: ${course.code}`));
  //     log(chalk.red(error));
  //   }
  // }

  // // Polling requisite data and creating relationships between nodes
  // for (const course of data.courses) {
  //   // (ACCT*3330 or BUS*3330), (ACCT*3340 or BUS*3340)
  //   // 15.00 credits including ACCT*3280, ACCT*3340, ACCT*3350
  //   // CIS*2520, (CIS*2430 or ENGG*1420)
  //   // [CIS*1910 or (CIS*2910 and ENGG*1500)], CIS*2520

  //   // Handle requisites
  //   let requisiteText = course.requisites.replace("- Must be completed prior to taking this course.", "").trim();

  //   log(chalk.gray(requisiteText));

  //   const andRegex = /\([A-Z]{2,4}\*[0-9]{4} and [A-Z]{2,4}\*[0-9]{4}\)/g;
  //   const andStatements = requisiteText.match(andRegex) ?? [];

  //   // ("[CIS*1910 or (CIS*2910 and ENGG*1500)], CIS*2520");
  //   const andCount = 0;
  //   for (const statement of andStatements) {
  //     log(chalk.gray("And statement: " + statement));
  //     requisiteText = requisiteText.replace(statement, "and" + andCount);
  //     const courses = statement.match(courseCodeRegex);

  //     const andBlockId = v4();

  //     // Create an AndBlock
  //     session = driver.session();
  //     await session.run(
  //       `
  //       MATCH (c:Course {code: $code})
  //       CREATE (andBlock:AndBlock {
  //           id: $id
  //       })
  //       CREATE (c)-[:REQUIRES]->(andBlock)
  //     `,
  //       { code: course.code, id: andBlockId }
  //     );
  //     await session.close();

  //     for (const andBlockCourse of courses) {
  //       session = driver.session();
  //       await session.run(
  //         `
  //         MATCH (c:Course {code: $code})
  //         CREATE (andBlock:AndBlock {
  //             id: $id
  //         })
  //         CREATE (c)-[:REQUIRES]->(andBlock)
  //       `,
  //         { code: andBlockCourse.replace("*", ""), id: andBlockId }
  //       );
  //       await session.close();

  //       for (const andBlockCourse of courses) {
  //         session = driver.session();
  //         await session.run(
  //           `
  //           MATCH (c:Course {code: $code})
  //           MATCH (block:AndBlock {id: $andBlockId})
  //           CREATE (block)-[:REQUIRES]->(c)
  //         `,
  //           { code: andBlockCourse, andBlockId }
  //         );
  //         await session.close();
  //       }
  //     }
  //   }

  //   const oneOfRegex = /[0-9]+ of ([A-Z]{2,4}\*[0-9]{4}, )+[A-Z]{2,4}\*[0-9]{4}/g;
  //   const numberOfStatements = requisiteText.match(oneOfRegex) ?? [];
  //   requisiteText = requisiteText.replaceAll(oneOfRegex, "");

  //   // ("3 of CIS*1200, CIS*1300, CIS*1500");
  //   for (const statement of numberOfStatements) {
  //     const numCourses = statement.match(/^[0-9]+/g).at(0);

  //     const courses = statement.match(courseCodeRegex) ?? [];

  //     const orBlockId = v4();

  //     // Create an OrBlock using numCourses as target
  //     session = driver.session();
  //     await session.run(
  //       `
  //         MATCH (c:Course {code: $code})
  //         CREATE (orBlock:OrBlock {
  //             target: $numCourses,
  //             id: $id,
  //             type: "course"
  //         })
  //         CREATE (c)-[:REQUIRES]->(orBlock)
  //       `,
  //       { code: course.code.replace("*", ""), numCourses: Number(numCourses), id: orBlockId }
  //     );
  //     await session.close();

  //     // log(chalk.yellow(`Added OrBlock for ${course.code.replace("*", "")}`));

  //     // Attach courses to that OrBlock
  //     for (const orBlockCourse of courses) {
  //       session = driver.session();
  //       await session.run(
  //         `
  //           MATCH (c:Course {code: $code})
  //           MATCH (block:OrBlock {id: $orBlockId})
  //           CREATE (block)-[:REQUIRES]->(c)
  //         `,
  //         { code: orBlockCourse.replace("*", ""), numCourses: Number(numCourses), orBlockId }
  //       );
  //       await session.close();

  //       log(
  //         chalk.yellowBright(
  //           `Added link ${course.code.replace("*", "")} -> OrBlock -> ${orBlockCourse.replace("*", "")}`
  //         )
  //       );
  //     }
  //   }

  //   const creditRequirementRegex = /[0-9]+\.[0-9]+ credits including/g;
  //   const creditRequirementStatements = requisiteText.match(creditRequirementRegex) ?? [];
  //   requisiteText = requisiteText.replaceAll(creditRequirementRegex, "");

  //   for (const statement of creditRequirementStatements) {
  //     const creditRequirementId = v4();
  //     const value = Number(statement.match(/[0-9]+\.[0-9]+/g).at(0));

  //     // Create an OrBlock using numCourses as target
  //     session = driver.session();
  //     await session.run(
  //       `
  //         MATCH (c:Course {code: $code})
  //         CREATE (creditRequirement:CreditRequirement {
  //             value: $value,
  //             id: $id
  //         })
  //         CREATE (c)-[:REQUIRES]->(creditRequirement)
  //       `,
  //       { code: course.code.replace("*", ""), id: creditRequirementId, value }
  //     );
  //     await session.close();

  //     log(chalk.yellowBright(`Added link ${course.code.replace("*", "")} -> CreditRequirement (${value} credits)`));
  //   }

  //   const multipleOrRegex = /[A-Z]{2,4}\*[0-9]{4}( or [A-Z]{2,4}\*[0-9]{4})+/g;
  //   const multipleOrStatements = requisiteText.match(multipleOrRegex) ?? [];
  //   requisiteText = requisiteText.replaceAll(multipleOrRegex, "");

  //   for (const statement of multipleOrStatements) {
  //     const courses = statement.match(courseCodeRegex) ?? [];

  //     const orBlockId = v4();

  //     // Create an OrBlock using numCourses as target
  //     session = driver.session();
  //     await session.run(
  //       `
  //         MATCH (c:Course {code: $code})
  //         CREATE (orBlock:OrBlock {
  //             target: $numCourses,
  //             id: $id,
  //             type: "course"
  //         })
  //         CREATE (c)-[:REQUIRES]->(orBlock)
  //       `,
  //       { code: course.code.replace("*", ""), numCourses: 1, id: orBlockId }
  //     );
  //     await session.close();

  //     log(chalk.yellow(`Added OrBlock for ${course.code.replace("*", "")}`));

  //     // Attach courses to that OrBlock
  //     for (const orBlockCourse of courses) {
  //       session = driver.session();
  //       await session.run(
  //         `
  //           MATCH (c:Course {code: $code})
  //           MATCH (block:OrBlock {id: $orBlockId})
  //           CREATE (block)-[:REQUIRES]->(c)
  //         `,
  //         { code: orBlockCourse.replace("*", ""), numCourses: courses.length, orBlockId }
  //       );
  //       await session.close();

  //       log(
  //         chalk.yellowBright(
  //           `Added link ${course.code.replace("*", "")} -> OrBlock -> ${orBlockCourse.replace("*", "")}`
  //         )
  //       );
  //     }
  //   }

  //   const courses = requisiteText.match(courseCodeRegex) ?? [];

  //   for (const requisite of courses) {
  //     session = driver.session();
  //     await session.run(
  //       `
  //         MATCH (c:Course {code: $code})
  //         MATCH (req:Course {code: $requisiteCode})
  //         CREATE (c)-[:REQUIRES]->(req)
  //       `,
  //       { code: course.code.replace("*", ""), id: v4(), requisiteCode: requisite.replace("*", "") }
  //     );
  //     await session.close();

  //     log(chalk.yellowBright(`Added link ${course.code.replace("*", "")} -> ${requisite.replace("*", "")}`));
  //   }
  // }

  // const programsFolderFiles = readdirSync("./data/programs");

  // // Get file with greatest number
  // const programsFile = programsFolderFiles.reduce((prev, curr) => {
  //   const prevNum = Number(prev.split(".")[0]);
  //   const currNum = Number(curr.split(".")[0]);
  //   return prevNum > currNum ? prev : curr;
  // });

  // const programs: any[] = Object.entries(JSON.parse(readFileSync("./data/programs/" + programsFile, "utf-8")));

  // // Add programs
  // for (const [key, program] of programs) {
  //   if (program.school !== "uofg") continue;

  //   const school = program.school.toUpperCase();
  //   const programId = v4();

  //   try {
  //     session = driver.session();
  //     await session.run(
  //       `
  //         MATCH (school: School {short: $school})

  //         CREATE (program: Program {
  //           short: $short,
  //           name: $name,
  //           degree: $degree,
  //           id: $programId
  //         })

  //         CREATE (school)-[:OFFERS]->(program)
  //       `,
  //       { name: program.title, short: key, degree: program.degree, school, programId }
  //     );
  //     await session.close();

  //     log(`${chalk.green("Added program:")} ${chalk.white(key)}`);

  //     if (program["major"] && program["major"].courses) {
  //       for (const { course: courseBlock, section = "" } of program["major"].courses) {
  //         const blockId = v4();
  //         const blockCourses = courseBlock.split("/").map((e) => e.trim());

  //         if (blockCourses.length > 1) {
  //           // Block contains multiple courses. Create OrBlock accordingly
  //           session = driver.session();
  //           await session.run(
  //             `
  //               MATCH (program:Program {id: $programId})

  //               CREATE (block:OrBlock {
  //                 id: $blockId,
  //                 note: $note,
  //                 target: 1,
  //                 type: "course"
  //               })
  //               CREATE (program)-[:MAJOR_REQUIRES]->(block)
  //               `,
  //             { programId, blockId, note: section }
  //           );
  //           await session.close();

  //           for (const course of courseBlock.split("/").map((e) => e.trim())) {
  //             session = driver.session();
  //             await session.run(
  //               `
  //                   MATCH (block:OrBlock {id: $blockId})
  //                   MATCH (course:Course {code: $code})
  //                   CREATE (block)-[:REQUIRES]->(course)
  //                   `,
  //               { code: course.replace("*", ""), blockId }
  //             );
  //             await session.close();
  //           }
  //         } else {
  //           // The block only contains a single course
  //           const [course] = blockCourses;
  //           session = driver.session();
  //           await session.run(
  //             `
  //               MATCH (program:Program {id: $programId})
  //               MATCH (course:Course {code: $code})
  //               CREATE (program)-[:MAJOR_REQUIRES]->(course)
  //             `,
  //             { code: course.replace("*", ""), programId }
  //           );
  //           await session.close();
  //         }
  //       }
  //       for (const block of program.major.options) {
  //         session = driver.session();
  //         const [level] = block.text.match(/[0-9]+ level/g) ?? [];
  //         const type = block.text.includes("credits") ? "credit" : "course";

  //         await session.run(
  //           `
  //           MATCH (program:Program {id: $programId})
  //           CREATE (program)-[:MAJOR_REQUIRES]->(block:OrBlock {
  //             id: $blockId,
  //             note: $note,
  //             target: $target,
  //             department: $department,
  //             level: $level,
  //             type: $type
  //           })

  //         `,
  //           {
  //             programId,
  //             blockId: v4(),
  //             note: block.text,
  //             target: block.targetWeight,
  //             department: block.dpt,
  //             level: parseInt(level) ?? -1,
  //             type,
  //           }
  //         );
  //         await session.close();
  //       }
  //     }
  //     if (program["minor"] && program["minor"].courses) {
  //       for (const { course: courseBlock, section = "" } of program["minor"].courses) {
  //         const blockId = v4();
  //         const blockCourses = courseBlock.split("/").map((e) => e.trim());

  //         if (blockCourses.length > 1) {
  //           session = driver.session();
  //           await session.run(
  //             `
  //               MATCH (program:Program {id: $programId})

  //               SET program: Minor

  //               CREATE (program)-[:MINOR_REQUIRES]->(block:OrBlock {
  //                 id: $blockId,
  //                 note: $note,
  //                 target: 1,
  //                 type: "course"
  //               })
  //               `,
  //             { programId, blockId, note: section }
  //           );
  //           await session.close();

  //           for (const course of courseBlock.split("/").map((e) => e.trim())) {
  //             session = driver.session();
  //             await session.run(
  //               `
  //                   MATCH (block:OrBlock {id: $blockId})
  //                   MATCH (course:Course {code: $code})
  //                   CREATE (block)-[:REQUIRES]->(course)
  //                   `,
  //               { code: course.replace("*", ""), blockId }
  //             );
  //             await session.close();
  //           }
  //         } else {
  //           const [course] = blockCourses;
  //           session = driver.session();
  //           await session.run(
  //             `
  //               MATCH (program:Program {id: $programId})
  //               MATCH (course:Course {code: $code})
  //               CREATE (program)-[:MINOR_REQUIRES]->(course)
  //             `,
  //             { code: course.replace("*", ""), programId }
  //           );
  //           await session.close();
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     log(chalk.red("Error: " + key + " - " + error));
  //   }
  //   await session.close();
  // }

  try {
    session = driver.session();
    // Create fulltext search index for courses
    await session.run(
      `
      CREATE INDEX FOR (n:Course) ON (n.id,n.code)
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
          CREATE FULLTEXT INDEX courseSearch FOR (n:Course) ON EACH [n.name,n.code,n.description,n.credits,n.number,n.department]
        `
    );
    await session.close();
  } catch (error) {
    log(chalk.red(error));
  }

  try {
    session = driver.session();
    // Create fulltext search index for courses
    await session.run(
      `
        CREATE INDEX FOR (n:Program) ON (n.id)
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
      CREATE FULLTEXT INDEX programSearch FOR (n:Program) ON EACH [n.name,n.short,n.degree]
      `
    );
    await session.close();
  } catch (error) {
    log(chalk.red(error));
  }

  // Delete programs index
  try {
    await client.indices.delete({
      index: "programs",
    });
    log(chalk.green("[OpenSearch] Deleted program index"));
  } catch (error) {
    log(chalk.red(error));
  }

  // Create programs index
  try {
    await client.indices.create({
      index: "programs",
      body: {
        settings: {
          index: {
            number_of_shards: 4,
            number_of_replicas: 3,
          },
        },
      },
    });
    log(chalk.green("[OpenSearch] Created program index"));
  } catch (error) {
    log(chalk.red(error));
  }

  // Delete courses index
  try {
    await client.indices.delete({
      index: "courses",
    });
    log(chalk.green("[OpenSearch] Deleted course index"));
  } catch (error) {
    log(chalk.red(error));
  }

  // Create courses index
  try {
    await client.indices.create({
      index: "courses",
      body: {
        settings: {
          index: {
            number_of_shards: 4,
            number_of_replicas: 3,
          },
        },
      },
    });
    log(chalk.green("[OpenSearch] Created course index"));
  } catch (error) {
    log(chalk.red(error));
  }

  try{
    // Get programs from Neo4j
    session = driver.session();
    const { records } = await session.run(`
        MATCH (program:Program)
  
        RETURN 
          collect(properties(program)) as programs
    `);
    await session.close();

    // Add programs to index
    for (const program of records[0].get("programs")) {
      await client.index({
        id: program.id,
        index: "programs",
        body: program,
        refresh: true,
      });
      log(`[OpenSearch] Added program: ${program.short}`);
    }
  }catch(error){
    log(chalk.red(error));
  }


  try {
    // Get courses from Neo4j
    session = driver.session();
    const { records } = await session.run(`
        MATCH (course:Course)
  
        RETURN 
          collect(properties(course)) as courses
    `);
    await session.close();
    
    // Add courses to index
    for (const course of records[0].get("courses")) {
      await client.index({
        id: course.id,
        index: "courses",
        body: course,
        refresh: true,
      });
      log(`[OpenSearch] Added course: ${course.code}`);
    }
  }catch(error){
    log(chalk.red(error));
  }
 

  writeFileSync("logs.txt", logs.join("\n"));
  await driver.close();
})();
