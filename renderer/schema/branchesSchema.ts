import { z } from "zod";
import { STD_STRING, blankable } from "./schemaUtils";

export const createBranchSchema = z.object({
  name: STD_STRING,
  description: blankable(STD_STRING),
});

export const updateBranchSchema = z.object({
  name: blankable(STD_STRING),
  description: blankable(STD_STRING),
});
