import { z } from 'zod';

export const updateSubscriptionSchema = z
  .object({
    plan: z.enum(['BASIC', 'PREMIUM']).optional(),
    status: z.enum(['ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED']).optional(),
  })
  .refine((data) => data.plan !== undefined || data.status !== undefined, {
    message: 'At least one field (plan or status) must be provided',
  });

export type UpdateSubscriptionFormData = z.infer<
  typeof updateSubscriptionSchema
>;
