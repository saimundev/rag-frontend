import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const pointTableSchema = z.object({
  tournamentName:z.string(),
  teamName:z.string(),
  tournamentId: z.number({
    required_error: 'Tournament ID is required',
  }),
  teamId: z.number({
    required_error: 'Team ID is required',
  }),
  matchesPlayed: z.number().min(0).default(0),
  wins: z.number().min(0).default(0),
  losses: z.number().min(0).default(0),
  ties: z.number().min(0).default(0),
  noResults: z.number().min(0).default(0),
  points: z.number().min(0).default(0),
  netRunRate: z.number().default(0),
});

export class CreatePointTableDto extends createZodDto(pointTableSchema) {}
