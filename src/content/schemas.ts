import { z } from 'astro/zod';

const optionalText = z.union([z.literal(''), z.string().trim().min(1)])
  .transform((value) => value || undefined).optional();
const optionalUrl = z.union([z.literal(''), z.string().url()])
  .transform((value) => value || undefined).optional();
const urlOrPublicPath = z.string().refine(
  (value) => value.startsWith('/documents/') || URL.canParse(value),
  'Inserire un URL valido o un percorso in /documents/',
).or(z.literal('')).transform((value) => value || undefined).optional();

export const masterSchema = z.object({
  title: z.string().min(1), short_title: z.string().min(1), subtitle: z.string().min(1),
  summary: z.string().min(1), academic_year: z.string().regex(/^\d{4}\/\d{4}$/),
  institutions: z.array(z.object({ name: z.string().min(1), short_name: z.string().min(1), url: z.string().url() })).min(2),
  duration: z.string().min(1), cfu: z.number().positive(), total_hours: z.number().int().positive(),
  places: z.number().int().positive().optional(), fee: z.string().min(1),
  teaching_mode: z.enum(['In presenza', 'Online', 'Mista']), schedule: z.string().min(1),
  location: z.string().min(1), attendance: optionalText, application_url: optionalUrl,
  official_call_url: urlOrPublicPath, brochure_url: urlOrPublicPath, demo_notice: optionalText,
});

export const deadlinesSchema = z.object({ items: z.array(z.object({
  title: z.string().min(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(), description: optionalText,
  url: z.string().refine((value) => value.startsWith('/') || URL.canParse(value)).optional(),
})) });

export const contactsSchema = z.object({
  general_email: z.string().email(), general_phone: optionalText,
  offices: z.array(z.object({ institution: z.string().min(1), department: z.string().min(1),
    address: z.string().min(1), city: z.string().min(1), postal_code: z.string().min(1),
    email: z.string().email().optional(), website: optionalUrl })).min(2),
  coordinators: z.array(z.object({ name: z.string().min(1), role: z.string().min(1),
    affiliation: z.string().min(1), email: z.string().email().optional() })),
  institutional_links: z.array(z.object({ label: z.string().min(1), url: z.string().url() })),
});

export const faqSchema = z.object({ items: z.array(z.object({
  question: z.string().min(1), answer: z.string().min(1), category: optionalText,
  order: z.number().int().nonnegative(),
})) });

export const editorialSchema = z.object({
  title: z.string().min(1), eyebrow: optionalText, description: z.string().min(1), heading: z.string().min(1),
});

export const courseSchema = z.object({
  code: z.string().min(1), title: z.string().min(1), summary: z.string().min(1),
  cfu: z.number().nonnegative(), hours: z.number().int().nonnegative(),
  semester: z.enum(['Primo semestre', 'Secondo semestre', 'Annuale', 'Altro']),
  lecturers: z.array(z.string().min(1)).default([]), order: z.number().int().nonnegative(),
  featured: z.boolean().default(false),
});

export const facultySchema = z.object({
  name: z.string().min(1), role: z.string().min(1), affiliation: z.string().min(1),
  category: z.enum(['Coordinamento', 'Comitato scientifico', 'Docente', 'Professionista']),
  photo: optionalText, photo_alt: optionalText, email: z.string().email().optional(), website: optionalUrl,
  order: z.number().int().nonnegative(), featured: z.boolean().default(false),
}).superRefine((value, context) => {
  if (value.photo && !value.photo_alt) context.addIssue({ code: 'custom', path: ['photo_alt'], message: 'Testo alternativo obbligatorio' });
});

export const newsSchema = z.object({
  title: z.string().min(1), date: z.coerce.date(), summary: z.string().min(1),
  image: optionalText, image_alt: optionalText, featured: z.boolean().default(false), draft: z.boolean().default(true),
}).superRefine((value, context) => {
  if (value.image && !value.image_alt) context.addIssue({ code: 'custom', path: ['image_alt'], message: 'Testo alternativo obbligatorio' });
});

export type MasterData = z.infer<typeof masterSchema>;
export type ContactsData = z.infer<typeof contactsSchema>;
