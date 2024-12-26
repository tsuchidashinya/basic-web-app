import { login } from '@/controller/auth'
import express from 'express'

const authRouter = express.Router()

authRouter.post('/', login)

export { authRouter }
