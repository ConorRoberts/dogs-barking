import { readFileSync } from "fs";
import { CourseIndex } from "@dogs-barking/common/types/Course";
import getNeo4jDriver from "./getNeo4jDriver";

(async () => {
  const courses = Object.entries(JSON.parse(readFileSync("./data/courses.json", "utf-8")) as CourseIndex).map(
    ([key, val]) => ({ ...val, courseCode: key })
  );
  //   const programs = Object.entries(JSON.parse(readFileSync("./data/programs.json", "utf-8")) as ProgramIndex)
  //     .map(([key, val]) => ({ ...val, programCode: key }))
  //     .map((e) => ({ school: "uoft", ...e }))
  //     .map((e) => ({ title: "", ...e }));

  const driver = getNeo4jDriver();

  //   let combined_regex = /([A-Z]{3,4}[0-9]{4})|([A-Z]{3}[0-9]{3}[A-Z][0-9])/g;

  for (const course of courses) {
    const session = driver.session();
    await session?.run(
      `
        MATCH (course:Course {id: $courseCode})
        SET course.weight = $weight
        `,
      { courseCode: course.courseCode, weight: (course as any).creditWeight }
    );
    console.log(`${(course as any).courseCode} ${(course as any).creditWeight}`);
    await session.close();
  }

  // for(const program of programs) {
  //     const db = driver.session();
  //     // create program, link school to program
  //     await db.run(
  //     `
  //         MATCH (s: School {abbrev:$school})
  //         MERGE (p: Program{
  //             id: $id,
  //             name: $name,
  //             degree: $degree
  //         })
  //         CREATE (s)-[:OFFERS]->(p)
  //     `,
  //     {
  //         id: program.programCode,
  //         name: program.title,
  //         degree: program.degree,
  //         school: program.school!.toUpperCase(),
  //     }
  //     )
  //     await db.close();
  //     console.log(`Created program ${program.programCode}`);
  //     // Link courses to the program
  //     if(program.major?.courses) {
  //         for(const course of program.major.courses) {
  //             const db2 = driver.session();
  //             if(!course.course) continue;
  //             const matches = course.course.match(combined_regex) ?? [];
  //             if(matches.length === 0) continue;
  //             // process blocks
  //             if(matches.length >= 2) {
  //                 for(const match of matches) {
  //                     const db3 = driver.session();
  //                     await db3.run(
  //                         `
  //                         MATCH (p: Program {id: "${program.programCode}"})
  //                         MATCH (c: Course {id:"${match}"})
  //                         CREATE (p)-[:MAJOR_REQUIRES]->(c)
  //                         `
  //                     )
  //                     await db3.close();
  //                     console.log(`Created link ${program.programCode} -> ${match}`)
  //                 }
  //             } else { // assume a single course is being linked
  //                 // get program and course
  //                 // create an edge between program and course
  //                 const match = matches[0];
  //                 await db2.run(
  //                     `
  //                     MATCH (p: Program {id: "${program.programCode}"})
  //                     MATCH (c: Course {id:"${match}"})
  //                     CREATE (p)-[:MAJOR_REQUIRES]->(c)
  //                     `)
  //                 await db2.close();
  //                 console.log(`Created link ${program.programCode} -> ${match}`)
  //             }
  //         }
  //     }
  //     // check option blocks
  //     if(program.major?.options) {
  //         if(program.major.options.length <= 0) continue;
  //         // create initial option block
  //         for(const option of program.major.options) {
  //             if(option.dpt !== "following") continue;
  //             const db4 = driver.session();
  //             const uuid = randomUUID();
  //             await db4.run(
  //                 `
  //                 MATCH (p: Program {id: "${program.programCode}"})
  //                 MERGE (o: ProgramOption{
  //                     id: $id,
  //                     weight: $weight
  //                 })
  //                 CREATE (p)-[:HAS_OPTION]->(o)
  //                 `,
  //                 {
  //                     id: uuid,
  //                     weight: option.targetWeight
  //                 }
  //                 );
  //             await db4.close();
  //             console.log(`Created option clause ${program.programCode}`);

  //             if(!option.courses || option.courses.length === 0) continue;
  //             // create node links for option blocks
  //             for(const course of option.courses) {
  //                 const db5 = driver.session();
  //                 await db5.run(
  //                     `
  //                     MATCH (c: Course {id: "${course}"})
  //                     MATCH (o: ProgramOption {id: "${uuid}"})
  //                     CREATE (o)-[:MAJOR_REQUIRES]->(c)
  //                     `
  //                     )
  //                 await db5.close();
  //             }
  //         }
  //     }
  //     // Link courses to the program
  //     if(program.minor?.courses) {
  //         for(const course of program.minor.courses) {
  //             const db2 = driver.session();
  //             if(!course.course) continue;
  //             const matches = course.course.match(combined_regex) ?? [];
  //             if(matches.length === 0) continue;
  //             // process blocks
  //             if(matches.length >= 2) {
  //                 for(const match of matches) {
  //                     const db3 = driver.session();
  //                     await db3.run(
  //                         `
  //                         MATCH (p: Program {id: "${program.programCode}"})
  //                         MATCH (c: Course {id:"${match}"})
  //                         CREATE (p)-[:MINOR_REQUIRES]->(c)
  //                         `
  //                     )
  //                     await db3.close();
  //                     console.log(`Created link ${program.programCode} -> ${match}`)
  //                 }
  //             } else { // assume a single course is being linked
  //                 // get program and course
  //                 // create an edge between program and course
  //                 const match = matches[0];
  //                 await db2.run(
  //                     `
  //                     MATCH (p: Program {id: "${program.programCode}"})
  //                     MATCH (c: Course {id:"${match}"})
  //                     CREATE (p)-[:MINOR_REQUIRES]->(c)
  //                     `)
  //                 await db2.close();
  //                 console.log(`Created link ${program.programCode} -> ${match}`)
  //             }
  //         }
  //     }
  //     // check option blocks
  //     if(program.minor?.options) {
  //         if(program.minor.options.length <= 0) continue;
  //         // create initial option block
  //         for(const option of program.minor.options) {
  //             if(option.dpt !== "following") continue;
  //             const db4 = driver.session();
  //             const uuid = randomUUID();
  //             await db4.run(
  //                 `
  //                 MATCH (p: Program {id: "${program.programCode}"})
  //                 MERGE (o: ProgramOption{
  //                     id: $id,
  //                     weight: $weight
  //                 })
  //                 CREATE (p)-[:HAS_OPTION]->(o)
  //                 `,
  //                 {
  //                     id: uuid,
  //                     weight: option.targetWeight
  //                 }
  //                 );
  //             await db4.close();
  //             console.log(`Created option clause ${program.programCode}`);

  //             if(!option.courses || option.courses.length === 0) continue;
  //             // create node links for option blocks
  //             for(const course of option.courses) {
  //                 const db5 = driver.session();
  //                 await db5.run(
  //                     `
  //                     MATCH (c: Course {id: "${course}"})
  //                     MATCH (o: ProgramOption {id: "${uuid}"})
  //                     CREATE (o)-[:MINOR_REQUIRES]->(c)
  //                     `
  //                     )
  //                 await db5.close();
  //             }
  //         }
  //     }
  //     // Link courses to the program
  //     if(program.area?.courses) {
  //         for(const course of program.area.courses) {
  //             const db2 = driver.session();
  //             if(!course.course) continue;
  //             const matches = course.course.match(combined_regex) ?? [];
  //             if(matches.length === 0) continue;
  //             // process blocks
  //             if(matches.length >= 2) {
  //                 for(const match of matches) {
  //                     const db3 = driver.session();
  //                     await db3.run(
  //                         `
  //                         MATCH (p: Program {id: "${program.programCode}"})
  //                         MATCH (c: Course {id:"${match}"})
  //                         CREATE (p)-[:AREA_REQUIRES]->(c)
  //                         `
  //                     )
  //                     await db3.close();
  //                     console.log(`Created link ${program.programCode} -> ${match}`)
  //                 }
  //             } else { // assume a single course is being linked
  //                 // get program and course
  //                 // create an edge between program and course
  //                 const match = matches[0];
  //                 await db2.run(
  //                     `
  //                     MATCH (p: Program {id: "${program.programCode}"})
  //                     MATCH (c: Course {id:"${match}"})
  //                     CREATE (p)-[:AREA_REQUIRES]->(c)
  //                     `)
  //                 await db2.close();
  //                 console.log(`Created link ${program.programCode} -> ${match}`)
  //             }
  //         }
  //     }
  //     // check option blocks
  //     if(program.area?.options) {
  //         if(program.area.options.length <= 0) continue;
  //         // create initial option block
  //         for(const option of program.area.options) {
  //             if(option.dpt !== "following") continue;
  //             const db4 = driver.session();
  //             const uuid = randomUUID();
  //             await db4.run(
  //                 `
  //                 MATCH (p: Program {id: "${program.programCode}"})
  //                 MERGE (o: ProgramOption{
  //                     id: $id,
  //                     weight: $weight
  //                 })
  //                 CREATE (p)-[:HAS_OPTION]->(o)
  //                 `,
  //                 {
  //                     id: uuid,
  //                     weight: option.targetWeight
  //                 }
  //                 );
  //             await db4.close();
  //             console.log(`Created option clause ${program.programCode}`);

  //             if(!option.courses || option.courses.length === 0) continue;
  //             // create node links for option blocks
  //             for(const course of option.courses) {
  //                 const db5 = driver.session();
  //                 await db5.run(
  //                     `
  //                     MATCH (c: Course {id: "${course}"})
  //                     MATCH (o: ProgramOption {id: "${uuid}"})
  //                     CREATE (o)-[:AREA_REQUIRES]->(c)
  //                     `
  //                     )
  //                 await db5.close();
  //             }
  //         }
  //     }
  //     console.log(`Added Program ${program.programCode}`);
  // }

  // await db.run(
  //     `
  //     MERGE (c:School {
  //         name: "University of Guelph",
  //         city: "Guelph",
  //         abbrev: "UOFG"
  //     })
  // `
  // );

  //  OUTDATED SQL
  // for (const course of courses) {
  //     let school_id = "";
  //     if(course.school === "uofg" || course.school === "UofG") {
  //         school_id = "d626b176-8b05-49ac-b678-6c801fb5c617";
  //     }
  //     if(course.school === "uoft" || course.school === "UofT") {
  //         school_id = "7208e395-0fd5-4ba1-aa78-455b6734604a";
  //     }
  //     await client.query(
  //         `
  //         INSERT INTO course (course_id, name, school_id, description, weight, dpt, number) VALUES ($1, $2, $3, $4, $5, $6, $7)
  //     `,
  //         [course.courseCode, course.courseName, school_id, course.description, course.creditWeight, course.departmentCode,course.courseNumber]
  //     );
  //     console.log(`Inserted ${course.courseCode}`);
  // }

  // for (const course of courses) {
  //     const db = driver.session();

  //     await db.run(
  //         `
  //         MATCH (s: School) WHERE s.name=$school
  //         MERGE (c:Course {
  //             id: $id,
  //             name: $name,
  //             description: $description,
  //             number: $number,
  //             department: $department
  //         })
  //         CREATE (s)-[:OFFERS]->(c)
  //     `,
  //         {
  //             id: course.courseCode,
  //             name: course.courseName,
  //             description: course.description,
  //             number: course.courseNumber,
  //             weight: course.creditWeight,
  //             department: course.departmentCode,
  //             school: schoolTranslate[course.school.toLowerCase() as "uofg" | "uoft"],
  //         }
  //     );

  //     console.log("Added course: ", course.courseCode);

  //     db.close();
  // }
  // await driver.close();

  // for (const course of courses) {
  //     for (const pre of course.prerequisites) {
  //         const db = driver.session();

  //         const matches = pre.match(combined_regex) ?? [];
  //         if (matches.length === 0) continue;

  //         if (matches.length >= 2) {
  //             // We have an or block
  //             const blockId = randomUUID();
  //             let str = `
  //                 MATCH (c:Course {id: "${course.courseCode}"})
  //                 CREATE (block: PrerequisiteBlock {id: "${blockId}"})
  //                 CREATE (block)-[:PREREQUISITE_OF]->(c)
  //             `;
  //             await db.run(str);

  //             for (const match of matches) {
  //                 const db2 = driver.session();

  //                 await db.run(`
  //                     MATCH (c:Course {id: "${match}"})
  //                     MATCH (block: PrerequisiteBlock {id: "${blockId}"})
  //                     CREATE (block)-[:OR]->(c)
  //                 `);

  //                 await db2.close();
  //             }
  //         } else {
  //             // No or block
  //             const match = matches[0];
  //             await db.run(
  //                 `
  //                 MATCH (c:Course {id: "${course.courseCode}"})
  //                 MATCH (pre:Course {id: "${match}"})
  //                 CREATE (pre)-[:PREREQUISITE_OF]->(c)
  //             `,
  //                 {
  //                     id: course.courseCode,
  //                     prereq: match,
  //                 }
  //             );
  //         }

  //         console.log(`Added prereqs for ${course.courseCode} <- ${matches.join(", ")}`);

  //         db.close();
  //     }
  // }
  // await driver.close();
})();
