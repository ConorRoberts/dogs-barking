/**
 * @swagger
 * components:
 *  schemas:
 *    CourseSearch:
 *        type: object
 *        properties:
 *          degree:
 *            type: string
 *          major:
 *            type: string
 *          department:
 *            type: string
 *          coursecode:
 *            type: string
 *          school:
 *            type: string
 *          weight:
 *            type: integer
 *          coursenum:
 *            type: integer
 *          level:
 *            type: integer
 *          prerequisite:
 *            type: array
 *            items:
 *              type: string
 *          semester:
 *            type: array
 *            items:
 *              type: string
 *          title:
 *            type: array
 *            items:
 *              type: string
 *          path:
 *            type: boolean
 *          options:
 *            type: object
 *            properties:
 *              SortMode:
 *                type: string
 *              SortDirection:
 *                type: string
 *              Scope:
 *                type: string
 *              PrintMode:
 *                type: string
 */
export interface CourseSearch {
  degree: string;
  major: string;
  department: string;
  coursecode: string;
  school: string;
  weight: number;
  coursenum: number;
  level: number;
  prerequisite: string[];
  semester: string[];
  title: string[];
  path: boolean;
  options: {
    SortMode: string;
    SortDirection: string;
    Scope: string;
    PrintMode: string;
  };
}
