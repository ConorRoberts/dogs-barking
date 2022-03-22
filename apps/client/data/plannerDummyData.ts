import { Course } from "@typedefs/DegreePlan";

export const exampleCourses : Course[] = [
  {
    id: Math.random().toString(),
    name: "CIS2520 - Data Structures",
    weight: 0.5,
    description:
      "This course is a study of basic data structures, such as lists, stacks, queues, trees, and tables. Topics which will be examined include abstract data types, sequential and linked representations, and an introduction to algorithm analysis; various traversal, search, insertion, removal, and sorting algorithms.",
    prereqs: "CIS2500 / ENGG1420, 1 of CIS1910 / ENGG1500 / MATH2000",
  },
  {
    id: Math.random().toString(),
    name: "CIS3110 - Operating Systems I",
    weight: 0.5,
    description: "This course covers operating systems in theory and practice by focusing on the components in a system: scheduling, resource allocation, process management, multi-programming, multi-tasking, I/O control, file systems, and mechanisms for client-server computing using examples from contemporary operating systems.",
    prereqs: "CIS2500 / ENGG1420, 1 of CIS1910 / ENGG1500 / MATH2000",
  },
  {
    id: Math.random().toString(),
    name: "CIS3760 - Software Engineering",
    weight: 0.75,
    description:
      "This course is an examination of the software engineering process, the production of reliable systems and techniques for the design and development of complex software. Topics include object-oriented analysis, design and modeling, software architectures, software reviews, software quality, software engineering, ethics, maintenance and formal specifications",
    prereqs: "CIS2500 / ENGG1420, 1 of CIS1910 / ENGG1500 / MATH2000",
  },
  {
    id: Math.random().toString(),
    name: "CIS4030 - Mobile Computing",
    weight: 0.5,
    description:
      "This course introduces students to mobile computing and mobile application development. It examines mobile technology, application development, user interaction, data storage, and software tools.",
    prereqs: "CIS2500 / ENGG1420, 1 of CIS1910 / ENGG1500 / MATH2000",
  },
];
