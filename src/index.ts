import express from 'express'
import morgan from 'morgan'

import dotenv from 'dotenv'
import cors from 'cors'
import { userRoutes } from './routes/user.routes'
import { bookRoutes } from './routes/book.routes'
import { reservationRoutes } from './routes/reservation.routes'
import { authRoutes } from './routes/auth.routes'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// logging middleware

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/reservations', reservationRoutes)

// Root endpoint
app.get('/', (req, res) => {
    res.send('Library Management System API')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
