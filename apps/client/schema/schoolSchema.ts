import * as Yup from "yup";

const schoolSchema = Yup.object({
  city: Yup.string().required(),
  name: Yup.string().required(),
  abbrev: Yup.string().required(),
});

export default schoolSchema;
