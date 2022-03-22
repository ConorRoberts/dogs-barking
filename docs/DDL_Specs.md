# DDL Schemas

## Course

```Key: course_id + school_id ```

| Parameter | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| course_id | String | Y | The course code (ie: CIS*1300) |
| school_id | String | Y | The school the course is offered at (Ie: UofG) |
| name | String | Y | The course name |
| description | String | Y | The description of the course/any related details |
| credit_req | float | N | The minimum required credits to take the course |
| weight | float | Y | The credit weight of the course |
| number | float | Y | The course number |
| dpt | String | Y | The department offering the course |
| add_req | String | N | Any additional prequisite data (ie: 10.00 credits) |

### Requisite

```Key: course_id + school_id ```

This table covers prequisite, corequisite and restriction data. Serving as a link between courses
| Parameter | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| course_id | String | Y | The course code + course number |
| school_id | String | Y | The school the course is offered at |
| type | String | Y | The type of requisite (Prereq, Coreq) |
| req_course_id | String | Y | The requisite course id |
| req_school_id | String | Y | The requisite school |

### Semesters

```Key: course_id + semester ```1

This table serves as a lookup table for semester offerings
| Parameter | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| course_id | String | Y | The id of the course's offering |
| semester | String | Y | F/W/S |

## Program

```Key: program_id + school_id  ```

| Parameter | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| program_id | String | Y | The program identifier |
| school_id | String | Y | The school identifier |
| major_id | String | N | The identifier of the major section |
| minor_id | String | N | The identifier of the minor section |
| area_id | String | N | The identifier of the area of concentration |
| Restricted | String | N | ---- |

### Section

```Key: section_id  ```

| Parameter | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| section_id | String | Y | The id of the section |
| type | String | Y | Major/Minor/Area |
| school_id | String | Y | unique identifier for the program |
| course_id | String | Y | Id of course belonging to program |
| section_name | String | N | The name of the section |
| subsection_name | String | N | The name of the subsection |

## School

```Key: school_id  ```

| Parameter | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| school_id | String | Y | The id of the school |
| school_name | String | Y | The name of the school |
