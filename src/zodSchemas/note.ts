import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Note title should be atleast 1 character long." })
    .max(100, { message: "Note tile should be less than 100 character long." }),

  folderId: z.string().trim().min(1, { message: "Please pass a folderId." }),
});
