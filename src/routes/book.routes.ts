import { Router } from 'express'
import {
    createBook,
    deactivateBook,
    getBookById,
    searchBooks,
    updateBook
} from '../controllers/book.controller'
import { authenticate, checkPermission } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import {
    bookFilterSchema,
    createBookSchema,
    updateBookSchema
} from '../schemas/book.schema'

const router = Router()

router.post(
    '/',
    authenticate,
    checkPermission('createBooks'),
    validate(createBookSchema),
    createBook
)
router.get('/', validate(bookFilterSchema), searchBooks)
router.get('/:id', getBookById)
router.put(
    '/:id',
    authenticate,
    checkPermission('updateBooks'),
    validate(updateBookSchema),
    updateBook
)
router.delete(
    '/:id',
    authenticate,
    checkPermission('deleteBooks'),
    deactivateBook
)

export const bookRoutes = router
