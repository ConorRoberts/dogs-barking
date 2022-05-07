import * as Yup from "yup";

const userSchema = Yup.object({
  school: Yup.string().required().min(1, "School name is required"),
  major: Yup.string().required(),
  minor: Yup.string(),
  coursesTaken: Yup.array().of(Yup.string()),
  id: Yup.string().required(),
});

export default userSchema;
