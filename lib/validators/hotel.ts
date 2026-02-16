import { z } from 'zod';

export const createHotelSchema = z.object({
  name: z.string().min(2, 'Hotel name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  adminName: z.string().min(2, 'Admin name required').optional(),
  adminEmail: z.string().email('Invalid admin email').optional(),
  adminPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
});

export type CreateHotelFormData = z.infer<typeof createHotelSchema>;

export const updateHotelSchema = z.object({
  name: z.string().min(2, 'Hotel name must be at least 2 characters').optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

export type UpdateHotelFormData = z.infer<typeof updateHotelSchema>;

export const createHotelUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER']),
});

export type CreateHotelUserFormData = z.infer<typeof createHotelUserSchema>;
