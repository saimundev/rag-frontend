import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const tournamentSchema = z.object({
  name: z.string().min(3, 'Tournament name is required'),
  season: z.string().regex(/^20\d{2}$/, 'Season must be a year like 2025'),
  startDate: z
    .string()
    .datetime({ message: 'Start date must be valid ISO format' }),
  endDate: z
    .string()
    .datetime({ message: 'End date must be valid ISO format' }),
  status: z.string(),
  numberOfTeams: z.number().min(2, 'At least two teams required'),
  format: z.string(),
  priseMoney: z.number().min(0),
  rules: z.string(),
});

export class CreateTournamentDto extends createZodDto(tournamentSchema) {}
