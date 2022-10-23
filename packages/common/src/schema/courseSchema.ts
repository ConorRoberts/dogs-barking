import { z } from "zod";
import schoolSchema from "./schoolSchema";

const courseSchema = z.object({
  id: z.string(),
  department: z.string(),
  number: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  credits: z.number(),
  school: schoolSchema.optional(),
  requirements: z.array(z.string()),
  label: z.string().optional().default("Course"),
  taken: z.boolean().optional().default(false),
  rating: z.object({
    difficulty: z.number().optional().default(0),
    timeSpent: z.number().optional().default(0),
    usefulness: z.number().optional().default(0),
    ratingCount: z.number().optional().default(0),
  }),
});

export default courseSchema;
