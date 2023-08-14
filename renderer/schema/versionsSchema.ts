import { z } from "zod";
import { STD_STRING } from "./schemaUtils";

export const createVersionSchema = z.object({
  name: STD_STRING,
  tags: STD_STRING.optional(),
  description: STD_STRING.optional(),
});

export const createPreviewSchema = z.object({
  title: STD_STRING,
});
