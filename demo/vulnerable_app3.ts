/*
 * SEEDED VULNERABLE CODE - FOR SCANNER EVALUATION ONLY
 * Intentionally insecure. Do not run, deploy, or expose this file.
 * Each flaw is tagged SEED-Jxxx so results can be matched to manifest.csv.
 */
import crypto from 'crypto'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import express, { type Request, type Response } from 'express'
import { Sequelize } from 'sequelize'

const router = express.Router()
const sequelize = new Sequelize('sqlite::memory:')

// SEED-J006: hard-coded secret (CWE-798)
const JWT_SECRET = 'juice-shop-super-secret-key-123'

// SEED-J001: SQL injection (CWE-89)
router.get('/seed/search', async (req: Request, res: Response) => {
  const q = req.query.q as string
  const rows = await sequelize.query(
    "SELECT * FROM Products WHERE name LIKE '%" + q + "%'"
  )
  res.json(rows)
})

// SEED-J002: OS command injection (CWE-78)
router.get('/seed/ping', (req: Request, res: Response) => {
  const host = req.query.host as string
  exec('ping -c 1 ' + host, (err, stdout) => {
    res.send(err ? 'error' : stdout)
  })
})

// SEED-J003: path traversal (CWE-22)
router.get('/seed/download', (req: Request, res: Response) => {
  const file = req.query.file as string
  const full = path.join('/var/app/uploads', file)
  fs.readFile(full, (err, data) => {
    res.send(err ? 'not found' : data)
  })
})

// SEED-J004: code injection via eval (CWE-94)
router.post('/seed/calc', (req: Request, res: Response) => {
  const expr = req.body.expr as string
  res.send(String(eval(expr)))
})

// SEED-J005: reflected cross-site scripting (CWE-79)
router.get('/seed/greet', (req: Request, res: Response) => {
  const name = req.query.name as string
  res.send('<h1>Welcome, ' + name + '</h1>')
})

// SEED-J007: weak password hashing (CWE-327 / CWE-328)
export function hashPassword (password: string): string {
  return crypto.createHash('md5').update(password).digest('hex')
}

// SEED-J008: server-side request forgery (CWE-918)
router.get('/seed/fetch', async (req: Request, res: Response) => {
  const url = req.query.url as string
  const upstream = await fetch(url)
  res.send(await upstream.text())
})

// SEED-J009: open redirect (CWE-601)
router.get('/seed/redirect', (req: Request, res: Response) => {
  const to = req.query.to as string
  res.redirect(to)
})

// FIXED-J010: reset token now uses a cryptographically secure generator (CWE-338)
export function makeResetToken (): string {
  return crypto.randomBytes(32).toString('hex')
}

export { router, JWT_SECRET }
