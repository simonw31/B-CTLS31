// src/app/api/contracts/schema.ts
import { z } from 'zod';

export const contractSchema = z.object({
  employeeId: z.string().uuid(),
  type: z.enum(['CDI', 'CDD', 'Autre']),
  role: z.enum(['employe_polyvalent', 'responsable', 'assistant_manager', 'manager']),
  heuresContrat: z.number().positive(),
  statut: z.enum(['en_contrat', 'demission']),
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime().nullable().optional(),
  dateDemissionEffective: z.string().datetime().nullable().optional(),
  dateSuppressionPrevue: z.string().datetime().nullable().optional(),
});

// Schéma pour CREATE (POST) : pas de contractId
export const amendmentCreateSchema = z.object({
  type: z.enum(['avenant', 'modif_permanente']),
  dateDebut: z.string().datetime(),
  dateFin: z.string().datetime().nullable().optional(),
  role: z.enum(['employe_polyvalent', 'responsable', 'assistant_manager', 'manager']).nullable().optional(),
  heuresContrat: z.number().positive().nullable().optional(),
});

// Schéma pour UPDATE (PUT) : contractId attendu
export const amendmentUpdateSchema = amendmentCreateSchema.extend({
  contractId: z.string().uuid(),
});
