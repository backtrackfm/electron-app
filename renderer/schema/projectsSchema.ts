import { z } from "zod";
import { STD_STRING, STRING_ARRAY } from "./schemaUtils";

export const createProjectSchema = z.object({
  genre: STD_STRING,
  name: STD_STRING,
  tags: STD_STRING, // would be just be array but fd doesn't allow anything other than strings.
  description: STD_STRING.optional(),
});

export const updateProjectSchema = z.object({
  genre: STD_STRING.optional(),
  name: STD_STRING.optional(),
  tags: STRING_ARRAY.optional(),
  description: STD_STRING.optional(),
});
