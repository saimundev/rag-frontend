import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const matchSchema = z.object({
  tournamentName: z.string().min(2, 'Tournament name is required'),
  matchDate: z.string().datetime('Invalid date'),
  tournamentId: z.number(),
  manOfTheMatch: z.string(),
  tossWinnerTeam: z.string(),
  electedTo: z.string(),
  winnerTeam: z.string(),
  status: z.string().min(2, 'Status is required'),
  teamAId: z.number(),
  teamBId: z.number(),
  venueId: z.number(),
});

export class CreateMatchDto extends createZodDto(matchSchema) {}
