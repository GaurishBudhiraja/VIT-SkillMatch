import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Building2, MapPin } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

export default async function ApplicationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Mock applications data
  const mockApplications = [
    {
      id: '1',
      title: 'Full Stack Developer Intern',
      company: 'TechCorp India',
      location: 'Bangalore',
      appliedDate: '2024-04-01',
      status: 'shortlisted',
      deadline: '2024-05-01',
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'DataWorks Solutions',
      location: 'Hyderabad',
      appliedDate: '2024-03-28',
      status: 'reviewing',
      deadline: '2024-04-30',
    },
    {
      id: '3',
      title: 'Backend Developer Intern',
      company: 'CloudTech Systems',
      location: 'Pune',
      appliedDate: '2024-03-25',
      status: 'pending',
      deadline: '2024-04-25',
    },
    {
      id: '4',
      title: 'UI/UX Design Intern',
      company: 'DesignStudio Pro',
      location: 'Mumbai',
      appliedDate: '2024-03-20',
      status: 'rejected',
      deadline: '2024-04-20',
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">
              Track the status of your internship applications
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Total Applications</div>
              <div className="text-2xl font-bold">{mockApplications.length}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Shortlisted</div>
              <div className="text-2xl font-bold text-purple-600">
                {mockApplications.filter((a) => a.status === 'shortlisted').length}
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Under Review</div>
              <div className="text-2xl font-bold text-blue-600">
                {mockApplications.filter((a) => a.status === 'reviewing' || a.status === 'pending').length}
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Accepted</div>
              <div className="text-2xl font-bold text-green-600">
                {mockApplications.filter((a) => a.status === 'accepted').length}
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {mockApplications.length > 0 ? (
              mockApplications.map((application) => (
                <div
                  key={application.id}
                  className="p-6 border border-border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {application.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{application.company}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied: {formatDate(application.appliedDate)}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <Badge
                        className={`capitalize ${statusColors[application.status] || 'bg-gray-100'}`}
                      >
                        {application.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground text-right">
                        Deadline: {formatDate(application.deadline)}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/student/application/${application.id}`}>View Details</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t applied to any internships yet
                </p>
                <Button asChild>
                  <a href="/student/internships">Browse Internships</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
