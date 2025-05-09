import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'
import {
    BookFilterInput,
    CreateBookInput,
    UpdateBookInput
} from '../schemas/book.schema'

export const createBook = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const {
            title,
            author,
            genre,
            publishedDate,
            publisher,
            availableCopies
        } = req.body as CreateBookInput

        const book = await prisma.book.create({
            data: {
                title,
                author,
                genre,
                publishedDate: new Date(publishedDate),
                publisher,
                availableCopies: availableCopies || 1
            }
        })

        return res.status(201).json({
            message: 'Book created successfully',
            book
        })
    } catch (error) {
        console.error('Create book error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getBookById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const bookId = parseInt(id)

        const book = await prisma.book.findFirst({
            where: {
                id: bookId,
                isActive: true
            },
            include: {
                reservations: {
                    select: {
                        id: true,
                        reservedAt: true,
                        returnDate: true,
                        returnedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        reservedAt: 'desc'
                    }
                }
            }
        })

        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        return res.status(200).json(book)
    } catch (error) {
        console.error('Get book by ID error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const searchBooks = async (req: Request, res: Response) => {
    try {
        const {
            title,
            author,
            genre,
            publisher,
            publishedBefore,
            publishedAfter,
            available,
            includeInactive
        } = req.query as unknown as BookFilterInput

        const filter: any = {
            isActive: includeInactive ? undefined : true,
            title: title ? { contains: title, mode: 'insensitive' } : undefined,
            author: author
                ? { contains: author, mode: 'insensitive' }
                : undefined,
            genre: genre ? { contains: genre, mode: 'insensitive' } : undefined,
            publisher: publisher
                ? { contains: publisher, mode: 'insensitive' }
                : undefined
        }

        if (publishedBefore) {
            filter.publishedDate = {
                ...filter.publishedDate,
                lte: new Date(publishedBefore)
            }
        }

        if (publishedAfter) {
            filter.publishedDate = {
                ...filter.publishedDate,
                gte: new Date(publishedAfter)
            }
        }

        if (available === true) {
            filter.availableCopies = {
                gt: 0
            }
        }

        const books = await prisma.book.findMany({
            where: filter,
            orderBy: {
                title: 'asc'
            }
        })

        return res.status(200).json(books)
    } catch (error) {
        console.error('Search books error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const updateBook = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const { id } = req.params
        const bookId = parseInt(id)

        const book = await prisma.book.findUnique({
            where: { id: bookId }
        })

        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        const {
            title,
            author,
            genre,
            publishedDate,
            publisher,
            availableCopies
        } = req.body as UpdateBookInput

        const updateData: any = {}

        if (title) updateData.title = title
        if (author) updateData.author = author
        if (genre) updateData.genre = genre
        if (publishedDate) updateData.publishedDate = new Date(publishedDate)
        if (publisher) updateData.publisher = publisher
        if (typeof availableCopies !== 'undefined')
            updateData.availableCopies = availableCopies

        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: updateData
        })

        return res.status(200).json({
            message: 'Book updated successfully',
            book: updatedBook
        })
    } catch (error) {
        console.error('Update book error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const deactivateBook = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const { id } = req.params
        const bookId = parseInt(id)

        const book = await prisma.book.findUnique({
            where: { id: bookId }
        })

        if (!book) {
            return res.status(404).json({ message: 'Book not found' })
        }

        // Soft delete (deactivate) the book
        const deactivatedBook = await prisma.book.update({
            where: { id: bookId },
            data: { isActive: false }
        })

        return res.status(200).json({
            message: 'Book deactivated successfully',
            book: deactivatedBook
        })
    } catch (error) {
        console.error('Deactivate book error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}
