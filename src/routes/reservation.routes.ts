import { Router } from 'express'
import {
    createReservation,
    getUserActiveReservations,
    returnBook
} from '../controllers/reservation.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import {
    createReservationSchema,
    returnBookSchema
} from '../schemas/reservation.schema'

const router = Router()

router.post(
    '/',
    authenticate,
    validate(createReservationSchema),
    createReservation
)
router.post('/return', authenticate, validate(returnBookSchema), returnBook)
router.get('/active', authenticate, getUserActiveReservations)

export const reservationRoutes = router
