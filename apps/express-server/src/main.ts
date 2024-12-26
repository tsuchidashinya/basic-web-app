import env from 'dotenv'
import express from 'express'
import { errorHandler } from './controller/error'
import { corsRouter } from './middleware/cors'
import { sessionRouter } from './middleware/session'
import { appRouter } from './router/index'

env.config()
const baseURL = process.env.BASE_URL
const port = process.env.PORT || 8000

const app = express()

app.use(express.json())

app.use(corsRouter)
app.use(sessionRouter)
app.use(appRouter)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`start ${baseURL}:${port}`)
})
