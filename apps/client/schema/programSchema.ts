import * as Yup from "yup";

const programSchema = Yup.object({
  degree: Yup.string().required(),
  name: Yup.string(),
  id: Yup.string().required(),
  nodeId: Yup.number(),
});

export default programSchema;
