/**
 * @swagger
 * components:
 *  schemas:
 *    Course:
 *        type: object
 *        properties:
 *          number:
 *            type: integer
 *          name:
 *            type: string
 *          weight:
 *            type: number
 *          description:
 *            type: string
 *          id:
 *            type: string
 *          department:
 *            type: string

 */
export interface Course {
  "number": number,
  "name": string,
  "weight": number,
  "description": string,
  "id": string,
  "department": string,
  }