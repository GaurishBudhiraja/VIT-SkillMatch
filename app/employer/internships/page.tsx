import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Eye, Edit, Trash2, Users } from 'lucide-react'

export default async function EmployerInternshipsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Mock employer internships
  const mockInternships = [
    {
      id: '1',
      title: 'Full Stack Developer Intern',
      location: 'Bangalore',
      postedDate: '2024-03-15',
      status: 'open',
      applications: 24,
      openings: 5,
      filled: 2,
    },
    {
      id: '2',
      title: 'Backend Developer Intern',
      location: 'Pune',
      postedDate: '2024-03-10',
      status: 'open',
      applications: 18,
      openings: 3,
      filled: 1,
    },
    {
      id: '3',
      title: 'Frontend Developer Intern',
      location: 'Bangalore',
      postedDate: '2024-02-28',
      status: 'filled',
      applications: 42,
      openings: 4,
      filled: 4,
    },
    {
      id: '4',
      title: 'DevOps Intern',
      location: 'Hyderabad',
      postedDate: '2024-02-15',
      status: 'closed',
      applications: 15,
      openings: 2,
      filled: 2,
    },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Internship Postings</h1>
              <p className="text-muted-foreground">Manage all your active and closed internship postings</p>
            </div>
            <Button asChild>
              <Link href="/employer/create-internship">Create New Posting</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Total Postings</div>
              <div className="text-2xl font-bold">{mockInternships.length}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Active</div>
              <div className="text-2xl font-bold text-green-600">
                {mockInternships.filter((i) => i.status === 'open').length}
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Total Applications</div>
              <div className="text-2xl font-bold">
                {mockInternships.reduce((sum, i) => sum + i.applications, 0)}
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Positions Filled</div>
              <div className="text-2xl font-bold text-blue-600">
                {mockInternships.reduce((sum, i) => sum + i.filled, 0)}/
                {mockInternships.reduce((sum, i) => sum + i.openings, 0)}
              </div>
            </div>
          </div>

          {/* Internships Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Applications</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Positions</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Posted</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockInternships.map((internship) => (
                    <tr key={internship.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{internship.title}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{internship.location}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={internship.status === 'open' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {internship.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{internship.applications}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {internship.filled}/{internship.openings}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(internship.postedDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View applications"
                            asChild
                          >
                            <Link href={`/employer/internship/${internship.id}/applications`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
