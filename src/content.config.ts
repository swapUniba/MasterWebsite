import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { contactsSchema, courseSchema, deadlinesSchema, editorialSchema, facultySchema, faqSchema, masterSchema, newsSchema } from './content/schemas';

export const collections = {
  master: defineCollection({ loader: glob({ pattern: 'master.yml', base: './src/data' }), schema: masterSchema }),
  deadlines: defineCollection({ loader: glob({ pattern: 'deadlines.yml', base: './src/data' }), schema: deadlinesSchema }),
  contacts: defineCollection({ loader: glob({ pattern: 'contacts.yml', base: './src/data' }), schema: contactsSchema }),
  faq: defineCollection({ loader: glob({ pattern: 'faq.yml', base: './src/data' }), schema: faqSchema }),
  editorial: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/editorial' }), schema: editorialSchema }),
  courses: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/courses' }), schema: courseSchema }),
  faculty: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/faculty' }), schema: facultySchema }),
  news: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/news' }), schema: newsSchema }),
};
