import { Header } from '@/components/header'
import { InternshipCard } from '@/components/internship-card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SavedInternshipsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Mock saved internships
  const savedInternships = [
    {
      id: '1',
      title: 'Full Stack Developer Intern',
      company: 'TechCorp India',
      location: 'Bangalore',
      duration: 12,
      stipend: 25000,
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      description: 'Join our dynamic team to build modern web applications using cutting-edge technologies.',
      minCgpa: 7.5,
      openings: 5,
    },
    {
      id: '4',
      title: 'Backend Developer Intern',
      company: 'CloudTech Systems',
      location: 'Pune',
      duration: 12,
      stipend: 22000,
      skills: ['Java', 'Microservices', 'AWS', 'Docker'],
      description: 'Build scalable backend systems and APIs. Gain hands-on experience with cloud technologies.',
      minCgpa: 7.8,
      openings: 4,
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Saved Internships</h1>
            <p className="text-muted-foreground">
              Your list of saved internship opportunities
            </p>
          </div>

          {savedInternships.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedInternships.map((internship) => (
                <InternshipCard key={internship.id} {...internship} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No saved internships yet</p>
              <Button asChild>
                <Link href="/student/internships">Browse Internships</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
