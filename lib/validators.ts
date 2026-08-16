import { z } from 'zod'

export const CaseSchema = z.object({
  title: z.string().min(3, 'Judul kasus minimal 3 karakter').max(200, 'Judul terlalu panjang (max 200 karakter)'),
  category: z.enum(['pidana', 'perdata', 'keluarga', 'ketenagakerjaan', 'tatausaha']),
  question: z.string().min(20, 'Deskripsi minimal 20 karakter').max(5000, 'Deskripsi terlalu panjang (max 5000 karakter)'),
})

export const AdviceSchema = z.object({
  case_id: z.string().min(1, 'Case ID diperlukan'),
  query_id: z.string().min(1, 'Query ID diperlukan'),
  question_text: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  category: z.enum(['pidana', 'perdata', 'keluarga', 'ketenagakerjaan', 'tatausaha']).optional(),
})

export type CaseInput = z.infer<typeof CaseSchema>
export type AdviceInput = z.infer<typeof AdviceSchema>
