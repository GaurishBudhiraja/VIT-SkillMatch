import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Download } from 'lucide-react'

export default async function EmployerApplicationsPage() {
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
      studentName: 'Aarav Sharma',
      position: 'Full Stack Developer Intern',
      appliedDate: '2024-04-02',
      status: 'shortlisted',
      cgpa: 8.2,
      skills: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: '2',
      studentName: 'Priya Verma',
      position: 'Full Stack Developer Intern',
      appliedDate: '2024-04-01',
      status: 'reviewing',
      cgpa: 7.9,
      skills: ['React', 'Python', 'SQL'],
    },
    {
      id: '3',
      studentName: 'Rohan Patel',
      position: 'Backend Developer Intern',
      appliedDate: '2024-04-02',
      status: 'shortlisted',
      cgpa: 8.5,
      skills: ['Java', 'Docker', 'AWS'],
    },
    {
      id: '4',
      studentName: 'Ananya Gupta',
      position: 'Full Stack Developer Intern',
      appliedDate: '2024-03-31',
      status: 'pending',
      cgpa: 7.7,
      skills: ['Vue.js', 'Flask', 'PostgreSQL'],
    },
    {
      id: '5',
      studentName: 'Vikram Singh',
      position: 'Backend Developer Intern',
      appliedDate: '2024-03-28',
      status: 'rejected',
      cgpa: 6.9,
      skills: ['Python', 'Django', 'MySQL'],
    },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    shortlisted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  }

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
            <h1 className="text-3xl font-bold mb-2">Applications</h1>
            <p className="text-muted-foreground">Review and manage all student applications</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { label: 'All', count: mockApplications.length },
              {
                label: 'Pending',
                count: mockApplications.filter((a) => a.status === 'pending').length,
              },
              {
                label: 'Reviewing',
                count: mockApplications.filter((a) => a.status === 'reviewing').length,
              },
              {
                label: 'Shortlisted',
                count: mockApplications.filter((a) => a.status === 'shortlisted').length,
              },
              {
                label: 'Accepted',
                count: mockApplications.filter((a) => a.status === 'accepted').length,
              },
              {
                label: 'Rejected',
                count: mockApplications.filter((a) => a.status === 'rejected').length,
              },
            ].map((tab) => (
              <Button key={tab.label} variant="outline" className="whitespace-nowrap">
                {tab.label} ({tab.count})
              </Button>
            ))}
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {mockApplications.map((application) => (
              <div
                key={application.id}
                className="p-6 border border-border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{application.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{application.position}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">CGPA: </span>
                        <span className="font-semibold">{application.cgpa.toFixed(1)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Applied: </span>
                        <span className="font-semibold">{formatDate(application.appliedDate)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <Badge
                      className={`capitalize ${statusColors[application.status] || 'bg-gray-100'}`}
                    >
                      {application.status}
                    </Badge>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" title="Send message">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Download resume">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/employer/application/${application.id}`}>View Full</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
