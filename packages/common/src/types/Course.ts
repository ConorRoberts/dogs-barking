import { z } from "zod";
import { courseSchema } from "../schema";

type Course = z.infer<typeof courseSchema>;

export default Course;
