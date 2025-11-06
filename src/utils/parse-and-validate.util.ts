import { BadRequestException } from "@nestjs/common";
import { ZodSchema } from "zod";

export function parseAndValidate<T>(schema: ZodSchema<T>, data: any): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new BadRequestException(result.error.errors[0].message);
    }
    return result.data;
  }
  