export interface User {
  id: string
  email: string
  fullName: string
  role: 'student' | 'employer'
  createdAt: string
}

export interface StudentProfile {
  userId: string
  cgpa: number
  department: string
  skills: string[]
  domain: string
  location: string
  resume: string
}

export interface Internship {
  id: string
  companyName: string
  role: string
  description: string
  minCGPA: number
  department: string
  duration: string
  stipend: string
  location: string
  applyLink: string
}

export interface Application {
  id: string
  studentId: string
  internshipId: string
  coverLetter: string
  appliedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

// Mock Companies and Internships
export const mockInternships: Internship[] = [
  {
    id: '1',
    companyName: 'TechCorp Innovation Labs',
    role: 'Software Development Intern',
    description: 'Join our software development team and work on cutting-edge projects using modern tech stack. You will learn full-stack development and collaborate with experienced engineers.',
    minCGPA: 7.5,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹20,000/month',
    location: 'Bangalore',
    applyLink: '/apply/techcorp-sde',
  },
  {
    id: '2',
    companyName: 'DataMind Analytics',
    role: 'Data Science Intern',
    description: 'Work with our data science team on machine learning projects. Analyze large datasets and build predictive models using Python and TensorFlow.',
    minCGPA: 8.0,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹18,000/month',
    location: 'Delhi',
    applyLink: '/apply/datamind-ds',
  },
  {
    id: '3',
    companyName: 'CloudFirst Systems',
    role: 'Cloud Infrastructure Intern',
    description: 'Learn cloud computing with AWS and Azure. Work on infrastructure automation, deployment pipelines, and cloud architecture design.',
    minCGPA: 7.8,
    department: 'CSE',
    duration: '4 months',
    stipend: '₹19,000/month',
    location: 'Hyderabad',
    applyLink: '/apply/cloudfirst-infra',
  },
  {
    id: '4',
    companyName: 'SecureWeb Solutions',
    role: 'Cybersecurity Intern',
    description: 'Participate in security testing and vulnerability assessment. Learn about ethical hacking, penetration testing, and security best practices.',
    minCGPA: 8.2,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹21,000/month',
    location: 'Mumbai',
    applyLink: '/apply/secureweb-cyber',
  },
  {
    id: '5',
    companyName: 'MobileFirst Tech',
    role: 'Mobile App Development Intern',
    description: 'Build mobile applications using React Native and Flutter. Work on real-world apps used by millions of users.',
    minCGPA: 7.6,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹17,500/month',
    location: 'Pune',
    applyLink: '/apply/mobilefirst-app',
  },
  {
    id: '6',
    companyName: 'AI Innovations Hub',
    role: 'AI/ML Intern',
    description: 'Work on artificial intelligence projects including NLP, computer vision, and deep learning. Contribute to cutting-edge AI research.',
    minCGPA: 8.5,
    department: 'CSE',
    duration: '4 months',
    stipend: '₹22,000/month',
    location: 'Bangalore',
    applyLink: '/apply/aiinnov-ml',
  },
  {
    id: '7',
    companyName: 'BlockChain Ventures',
    role: 'Blockchain Developer Intern',
    description: 'Develop smart contracts and decentralized applications. Learn Solidity, Ethereum, and blockchain architecture.',
    minCGPA: 7.9,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹20,500/month',
    location: 'Bangalore',
    applyLink: '/apply/blockchain-dev',
  },
  {
    id: '8',
    companyName: 'DevOps Masters',
    role: 'DevOps Intern',
    description: 'Learn containerization with Docker and Kubernetes. Set up CI/CD pipelines and infrastructure automation.',
    minCGPA: 7.7,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹18,500/month',
    location: 'Gurgaon',
    applyLink: '/apply/devops-masters',
  },
  {
    id: '9',
    companyName: 'Frontend Masters Studio',
    role: 'Frontend Development Intern',
    description: 'Create beautiful user interfaces using React, Vue, or Angular. Work on responsive web design and UX optimization.',
    minCGPA: 7.4,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹16,500/month',
    location: 'Remote',
    applyLink: '/apply/frontend-masters',
  },
  {
    id: '10',
    companyName: 'Backend Genius Labs',
    role: 'Backend Development Intern',
    description: 'Build scalable backend systems using Node.js, Python, or Go. Design APIs and optimize database performance.',
    minCGPA: 7.5,
    department: 'CSE',
    duration: '3 months',
    stipend: '₹19,000/month',
    location: 'Bangalore',
    applyLink: '/apply/backend-genius',
  },
]

// Session storage utilities
export function saveUserSession(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}

export function getUserSession(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function clearUserSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('studentProfile')
    localStorage.removeItem('applications')
  }
}

export function saveStudentProfile(userId: string, profile: StudentProfile): void {
  if (typeof window !== 'undefined') {
    const profiles = getStudentProfiles()
    profiles[userId] = profile
    localStorage.setItem('studentProfile', JSON.stringify(profiles))
  }
}

export function getStudentProfile(userId: string): StudentProfile | null {
  if (typeof window !== 'undefined') {
    const profiles = getStudentProfiles()
    return profiles[userId] || null
  }
  return null
}

export function getStudentProfiles(): Record<string, StudentProfile> {
  if (typeof window !== 'undefined') {
    const profiles = localStorage.getItem('studentProfile')
    return profiles ? JSON.parse(profiles) : {}
  }
  return {}
}

export function saveApplication(application: Application): void {
  if (typeof window !== 'undefined') {
    const applications = getApplications()
    applications.push(application)
    localStorage.setItem('applications', JSON.stringify(applications))
  }
}

export function getApplications(userId?: string): Application[] {
  if (typeof window !== 'undefined') {
    const applications = localStorage.getItem('applications')
    const allApps = applications ? JSON.parse(applications) : []
    return userId ? allApps.filter((app: Application) => app.studentId === userId) : allApps
  }
  return []
}

export function getApplicationByInternship(userId: string, internshipId: string): Application | null {
  const applications = getApplications(userId)
  return applications.find((app) => app.internshipId === internshipId) || null
}

// Initialize demo user if not already present
export function initializeDemoUser(): void {
  if (typeof window !== 'undefined') {
    const users = localStorage.getItem('users')
    const usersList = users ? JSON.parse(users) : []

    // Check if demo user already exists
    const demoUserExists = usersList.some((u: any) => u.email === 'student@demo.com')

    if (!demoUserExists) {
      const demoUser = {
        id: 'user_demo_001',
        email: 'student@demo.com',
        fullName: 'Demo Student',
        password: 'demo123',
        role: 'student' as const,
        createdAt: new Date().toISOString(),
      }
      usersList.push(demoUser)
      localStorage.setItem('users', JSON.stringify(usersList))

      // Also create a demo profile
      const demoProfile: StudentProfile = {
        userId: demoUser.id,
        cgpa: 8.2,
        department: 'CSE',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        domain: 'Full Stack',
        location: 'Bangalore',
        resume:
          'Final year CSE student with strong interest in full-stack development. Experienced in building web applications with React and Node.js. Active in competitive programming and open-source contributions.',
      }
      saveStudentProfile(demoUser.id, demoProfile)
    }
  }
}
