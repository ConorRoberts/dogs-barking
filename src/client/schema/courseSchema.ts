import * as Yup from "yup";

const courseSchema = Yup.object({
  name: Yup.string().required(),
  id: Yup.string().required(),
  description: Yup.string().required(),
  credits: Yup.number().required(),
  number: Yup.number(),
});

export default courseSchema;
