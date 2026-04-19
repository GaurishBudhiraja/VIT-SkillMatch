import { allInternships, getAll100Internships } from '@/lib/internships-100'
import { getDatabase } from '@/server/db/connection'

type SeedInternship = (typeof allInternships)[number]

function normalizeInternship(internship: SeedInternship) {
  return {
    id: internship.id,
    companyName: internship.company,
    role: internship.role,
    description: internship.description,
    domain: internship.domain,
    location: internship.location,
    duration: internship.duration,
    stipend: internship.stipend,
    minCgpa: internship.minCGPA,
    skillsJson: JSON.stringify(internship.skills),
    perksJson: JSON.stringify(internship.perks),
    departmentsJson: JSON.stringify(internship.department),
  }
}

let seeded = false

export function ensureSeedData() {
  if (seeded) {
    return
  }

  const db = getDatabase()
  const countRow = db
    .prepare('SELECT COUNT(*) as count FROM internships')
    .get() as { count: number }

  if (countRow.count > 0) {
    seeded = true
    return
  }

  const insertStatement = db.prepare(`
    INSERT INTO internships (
      id, company_name, role, description, domain, location, duration, stipend, min_cgpa,
      skills_json, perks_json, departments_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const seedItems = getAll100Internships().map(normalizeInternship)

  db.exec('BEGIN')
  try {
    for (const internship of seedItems) {
      insertStatement.run(
        internship.id,
        internship.companyName,
        internship.role,
        internship.description,
        internship.domain,
        internship.location,
        internship.duration,
        internship.stipend,
        internship.minCgpa,
        internship.skillsJson,
        internship.perksJson,
        internship.departmentsJson,
      )
    }
    db.exec('COMMIT')
    seeded = true
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}
