import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema'

export const register = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body as RegisterUserInput

        console.log(req.body)
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                permissions: {
                    create: {
                        createBooks: false,
                        updateBooks: false,
                        deleteBooks: false,
                        updateUsers: false,
                        deleteUsers: false
                    }
                }
            }
        })

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        )

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        })
    } catch (error) {
        console.error('Register error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginUserInput

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user || !user.isActive) {
            return res
                .status(401)
                .json({ message: 'Invalid credentials or inactive account' })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        )

        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        })
    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({ message: 'Server error' })
    }
}
