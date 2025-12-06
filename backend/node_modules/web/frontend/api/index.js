import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Vercel!' })
})

export default app