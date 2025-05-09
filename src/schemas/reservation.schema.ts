import { z } from 'zod'

export const createReservationSchema = z.object({
    bookId: z.number().int().positive(),
    returnDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format'
    })
})

export const returnBookSchema = z.object({
    reservationId: z.number().int().positive()
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>
export type ReturnBookInput = z.infer<typeof returnBookSchema>
