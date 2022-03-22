# Courses API Routes

| Route | REST Method (Post,get,put,delete) | Description | Sample output |
|------------|-------------|----------------|-------------|
| /programs | GET | Gets all programs |-------------|
| /programs/search | GET | Gets all programs matching predefined criteria |-------------|
| /programs/:id | GET | Gets a specific program by id |-------------|
| /programs/:id/update | POST | Updates an existing program's data |-------------|
| /programs/:id/major | GET | Gets the course tree for a program major |-------------|
| /programs/:id/minor | GET | Gets the course tree for a program minor |-------------|
| /programs/:id/area | GET | Gets the course tree for a program area of concentration  |-------------|
| /courses | GET | Gets all existing courses |```ts{courses:[Coursecode: {courseName, courseNumber, departmentCode, semestersOffered, creditWeight, description, location, prereqs, coreqs, restrictions, equates, associatedDepartments, yearsOffered, school}]```|
| /courses/:school | GET | Gets all the courses specific to a school |-------------|
| /courses/search | GET | Returns courses based on search parameter |-------------|
| /courses/:id | GET | Returns a specific course's data |-------------|
| /courses/:id/update | POST | Updates an existing course object's data |-------------|
| /graph/program/:id | GET | Returns prerequisite courses and required courses to graph a course's progression |-------------|
| /graph/course/:id | GET | Returns prerequisite courses and required courses to graph a course's progression |-------------|
