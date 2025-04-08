import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username should be longer than 3 characters" })
    .max(250, { message: "Username should be less than 250 characters." }),
  password: z
    .string()
    .trim()
    .regex(
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
      "Password must be atleast 8 character long and contain atleast 1 number, 1 letter and one special character"
    ),
});
