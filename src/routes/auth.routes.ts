import { Router } from 'express'
import { login, register } from '../controllers/auth.controller'
import { validate } from '../middlewares/validate.middleware'
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema'

const router = Router()

router.post('/register', validate(registerUserSchema), register)
router.post('/login', validate(loginUserSchema), login)

export const authRoutes = router
