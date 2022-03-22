const help = {
    "usage":"query [weight] [semestersoffered] -hdrwgu -[asc/dsc] -prq [prereqs] -dpt [departmentcode] -coursecode [coursecode] -title [keyword] -coursenumber [number] -level [level]",
    "commands" : [
        "-h",
        "-d",
        "-r",
        "-w",
        "-asc",
        "-desc",
        "-prq",
        "-dpt",
        "-coursecode",
        "-title",
        "-coursenumber",
        "-level"
    ],
    "cmddescriptions" : [
        "Brings up the help menu, listing command flags and query types",
        "Verbose mode: Query results will display a detailed description of the course",
        "Displays the results in their raw/unsorted form",
        "Sorts the results by course weightings (0.25, 0.5, 0.75, 1)",
        "(Default) Results will be shown in ascending order, (A-Z, 0-9, etc), to be used with alternative sorting methods",
        "Displays results in reverse/descending order (Z-A, 9-0, etc), to be used with alternative sorting methods",
        "Usage: -prq [x] where x can be a course code, keyword or number of credits, will return all results containing the supplied prerequisites",
        "Usage: -dpt [x] where x is either a 3 letter or 4 letter word ie: ENGG or CIS, will return all results where the department code matches x",
        "Usage: -coursecode [x] where x follows the format of `3 letters : 4 numbers` or `4 letters : 4 numbers` ie: CIS*1300 or PHYS*1130, returns all courses with a matching code",
        "Usage: -title [keyword], will search for all course titles containing keyword",
        "Usage: -coursenumber [x] where x is a 4 digit number between 0-9999, will find all results with with course numbers matching x",
        "Usage: -level [x] where x is 4 digit number ending with 000 (ex: 1000, 2000, etc), will find all results with with course numbers that are the level of x"
    ],
    "querytypes" : [
        "course name",
        "semester",
        "weight",
        "department",
        "number",
        "course code",
        "prerequisite"
    ],
    "querydesc" : [
        "This query will look for all courses containing keywords in the course name. ie: keyword: Programming, will return Intermediate Programming, Object Oriented Programming, etc.",
        "This query will look for all courses offered in a given semester, [S, F, W] summer, fall, winter respectively.",
        "This query will look for all courses with a given credit weight. [0.25, 0.5, 0.75, 1.00]",
        "This query will look for all courses in a specific department code. ie: CIS will return all courses with the department code CIS",
        "This query will return all courses with a given course number (4 Digits), ie: Searching for 1300 will find cis*1300",
        "This query is a combination of department and course code search. ie: key CIS*1300 will return only CIS*1300",
        "This query will search for courses based on prerequisites. \n Accepted are: \n 3 and 4 letter course codes (ie: CIS*1300 or PHYS*1010) \n 3 and 4 letter batchelor codes (BCOMP:SENG, BSC:ENV)"
    ]
};

export default help;