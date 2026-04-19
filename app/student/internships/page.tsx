'use client'

import { Header } from '@/components/header'
import { InternshipCard } from '@/components/internship-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

// Mock data for demonstration
const mockInternships = [
  {
    id: '1',
    title: 'Full Stack Developer Intern',
    company: 'TechCorp India',
    location: 'Bangalore',
    duration: 12,
    stipend: 25000,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    description: 'Join our dynamic team to build modern web applications using cutting-edge technologies. Work on real-world projects with experienced mentors.',
    minCgpa: 7.5,
    openings: 5,
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'DataWorks Solutions',
    location: 'Hyderabad',
    duration: 10,
    stipend: 20000,
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau'],
    description: 'Analyze large datasets and build predictive models for real-world business problems. Learn from industry experts.',
    minCgpa: 8.0,
    openings: 3,
  },
  {
    id: '3',
    title: 'UI/UX Design Intern',
    company: 'DesignStudio Pro',
    location: 'Mumbai',
    duration: 8,
    stipend: 15000,
    skills: ['Figma', 'UI Design', 'Prototyping', 'Design Thinking'],
    description: 'Create beautiful and intuitive user interfaces for web and mobile applications. Collaborate with product teams.',
    minCgpa: 7.0,
    openings: 2,
  },
  {
    id: '4',
    title: 'Backend Developer Intern',
    company: 'CloudTech Systems',
    location: 'Pune',
    duration: 12,
    stipend: 22000,
    skills: ['Java', 'Microservices', 'AWS', 'Docker'],
    description: 'Build scalable backend systems and APIs. Gain hands-on experience with cloud technologies and best practices.',
    minCgpa: 7.8,
    openings: 4,
  },
]

export default function StudentInternshipsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredInternships = mockInternships.filter((internship) =>
    internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Internship Opportunities</h1>
            <p className="text-muted-foreground">
              Discover internships matched to your profile and skills
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, company, or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>

            {/* Filter Panel (Collapsible) */}
            {showFilters && (
              <div className="p-4 border border-border rounded-lg bg-card space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Location</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                      <option>All Locations</option>
                      <option>Bangalore</option>
                      <option>Hyderabad</option>
                      <option>Mumbai</option>
                      <option>Pune</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Duration</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                      <option>All Durations</option>
                      <option>6-8 weeks</option>
                      <option>8-10 weeks</option>
                      <option>10-12 weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Min CGPA</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                      <option>Any CGPA</option>
                      <option>7.0+</option>
                      <option>7.5+</option>
                      <option>8.0+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Stipend Range</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                      <option>All Ranges</option>
                      <option>10k-15k</option>
                      <option>15k-25k</option>
                      <option>25k+</option>
                    </select>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            Found {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''}
          </div>

          {/* Internship Cards Grid */}
          {filteredInternships.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <InternshipCard key={internship.id} {...internship} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No internships found matching your criteria</p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
