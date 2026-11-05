import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import express, { type Request, type Response } from 'express'
import { Sequelize } from 'sequelize'

const router = express.Router()
const sequelize = new Sequelize('sqlite::memory:')

router.get('/orders/search', async (req: Request, res: Response) => {
  const customer = req.query.customer as string
  const [rows] = await sequelize.query(
    `SELECT * FROM Orders WHERE customer = '${customer}'`
  )
  res.json(rows)
})

router.get('/orders/ping', (req: Request, res: Response) => {
  const host = req.query.host as string
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.send(err ? 'unreachable' : stdout)
  })
})

router.get('/orders/invoice', (req: Request, res: Response) => {
  const name = req.query.name as string
  const file = path.join('/var/app/invoices', name)
  fs.readFile(file, (err, data) => {
    res.send(err ? 'not found' : data)
  })
})

export { router }
