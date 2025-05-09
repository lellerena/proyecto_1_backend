import { z } from 'zod'

export const createBookSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    author: z.string().min(1, { message: 'Author is required' }),
    genre: z.string().min(1, { message: 'Genre is required' }),
    publishedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format'
    }),
    publisher: z.string().min(1, { message: 'Publisher is required' }),
    availableCopies: z.number().int().positive().default(1)
})

export const updateBookSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }).optional(),
    author: z.string().min(1, { message: 'Author is required' }).optional(),
    genre: z.string().min(1, { message: 'Genre is required' }).optional(),
    publishedDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        })
        .optional(),
    publisher: z
        .string()
        .min(1, { message: 'Publisher is required' })
        .optional(),
    availableCopies: z.number().int().positive().optional()
})

export const bookFilterSchema = z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional(),
    publisher: z.string().optional(),
    publishedBefore: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        })
        .optional(),
    publishedAfter: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: 'Invalid date format'
        })
        .optional(),
    available: z.boolean().optional(),
    includeInactive: z.boolean().optional()
})

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>
export type BookFilterInput = z.infer<typeof bookFilterSchema>
