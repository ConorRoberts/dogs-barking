/**
 * @swagger
 * components:
 *  schemas:
 *    CourseSearch:
 *        type: object
 *        properties:
 *          degree:
 *            type: string
 *          department:
 *            type: string
 *          courseId:
 *            type: string
 *          school:
 *            type: string
 *          weight:
 *            type: integer
 *          number:
 *            type: integer
 *          prerequisite:
 *            type: array
 *            items:
 *              type: string
 *          name:
 *            type: string
 *            items:
 *              type: string
 *          sortDir:
 *            type: string
 *            items:
 *              type: string
 *          sortKey:
 *            type: string
 *            items:
 *              type: string
 */
export interface CourseQuery {
  // ID of course (ex. "CIS1500")
  courseId?: string;

  // School abbreviation ("UOFG" or "UOFT")
  school?: string;

  // Course number (ex. 2500)
  number?: number;

  // Checks if description includes the search term
  description?: string;

  // Size of page
  pageSize?: number;

  // Index to start collecting results from
  pageNum?: number;

  // List of course codes (ex. ["CIS1500","CIS2500"])
  prerequisites?: string[];

  // Name of department (ex. "CIS")
  department?: string;

  // Sort order for sorting based on sortKey
  sortDir?: "asc" | "desc";

  // Field to perform sorting on (ex. "description", "number", etc.)
  sortKey?: string;

  // Check if course name includes this term
  name?: string;

  // Float (ex. 0.75)
  weight?: number;

  // Name of degree (ex. "B.A.Sc.")
  degree?: string;
}