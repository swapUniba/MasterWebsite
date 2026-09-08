import { describe, expect, it } from 'vitest';
import { courseSchema, facultySchema, masterSchema, newsSchema } from '../src/content/schemas';

describe('schemi editoriali', () => {
  it('accetta i dati minimi del master', () => {
    expect(masterSchema.safeParse({
      title: 'Master in AI e Data Science', short_title: 'Master AI & Data Science',
      subtitle: 'Dati e intelligenza per innovare', summary: 'Percorso congiunto.',
      academic_year: '2026/2027',
      institutions: [
        { name: 'Università degli Studi di Bari Aldo Moro', short_name: 'UniBa', url: 'https://www.uniba.it' },
        { name: 'Politecnico di Bari', short_name: 'PoliBa', url: 'https://www.poliba.it' },
      ],
      duration: '12 mesi', cfu: 60, total_hours: 1500, fee: '€ 3.500',
      teaching_mode: 'Mista', schedule: 'Formula weekend', location: 'Bari', demo_notice: 'Dati demo',
    }).success).toBe(true);
  });

  it('rifiuta un corso con ore negative', () => {
    expect(courseSchema.safeParse({ code: 'A1', title: 'Dati', summary: 'Sintesi', cfu: 5,
      hours: -1, semester: 'Primo semestre', lecturers: [], order: 10, featured: true }).success).toBe(false);
  });

  it('richiede alt quando è presente una foto', () => {
    expect(facultySchema.safeParse({ name: 'Mario Rossi', role: 'Professore', affiliation: 'UniBa',
      category: 'Docente', photo: '/images/faculty/rossi.webp', order: 10, featured: true }).success).toBe(false);
  });

  it('imposta le news come bozze per default', () => {
    const parsed = newsSchema.parse({ title: 'Notizia', date: '2026-10-01', summary: 'Sintesi' });
    expect(parsed.draft).toBe(true);
  });
});
