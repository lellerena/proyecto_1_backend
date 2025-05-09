import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'
import {
    CreateReservationInput,
    ReturnBookInput
} from '../schemas/reservation.schema'

export const createReservation = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const { bookId, returnDate } = req.body as CreateReservationInput

        // Check if book exists and is available
        const book = await prisma.book.findFirst({
            where: {
                id: bookId,
                isActive: true
            }
        })

        if (!book) {
            return res
                .status(404)
                .json({ message: 'Book not found or inactive' })
        }

        if (book.availableCopies <= 0) {
            return res
                .status(400)
                .json({ message: 'No available copies of this book' })
        }

        // Create reservation and update book availability in a transaction
        const [reservation] = await prisma.$transaction([
            prisma.reservation.create({
                data: {
                    userId: req.user.id,
                    bookId,
                    returnDate: new Date(returnDate)
                },
                include: {
                    book: {
                        select: {
                            title: true,
                            author: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.book.update({
                where: { id: bookId },
                data: { availableCopies: { decrement: 1 } }
            })
        ])

        return res.status(201).json({
            message: 'Book reserved successfully',
            reservation
        })
    } catch (error) {
        console.error('Create reservation error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const returnBook = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const { reservationId } = req.body as ReturnBookInput

        // Check if reservation exists and belongs to the user
        const reservation = await prisma.reservation.findFirst({
            where: {
                id: reservationId,
                userId: req.user.id,
                returnedAt: null // Not yet returned
            },
            include: {
                book: true
            }
        })

        if (!reservation) {
            return res
                .status(404)
                .json({ message: 'Reservation not found or already returned' })
        }

        // Mark as returned and increment available copies in a transaction
        const [updatedReservation] = await prisma.$transaction([
            prisma.reservation.update({
                where: { id: reservationId },
                data: { returnedAt: new Date() },
                include: {
                    book: {
                        select: {
                            title: true,
                            author: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.book.update({
                where: { id: reservation.bookId },
                data: { availableCopies: { increment: 1 } }
            })
        ])

        return res.status(200).json({
            message: 'Book returned successfully',
            reservation: updatedReservation
        })
    } catch (error) {
        console.error('Return book error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getUserActiveReservations = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const reservations = await prisma.reservation.findMany({
            where: {
                userId: req.user.id,
                returnedAt: null, // Not yet returned
                isActive: true
            },
            include: {
                book: true
            },
            orderBy: {
                reservedAt: 'desc'
            }
        })

        return res.status(200).json(reservations)
    } catch (error) {
        console.error('Get user active reservations error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}
