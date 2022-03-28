/**
 * @swagger
 * components:
 *  schemas:
 *    Program:
 *        type: object
 *        properties:
 *          degree:
 *            type: string
 *          name:
 *            type: string
 *          id:
 *            type: string
 */
export interface Program {
  degree: string;
  name: string;
  id: string;
}
