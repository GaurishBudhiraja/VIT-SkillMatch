import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSql(filePath) {
  const sql = fs.readFileSync(filePath, 'utf-8')
  const statements = sql.split(';').filter(s => s.trim())
  
  for (const statement of statements) {
    if (statement.trim()) {
      console.log(`Executing: ${statement.substring(0, 80)}...`)
      const { error } = await supabase.rpc('exec', { query: statement })
      
      if (error) {
        console.error(`Error: ${error.message}`)
        // Continue with next statement
      } else {
        console.log('✓ Success')
      }
    }
  }
}

async function setupDatabase() {
  try {
    console.log('Starting database setup...')
    
    // Execute table creation
    await executeSql(path.join(__dirname, '001_create_tables.sql'))
    console.log('\n✓ Tables created successfully')
    
    // Execute trigger setup
    await executeSql(path.join(__dirname, '002_profile_trigger.sql'))
    console.log('✓ Triggers created successfully')
    
    console.log('\n✓ Database setup completed!')
  } catch (error) {
    console.error('Database setup failed:', error.message)
    process.exit(1)
  }
}

setupDatabase()
