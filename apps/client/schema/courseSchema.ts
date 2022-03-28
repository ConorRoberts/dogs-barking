import { COMBINED } from "@config/regex";
import * as Yup from "yup";

const courseSchema = Yup.object({
  name: Yup.string().required(),
  id: Yup.string().matches(COMBINED).required(),
  description: Yup.string().required(),
  weight: Yup.number().required().lessThan(100),
  number: Yup.number().required().lessThan(10000).moreThan(0),
  nodeId: Yup.number(),
});

export default courseSchema;
