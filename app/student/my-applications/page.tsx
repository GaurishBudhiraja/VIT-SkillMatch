'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getUserSession,
  getApplications,
  mockInternships,
  type Application,
  type Internship,
} from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export default function MyApplicationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getUserSession()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    if (currentUser.role !== 'student') {
      router.push('/dashboard')
      return
    }

    setUser(currentUser)
    const userApplications = getApplications(currentUser.id)
    setApplications(userApplications)
    setLoading(false)
  }, [router])

  const getInternshipDetails = (internshipId: string): Internship | undefined => {
    return mockInternships.find((i) => i.id === internshipId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">My Applications</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Track the status of your internship applications
            </p>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Applications Yet</CardTitle>
                <CardDescription>
                  You haven&apos;t applied to any internships yet. Start exploring opportunities!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/dashboard">
                    Browse Internships <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {applications.map((app) => {
                const internship = getInternshipDetails(app.internshipId)
                if (!internship) return null

                return (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{internship.role}</CardTitle>
                          <CardDescription className="mt-1">
                            {internship.companyName}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Applied On</p>
                          <p className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{internship.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{internship.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Stipend</p>
                          <p className="font-medium">{internship.stipend}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-sm font-semibold mb-2">Your Cover Letter:</p>
                        <p className="text-sm text-muted-foreground">{app.coverLetter}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
