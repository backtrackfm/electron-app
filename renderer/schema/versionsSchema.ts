import { z } from "zod";
import { STD_STRING, blankable } from "./schemaUtils";

export const createVersionSchema = z.object({
  name: STD_STRING,
  tags: blankable(STD_STRING),
  description: blankable(STD_STRING),
});

export const createPreviewSchema = z.object({
  title: STD_STRING,
});
