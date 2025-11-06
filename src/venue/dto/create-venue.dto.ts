import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const venueSchema = z.object({
  name: z.string(),
  location: z.string(),
  capacity: z.number().min(10000),
  imageUrl: z.string().url(),
});


export class CreateVenueDto extends createZodDto(venueSchema) {}
