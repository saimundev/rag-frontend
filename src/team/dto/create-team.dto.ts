import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(2, 'Team name is required'),
  captain: z.string().min(2, 'Captain name is required'),
  coach: z.string().min(2, 'Coach name is required'),
  homeCity: z.string().min(2, 'Home city is required'),
  logoUrl: z.string().url('Logo must be a valid URL'),
  points: z.number().min(0),
  wins: z.number().min(0),
  losses: z.number().min(0),
  tournamentId: z.number(),
});

export class CreateTeamDto extends createZodDto(teamSchema) {}
