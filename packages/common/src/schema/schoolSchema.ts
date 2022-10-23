import { z } from "zod";

const schoolSchema = z.object({
  country: z.string(),
  address: z.string(),
  province: z.string(),
  phone: z.string(),
  city: z.string(),
  postalCode: z.string(),
  name: z.string(),
  short: z.string(),
  id: z.string(),
  type: z.string(),
  url: z.string(),
});

export default schoolSchema;
