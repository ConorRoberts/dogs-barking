# Makegraph / Related Outputs

## Makegraph

| Query Type | Command | Description | Example Input |
|------------|---------|-------------|---------------|
| Semester | **none** | This will create a graph of all courses offered in the semester provided. **F** for fall, **W** for winter, **S** for summer. The system natively detects if you entered in a semester based on the characters 'F, W, S' | `makegraph F -dpt CIS` |
| Weight | **none** | This will create a graph of all courses with the matching weight **valid weights are:** *0.25, 0.5, 0.50, 0.75, 1, 1.0, 1.00* | `makegraph 0.75 -dpt CIS` |
| Department | **-dpt [department]** | This will create a graph of all the courses with a matching **4 letter** or **3 letter* department code ie: *CIS* or *ENGG*, including their prerequisites and co-requisites  | `makegraph -dpt ENGG` |
| Course Code | **-coursecode [coursecode]** | This will create a graph of all the courses with a specific course code, including their prerequisites and co-requisites. Course codes **must follow the format of `3letters*4numbers` or `4letters*4numbers` | `makegraph -coursecode CIS*3110` |
| LimitNumber | **-limit [number]** | This will limit the amount of courses placed on the graph | `makegraph -limit 10 -dpt CIS` |
| PDFname | **-pdf [name]**| This will create a graph using graphviz and store it in the pdf name provided | `makegraph -pdf GuelphCourses.pdf` |
| Prerequisite | **-prq [prereq]** |  This will create a graph of all the courses that require the specific course code. Course codes **must follow the format of `3letters*4numbers` or `4letters*4numbers` | `makegraph -pdf CIS*3750` |

## Display Variations

| Display Type | Command | Description | Example Input |
|------------|---------|-------------|---------------|
| Path | **-path [keyword]** | This will create a graphviz pdf of all the courses with a specific course code, including it's prerequisites and the courses that require it. Course codes **must follow the format of `3letters*4numbers` or `4letters*4numbers` | `makegraph -path CIS*3110 -ext` 
| External | **-ext** | This will create a graph that includes courses it requires outside of the given department | `makegraph -department ENGG -ext` |
| Terminal mode | **-d** | This will display the graph to the terminal | `makegraph -d -dpt CIS` |
| Graduate | **-g** | This will display the graduate courses on the graph with the undergraduate courses | `makegraph -g -dpt CIS` |
| Level | **-level [courseLevel]** | This will create a graph of the courses in the given level, a level being a number ending in 000. Options are from 1000 - 8000. | `makegraph -dpt CIS -level 3000` |
| Program | **-program [BatchelorProgram]** |  This will create a graph displaying all of the prerequisites and required courses for a single degree program. | `makegraph -program CS`|
| Major | **-major** | Will display the prerequisite tree for only the required Major courses | `makegraph -program CS -major -minor` |
| Minor | **-minor** | Will display the prerequisite tree for only the required Minor courses (where applicable) |---------------|
| Area of Emphasis/Concentration | **-AOE** or **-AOC** |Will display the prerequisite tree for only the required Area of Emphasis or Concentration courses (where applicable)  | `makegraph -program PSYC -major -AOE` |
| Options | **-options** | This will hide option clusters like  `Select 0.5 credits from the following:` | `makegraph -program PSYC -options`
