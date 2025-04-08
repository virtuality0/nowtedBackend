import { z, ZodString } from "zod";

export const folderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Folder should be atleast 1 character long" })
    .max(100, { message: "Folder name should be less than 100 characters." }),
});
