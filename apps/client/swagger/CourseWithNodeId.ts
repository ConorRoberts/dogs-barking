/**
 * @swagger
 * components:
 *  schemas:
 *    CourseWithNodeId:
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
 *          nodeId:
 *            type: number
 */
export interface CourseWithNodeId {
  number: number;
  name: string;
  weight: number;
  description: string;
  id: string;
  department: string;
  nodeId: number;
}
