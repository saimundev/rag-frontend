import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const playerSchema = z.object({
  name: z.string().min(3),
  age: z.number().min(16).max(50),
  country: z.string().min(2),
  battingStyle: z.string(),
  bowlingStyle: z.string(),
  imageUrl: z.string().url(),
  teamId: z.number(),
  totalRuns: z.number().default(0),
  totalWickets: z.number().default(0),
  role: z.string(),
  Statistics: z.object({
    battingAverage: z.number().default(0),
    battingStrikeRate: z.number().default(0),
    bowlingAverage: z.number().default(0),
    bowlingEconomyRate: z.number().default(0),
    bowlingStrikeRate: z.number().default(0),
  }),
});

export class CreatePlayerDto extends createZodDto(playerSchema) {}
