import { z } from 'zod'

export const registerUserSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
})

export const loginUserSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string()
})

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .optional(),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .optional()
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginUserInput = z.infer<typeof loginUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
