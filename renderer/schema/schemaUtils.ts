import { ZodType, z } from "zod";

export const STD_STRING = z.string().min(3);
export const PASSWORD = z.string().min(6);
export const STRING_ARRAY = z
  .string()
  .min(1)
  .refine(
    (value) => {
      try {
        const parsedValue = JSON.parse(value);
        return (
          Array.isArray(parsedValue) &&
          parsedValue.every((item) => typeof item === "string")
        );
      } catch {
        return false;
      }
    },
    {
      message: "Invalid JSON-formatted string array",
    }
  )
  .transform<string[]>((value) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error("Failed to parse JSON-formatted string array");
    }
  });

export const blankable = (type: ZodType) => {
  return z.union([type, z.literal("")]).optional();
};
