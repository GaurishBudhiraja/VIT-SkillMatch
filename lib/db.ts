import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

// User queries
export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase()}
  `;
  return result[0];
}

export async function getUserById(userId: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `;
  return result[0];
}

export async function createUser(email: string, passwordHash: string, name: string, role: 'student' | 'employer' | 'admin') {
  const result = await sql`
    INSERT INTO users (email, password_hash, name, role)
    VALUES (${email.toLowerCase()}, ${passwordHash}, ${name}, ${role})
    RETURNING id, email, name, role, created_at
  `;
  return result[0];
}

// Student queries
export async function getStudentByUserId(userId: string) {
  const result = await sql`
    SELECT s.*, u.email, u.name, u.avatar_url
    FROM students s
    JOIN users u ON s.user_id = u.id
    WHERE s.user_id = ${userId}
  `;
  return result[0];
}

export async function createStudent(userId: string, regNo: string, dept: string, sem: number, cgpa: number, skills: string[] = []) {
  const result = await sql`
    INSERT INTO students (user_id, registration_number, department, semester, cgpa, skills)
    VALUES (${userId}, ${regNo}, ${dept}, ${sem}, ${cgpa}, ${skills})
    RETURNING *
  `;
  return result[0];
}

export async function updateStudent(userId: string, data: any) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  
  let query = 'UPDATE students SET ';
  fields.forEach((field, i) => {
    if (i > 0) query += ', ';
    query += `${field} = $${i + 1}`;
  });
  query += ` WHERE user_id = $${fields.length + 1} RETURNING *`;
  
  const result = await sql.unsafe(query, [...values, userId] as any[]);
  return result[0];
}

// Company queries
export async function getCompanyByUserId(userId: string) {
  const result = await sql`
    SELECT c.*, u.email, u.name
    FROM companies c
    JOIN users u ON c.user_id = u.id
    WHERE c.user_id = ${userId}
  `;
  return result[0];
}

export async function createCompany(userId: string, companyName: string, companyEmail: string, industry?: string) {
  const result = await sql`
    INSERT INTO companies (user_id, company_name, company_email, industry)
    VALUES (${userId}, ${companyName}, ${companyEmail}, ${industry || null})
    RETURNING *
  `;
  return result[0];
}

// Internship queries
export async function getInternshipById(id: string) {
  const result = await sql`
    SELECT i.*, c.company_name, c.logo_url, u.name as contact_person
    FROM internship_positions i
    JOIN companies c ON i.company_id = c.id
    JOIN users u ON c.user_id = u.id
    WHERE i.id = ${id}
  `;
  return result[0];
}

export async function getInternshipsByCompany(companyId: string) {
  const result = await sql`
    SELECT * FROM internship_positions
    WHERE company_id = ${companyId}
    ORDER BY created_at DESC
  `;
  return result;
}

export async function getActiveInternships(limit: number = 20, offset: number = 0) {
  const result = await sql`
    SELECT i.*, c.company_name, c.logo_url
    FROM internship_positions i
    JOIN companies c ON i.company_id = c.id
    WHERE i.is_active = true AND c.is_approved = true
    ORDER BY i.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return result;
}

export async function createInternship(companyId: string, data: any) {
  const result = await sql`
    INSERT INTO internship_positions (
      company_id, title, description, required_skills, min_cgpa,
      preferred_departments, duration_weeks, stipend, location, job_type
    ) VALUES (
      ${companyId}, ${data.title}, ${data.description}, ${data.requiredSkills || []},
      ${data.minCgpa || null}, ${data.preferredDepts || []}, ${data.duration || null},
      ${data.stipend || null}, ${data.location || null}, ${data.jobType || 'full-time'}
    )
    RETURNING *
  `;
  return result[0];
}

// Application queries
export async function getApplicationsByStudent(studentId: string) {
  const result = await sql`
    SELECT a.*, i.title, i.stipend, c.company_name, c.logo_url
    FROM applications a
    JOIN internship_positions i ON a.internship_id = i.id
    JOIN companies c ON i.company_id = c.id
    WHERE a.student_id = ${studentId}
    ORDER BY a.applied_at DESC
  `;
  return result;
}

export async function getApplicationsByInternship(internshipId: string) {
  const result = await sql`
    SELECT a.*, s.registration_number, u.name, u.email, s.cgpa, s.skills
    FROM applications a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE a.internship_id = ${internshipId}
    ORDER BY a.applied_at DESC
  `;
  return result;
}

export async function createApplication(studentId: string, internshipId: string) {
  const result = await sql`
    INSERT INTO applications (student_id, internship_id)
    VALUES (${studentId}, ${internshipId})
    ON CONFLICT (student_id, internship_id) DO NOTHING
    RETURNING *
  `;
  return result[0];
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const result = await sql`
    UPDATE applications
    SET status = ${status}
    WHERE id = ${applicationId}
    RETURNING *
  `;
  return result[0];
}

// Saved internships queries
export async function getSavedInternships(studentId: string) {
  const result = await sql`
    SELECT i.*, c.company_name, c.logo_url
    FROM saved_internships si
    JOIN internship_positions i ON si.internship_id = i.id
    JOIN companies c ON i.company_id = c.id
    WHERE si.student_id = ${studentId}
    ORDER BY si.saved_at DESC
  `;
  return result;
}

export async function saveInternship(studentId: string, internshipId: string) {
  const result = await sql`
    INSERT INTO saved_internships (student_id, internship_id)
    VALUES (${studentId}, ${internshipId})
    ON CONFLICT (student_id, internship_id) DO NOTHING
    RETURNING *
  `;
  return result[0];
}

export async function removeSavedInternship(studentId: string, internshipId: string) {
  await sql`
    DELETE FROM saved_internships
    WHERE student_id = ${studentId} AND internship_id = ${internshipId}
  `;
}

// Check eligibility
export async function checkEligibility(studentId: string, internshipId: string) {
  const student = await sql`SELECT * FROM students WHERE id = ${studentId}`;
  const internship = await sql`SELECT * FROM internship_positions WHERE id = ${internshipId}`;
  
  if (!student[0] || !internship[0]) return false;

  const s = student[0];
  const i = internship[0];

  // Check CGPA requirement
  if (i.min_cgpa && s.cgpa < i.min_cgpa) return false;

  // Check department requirement
  if (i.preferred_departments?.length > 0 && !i.preferred_departments.includes(s.department)) return false;

  // Check skills (at least one required skill matches)
  if (i.required_skills?.length > 0) {
    const hasSkill = i.required_skills.some((req: string) => s.skills?.includes(req));
    if (!hasSkill) return false;
  }

  return true;
}

export async function closeConnection() {
  await sql.end();
}
