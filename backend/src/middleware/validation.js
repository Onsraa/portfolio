import { z } from 'zod';

// Middleware générique de validation
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

// Schémas de validation

// Auth
export const loginSchema = z.object({
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
});

// Articles
export const articleSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200, 'Titre trop long'),
  slug: z.string().optional(),
  excerpt: z.string().max(500, 'Extrait trop long').optional(),
  content: z.array(z.object({
    type: z.enum(['paragraph', 'heading', 'image', 'code', 'quote', 'list']),
    content: z.string().optional(),
    level: z.number().optional(),
    language: z.string().optional(),
    url: z.string().optional(),
    alt: z.string().optional(),
    items: z.array(z.string()).optional(),
  })).optional(),
  cover_image: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().optional(),
});

// Experiences
export const experienceSchema = z.object({
  period: z.string().min(1, 'Période requise'),
  company: z.string().min(1, 'Entreprise requise'),
  role: z.string().min(1, 'Rôle requis'),
  description: z.string().optional(),
  tech: z.array(z.string()).optional(),
  is_current: z.boolean().optional(),
  is_internship: z.boolean().optional(),
});

// Projects
export const projectSchema = z.object({
  project_id: z.string().optional(),
  title: z.string().min(1, 'Titre requis'),
  description: z.string().optional(),
  tech: z.array(z.string()).optional(),
  year: z.string().optional(),
  link: z.string().url('URL invalide').optional().or(z.literal('')),
  image_url: z.string().optional(),
  is_featured: z.boolean().optional(),
});

// Skills
export const skillSchema = z.object({
  category: z.string().min(1, 'Catégorie requise'),
  name: z.string().min(1, 'Nom requis'),
});

export const skillCategorySchema = z.object({
  category: z.string().min(1, 'Catégorie requise'),
  names: z.array(z.string().min(1)),
});

// Settings
export const settingsSchema = z.record(z.string(), z.any());
