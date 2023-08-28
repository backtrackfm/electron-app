import { z } from "zod";
import { STD_STRING, STRING_ARRAY, blankable } from "./schemaUtils";

export const createProjectSchema = z.object({
  genre: STD_STRING,
  name: STD_STRING,
  tags: STD_STRING.array(),
  description: blankable(STD_STRING),
});

export const updateProjectSchema = z.object({
  genre: blankable(STD_STRING),
  name: blankable(STD_STRING),
  tags: blankable(STRING_ARRAY),
  description: blankable(STD_STRING),
});
