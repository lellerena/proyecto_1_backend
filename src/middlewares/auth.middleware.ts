import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export interface AuthRequest extends Request {
    user?: {
        id: number
        email: string
        name: string
    }
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res
                .status(401)
                .json({ message: 'Authorization token required' })
        }

        const token = authHeader.split(' ')[1]

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            id: number
            email: string
            name: string
        }

        // Check if user exists and is active
        const user = await prisma.user.findFirst({
            where: {
                id: decodedToken.id,
                isActive: true
            }
        })

        if (!user) {
            return res
                .status(401)
                .json({ message: 'User not found or inactive' })
        }

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        }

        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

export const checkPermission = (
    permissionType: keyof Omit<any, 'id' | 'userId' | 'user'>
) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Not authenticated' })
            }

            const permission = await prisma.permission.findFirst({
                where: { userId: req.user.id }
            })

            if (!permission || !permission[permissionType]) {
                return res
                    .status(403)
                    .json({
                        message:
                            'You do not have permission to perform this action'
                    })
            }

            next()
        } catch (error) {
            return res.status(500).json({ message: 'Server error' })
        }
    }
}
