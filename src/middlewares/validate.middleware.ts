import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('Validating request...')
            console.log('Request body:', req.body)
            console.log('Request query:', req.query)
            console.log('Request params:', req.params)
            await schema.parseAsync(req.body)
            // await schema.parseAsync({
            //     body: req.body,
            //     query: req.query,
            //     params: req.params
            // })
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: error.errors
                })
            }
            return res.status(500).json({ message: 'Internal server error' })
        }
    }
}
