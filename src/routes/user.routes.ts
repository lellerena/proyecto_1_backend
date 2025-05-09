import { Router } from 'express'
import {
    deactivateUser,
    getProfile,
    getUserReservationHistory,
    updateUser
} from '../controllers/user.controller'
import { authenticate, checkPermission } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { updateUserSchema } from '../schemas/user.schema'

const router = Router()

router.get('/profile', authenticate, getProfile)
router.get('/reservations/history', authenticate, getUserReservationHistory)
router.put('/:id', authenticate, validate(updateUserSchema), updateUser)
router.delete('/:id', authenticate, deactivateUser)

export const userRoutes = router
