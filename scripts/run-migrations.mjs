import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { loadSupabaseEnv } from './load-env.mjs'

loadSupabaseEnv()
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = process.env.DATABASE_URL

if (!url) {
  console.error('Falta DATABASE_URL en supabase/.env')
  process.exit(1)
}

const dir = join(root, 'supabase', 'migrations')
const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })

async function run() {
  await client.connect()
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT now()
    )
  `)
  for (const file of files) {
    const done = await client.query('SELECT 1 FROM _migrations WHERE name = $1', [file])
    if (done.rows.length) {
      console.log('skip', file)
      continue
    }
    console.log('apply', file)
    await client.query(readFileSync(join(dir, file), 'utf8'))
    await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file])
  }
  await client.end()
  console.log('OK')
}

run().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
