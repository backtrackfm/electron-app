import { z } from "zod";
import { PASSWORD, STD_STRING, blankable } from "./schemaUtils";

export const signUpSchema = z.object({
  email: STD_STRING.email(),
  name: STD_STRING.max(16),
  password: PASSWORD,
  type: z.enum(["ARTIST", "PRODUCER", "ENGINEER"]).default("ARTIST"),
});

export const editUserSchema = z.object({
  password: PASSWORD,
  email: blankable(STD_STRING.email()),
  name: blankable(STD_STRING.max(16)),
  newPassword: blankable(PASSWORD),
  type: z.enum(["ARTIST", "PRODUCER", "ENGINEER"]).default("ARTIST"),
});
