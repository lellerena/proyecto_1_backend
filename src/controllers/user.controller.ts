import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'
import { UpdateUserInput } from '../schemas/user.schema'

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                isActive: true,
                permissions: true
            }
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.error('Get profile error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const getUserReservationHistory = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const reservations = await prisma.reservation.findMany({
            where: { userId: req.user.id },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        genre: true,
                        publisher: true,
                        publishedDate: true
                    }
                }
            },
            orderBy: {
                reservedAt: 'desc'
            }
        })

        return res.status(200).json(reservations)
    } catch (error) {
        console.error('Get user reservation history error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const { id } = req.params
        const userId = parseInt(id)

        // Check if user exists
        const userToUpdate = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Check if user has permission to update this user
        if (req.user.id !== userId) {
            const userPermission = await prisma.permission.findFirst({
                where: { userId: req.user.id }
            })

            if (!userPermission?.updateUsers) {
                return res
                    .status(403)
                    .json({
                        message:
                            'You do not have permission to update this user'
                    })
            }
        }

        const { name, password } = req.body as UpdateUserInput
        const updateData: any = {}

        if (name) {
            updateData.name = name
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                isActive: true
            }
        })

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        })
    } catch (error) {
        console.error('Update user error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const deactivateUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const { id } = req.params
        const userId = parseInt(id)

        // Check if user exists
        const userToDeactivate = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!userToDeactivate) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Check if user has permission to deactivate this user
        if (req.user.id !== userId) {
            const userPermission = await prisma.permission.findFirst({
                where: { userId: req.user.id }
            })

            if (!userPermission?.deleteUsers) {
                return res
                    .status(403)
                    .json({
                        message:
                            'You do not have permission to deactivate this user'
                    })
            }
        }

        // Soft delete (deactivate) the user
        const deactivatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                isActive: true
            }
        })

        return res.status(200).json({
            message: 'User deactivated successfully',
            user: deactivatedUser
        })
    } catch (error) {
        console.error('Deactivate user error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}
