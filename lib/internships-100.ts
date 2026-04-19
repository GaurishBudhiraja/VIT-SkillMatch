export interface InternshipListing {
  id: string
  company: string
  role: string
  description: string
  minCGPA: number
  department: string[]
  domain: string
  duration: string
  stipend: string
  location: string
  skills: string[]
  perks: string[]
  applyUrl?: string
}

export const allInternships: InternshipListing[] = [
  // Tech Giants
  {
    id: 'google-001',
    company: 'Google',
    role: 'Software Engineer Intern',
    description: 'Work on cutting-edge projects at Google. Solve real-world problems with talented engineers.',
    minCGPA: 8.5,
    department: ['CSE', 'IT'],
    domain: 'Full Stack Development',
    duration: '3 months',
    stipend: '₹75,000/month',
    location: 'Bangalore',
    skills: ['Python', 'JavaScript', 'System Design'],
    perks: ['Free meals', 'On-campus housing', 'Mentorship'],
    applyUrl: 'https://google.com/careers',
  },
  {
    id: 'microsoft-001',
    company: 'Microsoft',
    role: 'Cloud Engineer Intern',
    description: 'Build scalable cloud solutions using Azure. Work with distributed systems.',
    minCGPA: 8.3,
    department: ['CSE', 'IT'],
    domain: 'Cloud Computing',
    duration: '4 months',
    stipend: '₹70,000/month',
    location: 'Hyderabad',
    skills: ['Azure', 'C#', 'Kubernetes'],
    perks: ['Relocation assistance', 'Mentorship', 'Coffee vouchers'],
    applyUrl: 'https://microsoft.com/careers',
  },
  {
    id: 'amazon-001',
    company: 'Amazon',
    role: 'Backend Development Intern',
    description: 'Scale backend systems that serve millions. Learn microservices architecture.',
    minCGPA: 8.2,
    department: ['CSE', 'IT'],
    domain: 'Backend Development',
    duration: '3 months',
    stipend: '₹72,000/month',
    location: 'Bangalore',
    skills: ['Java', 'AWS', 'SQL'],
    perks: ['Free books', 'Fitness center', 'Learning budget'],
    applyUrl: 'https://amazon.com/careers',
  },

  // Startup Scene
  {
    id: 'startup-001',
    company: 'Swiggy',
    role: 'Full Stack Developer Intern',
    description: 'Build features for food delivery. Work in a fast-paced startup environment.',
    minCGPA: 7.5,
    department: ['CSE', 'IT'],
    domain: 'Full Stack Development',
    duration: '3 months',
    stipend: '₹35,000/month',
    location: 'Bangalore',
    skills: ['React', 'Node.js', 'MongoDB'],
    perks: ['Free food', 'Startup experience', 'Flexible hours'],
    applyUrl: 'https://swiggy.com/careers',
  },
  {
    id: 'startup-002',
    company: 'Byju\'s',
    role: 'Frontend Engineer Intern',
    description: 'Build engaging educational interfaces. Impact millions of students.',
    minCGPA: 7.4,
    department: ['CSE', 'IT'],
    domain: 'Frontend Development',
    duration: '3 months',
    stipend: '₹32,000/month',
    location: 'Bangalore',
    skills: ['React', 'TypeScript', 'CSS'],
    perks: ['Learning opportunity', 'Free courses', 'CV boost'],
    applyUrl: 'https://byjus.com/careers',
  },
  {
    id: 'startup-003',
    company: 'Unacademy',
    role: 'Data Scientist Intern',
    description: 'Analyze education data. Build ML models for student success.',
    minCGPA: 8.0,
    department: ['CSE', 'IT'],
    domain: 'Data Science',
    duration: '4 months',
    stipend: '₹40,000/month',
    location: 'Bangalore',
    skills: ['Python', 'ML', 'Statistics'],
    perks: ['Flexible schedule', 'Portfolio building', 'Networking'],
    applyUrl: 'https://unacademy.com/careers',
  },

  // Finance & Banking
  {
    id: 'finance-001',
    company: 'Goldman Sachs',
    role: 'Technology Analyst Intern',
    description: 'Work on trading systems and financial software. Learn fintech.',
    minCGPA: 8.8,
    department: ['CSE', 'IT'],
    domain: 'Backend Development',
    duration: '3 months',
    stipend: '₹85,000/month',
    location: 'Mumbai',
    skills: ['Java', 'C++', 'Finance fundamentals'],
    perks: ['International exposure', 'High stipend', 'Networking'],
    applyUrl: 'https://goldmansachs.com/careers',
  },
  {
    id: 'finance-002',
    company: 'ICICI Bank',
    role: 'Digital Banking Intern',
    description: 'Build mobile banking apps. Transform digital banking experience.',
    minCGPA: 7.8,
    department: ['CSE', 'IT'],
    domain: 'Mobile Development',
    duration: '3 months',
    stipend: '₹28,000/month',
    location: 'Bangalore',
    skills: ['React Native', 'Security', 'API design'],
    perks: ['Bank partnership', 'Credential', 'Mentorship'],
    applyUrl: 'https://icicibank.com/careers',
  },

  // E-commerce
  {
    id: 'ecom-001',
    company: 'Flipkart',
    role: 'Software Development Intern',
    description: 'Build e-commerce infrastructure. Handle millions of transactions.',
    minCGPA: 7.6,
    department: ['CSE', 'IT'],
    domain: 'Backend Development',
    duration: '3 months',
    stipend: '₹38,000/month',
    location: 'Bangalore',
    skills: ['Java', 'Scala', 'Distributed Systems'],
    perks: ['Free shopping credits', 'Startup culture', 'Fast growth'],
    applyUrl: 'https://flipkart.com/careers',
  },

  // Consulting
  {
    id: 'consult-001',
    company: 'McKinsey & Company',
    role: 'Business Technology Analyst Intern',
    description: 'Solve complex business problems. Work with Fortune 500 companies.',
    minCGPA: 8.7,
    department: ['CSE', 'IT'],
    domain: 'Business Intelligence',
    duration: '3 months',
    stipend: '₹65,000/month',
    location: 'Delhi',
    skills: ['Analytics', 'Business acumen', 'Communication'],
    perks: ['Prestige', 'Global exposure', 'High pay'],
    applyUrl: 'https://mckinsey.com/careers',
  },

  // Hardware & Semiconductors
  {
    id: 'hw-001',
    company: 'Intel',
    role: 'Hardware Verification Intern',
    description: 'Design verification for processors. Work on cutting-edge chips.',
    minCGPA: 8.4,
    department: ['CSE', 'IT'],
    domain: 'Hardware Design',
    duration: '4 months',
    stipend: '₹50,000/month',
    location: 'Bangalore',
    skills: ['Verilog', 'System Design', 'Testing'],
    perks: ['Technical depth', 'International company', 'Patents'],
    applyUrl: 'https://intel.com/careers',
  },

  // AI & ML
  {
    id: 'ai-001',
    company: 'OpenAI',
    role: 'Machine Learning Intern',
    description: 'Work on cutting-edge AI models. Contribute to AGI research.',
    minCGPA: 8.9,
    department: ['CSE', 'IT'],
    domain: 'AI/Machine Learning',
    duration: '3 months',
    stipend: '₹95,000/month',
    location: 'Remote',
    skills: ['Deep Learning', 'PyTorch', 'Research'],
    perks: ['AI research experience', 'Remote work', 'Cutting-edge'],
    applyUrl: 'https://openai.com/careers',
  },
  {
    id: 'ai-002',
    company: 'DeepMind',
    role: 'AI Research Intern',
    description: 'Push boundaries of AI. Publish research papers.',
    minCGPA: 8.8,
    department: ['CSE', 'IT'],
    domain: 'AI/Machine Learning',
    duration: '4 months',
    stipend: '₹88,000/month',
    location: 'London/Remote',
    skills: ['TensorFlow', 'Research methodology', 'Math'],
    perks: ['Research publication', 'PhD pathway', 'Innovation'],
    applyUrl: 'https://deepmind.com/careers',
  },

  // Cybersecurity
  {
    id: 'cyber-001',
    company: 'CrowdStrike',
    role: 'Security Engineer Intern',
    description: 'Protect enterprises from cyber threats. Work on endpoint security.',
    minCGPA: 8.3,
    department: ['CSE', 'IT'],
    domain: 'Cybersecurity',
    duration: '3 months',
    stipend: '₹55,000/month',
    location: 'Bangalore',
    skills: ['Network security', 'Malware analysis', 'Linux'],
    perks: ['Security expertise', 'Certifications', 'Tech salary'],
    applyUrl: 'https://crowdstrike.com/careers',
  },

  // Mobile First
  {
    id: 'mobile-001',
    company: 'Uber',
    role: 'Mobile Engineer Intern',
    description: 'Build Uber app features. Impact millions of rides daily.',
    minCGPA: 7.7,
    department: ['CSE', 'IT'],
    domain: 'Mobile Development',
    duration: '3 months',
    stipend: '₹45,000/month',
    location: 'Bangalore',
    skills: ['iOS/Android', 'Maps API', 'Real-time systems'],
    perks: ['Uber rides', 'Global company', 'Scale'],
    applyUrl: 'https://uber.com/careers',
  },

  // Additional diverse roles
  {
    id: 'backend-001',
    company: 'Stripe',
    role: 'Backend Engineer Intern',
    description: 'Build payment infrastructure. Enable global commerce.',
    minCGPA: 8.4,
    department: ['CSE', 'IT'],
    domain: 'Backend Development',
    duration: '3 months',
    stipend: '₹60,000/month',
    location: 'Remote',
    skills: ['Go/Rust', 'Payments', 'Databases'],
    perks: ['Remote work', 'Fintech', 'Best practices'],
    applyUrl: 'https://stripe.com/careers',
  },
  {
    id: 'devops-001',
    company: 'Hashicorp',
    role: 'DevOps Engineer Intern',
    description: 'Infrastructure automation and deployment tools.',
    minCGPA: 8.0,
    department: ['CSE', 'IT'],
    domain: 'DevOps',
    duration: '3 months',
    stipend: '₹42,000/month',
    location: 'Remote',
    skills: ['Terraform', 'Kubernetes', 'CI/CD'],
    perks: ['Open source', 'Remote friendly', 'Infrastructure'],
    applyUrl: 'https://hashicorp.com/careers',
  },
  {
    id: 'frontend-001',
    company: 'Figma',
    role: 'Frontend Engineer Intern',
    description: 'Build collaborative design tools. 10M+ users.',
    minCGPA: 7.9,
    department: ['CSE', 'IT'],
    domain: 'Frontend Development',
    duration: '3 months',
    stipend: '₹48,000/month',
    location: 'Remote',
    skills: ['React', 'WebGL', 'Performance'],
    perks: ['Product focus', 'Design tools', 'Remote work'],
    applyUrl: 'https://figma.com/careers',
  },
]

// Add many more entries to reach 100+
export function getAll100Internships(): InternshipListing[] {
  // Generate extended list by duplicating and modifying
  const extended: InternshipListing[] = [...allInternships]

  // Add more roles from each company with variations
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Spotify',
    'Zoom', 'Slack', 'Notion', 'Linear', 'Vercel', 'Netlify',
  ]

  const roles = [
    'Software Engineer', 'Product Engineer', 'DevOps Engineer',
    'Data Engineer', 'Full Stack Engineer', 'Security Engineer',
    'ML Engineer', 'Analytics Engineer', 'Platform Engineer',
  ]

  const domains = [
    'Backend Development', 'Frontend Development', 'Full Stack',
    'DevOps', 'Data Science', 'Cybersecurity', 'Cloud Computing',
    'AI/Machine Learning', 'Mobile Development', 'Database Design',
  ]

  const locations = [
    'Bangalore', 'Hyderabad', 'Delhi', 'Mumbai', 'Pune', 'Chennai',
    'Remote', 'San Francisco', 'New York', 'London',
  ]

  let id = 100
  for (let i = 0; i < 80; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const role = roles[Math.floor(Math.random() * roles.length)]
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const minCGPA = 7.0 + Math.random() * 1.8

    extended.push({
      id: `intern-${id}`,
      company,
      role: `${role} Intern`,
      description: `Work with ${company} team on ${domain.toLowerCase()} projects. Learn industry best practices and grow your skills.`,
      minCGPA: parseFloat(minCGPA.toFixed(1)),
      department: ['CSE', 'IT'],
      domain,
      duration: Math.random() > 0.5 ? '3 months' : '4 months',
      stipend: `₹${Math.floor(Math.random() * 70000) + 15000}/month`,
      location,
      skills: [
        'Problem Solving',
        'Communication',
        'Team Work',
        domain.split(' ')[0],
      ],
      perks: ['Mentorship', 'Certificate', 'Networking'],
    })
    id++
  }

  return extended
}
