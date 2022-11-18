import { z } from "zod";
import schoolSchema from "./schoolSchema";

const programSchema = z.object({
  id: z.string(),
  name: z.string(),
  short: z.string(),
  degree: z.string(),
  major: z.array(z.string()).optional(),
  minor: z.array(z.string()).optional(),
  school: schoolSchema.optional(),
  updatedAt: z.number(),
});

export default programSchema;
