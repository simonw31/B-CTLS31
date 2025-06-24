import { z } from 'zod';

export const employeeSchema = z.object({
  nom: z.string().min(1, 'Nom obligatoire'),
  prenom: z.string().min(1, 'Prénom obligatoire'),
  matricule: z.number().int().nullable().optional(),
  dateNaissance: z.string().min(1, 'Date obligatoire').datetime({ message: 'Date non valide' }),
  sexe: z.enum(['homme', 'femme', 'autre']),
  nationalite: z.string().min(1),
  adresse: z.string().min(1),
  complementAdresse: z.string().nullable().optional(),
  codePostal: z.string().min(1),
  ville: z.string().min(1),
  iban: z.string().min(10), // Améliorable mais déjà une base
  bic: z.string().min(1),
  securiteSociale: z.string().min(1),
  urgenceNom: z.string().min(1),
  urgencePrenom: z.string().min(1),
  urgenceTel: z.string().min(1),
  moyenTransport: z.string().nullable().optional(),
});
