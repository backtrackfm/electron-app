import { z } from "zod";
import { STD_STRING, STRING_ARRAY } from "./schemaUtils";

export const createVersionSchema = z.object({
  name: STD_STRING,
  tags: STRING_ARRAY.optional(),
  description: STD_STRING.optional(),
});

export const createPreviewSchema = z.object({
  title: STD_STRING,
});
