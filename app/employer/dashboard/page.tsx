'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchEmployerDashboard, updateEmployerApplicationStatus } from '@/lib/client-api'
import { showToast } from '@/lib/toast-utils'
import { Briefcase, Building2, FileText, Mail, User } from 'lucide-react'

export default function EmployerDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchEmployerDashboard()
      .then(setData)
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  const groupedApplications = useMemo(() => {
    const groups = new Map<string, any[]>()

    for (const application of data?.applications || []) {
      const list = groups.get(application.internshipRole) || []
      list.push(application)
      groups.set(application.internshipRole, list)
    }

    return Array.from(groups.entries())
  }, [data])

  const handleStatusUpdate = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateEmployerApplicationStatus(applicationId, status)
      setData((prev: any) => {
        if (!prev) return prev

        const applications = prev.applications.map((application: any) =>
          application.id === applicationId ? { ...application, status } : application,
        )

        return {
          ...prev,
          applications,
        }
      })
      showToast.success(`Application ${status}`)
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Unable to update application')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8">
        <div className="container space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-cyan-400">Employer Dashboard</p>
              <h1 className="text-4xl font-bold">{data.employerProfile.companyName}</h1>
              <p className="mt-2 text-foreground/60">
                All internship requests for {data.employerProfile.companyName} appear here.
              </p>
            </div>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="flex gap-6 pt-6">
                <div>
                  <p className="text-sm text-foreground/60">Employer</p>
                  <p className="font-semibold">{data.user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Employer ID</p>
                  <p className="font-semibold">{data.employerProfile.employerId}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-foreground/60">Company Roles</p>
                    <p className="text-3xl font-bold">{data.internships.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-foreground/60">Applications</p>
                    <p className="text-3xl font-bold">{data.applications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-foreground/60">Most Applied Role</p>
                    <p className="text-lg font-bold">{data.internships[0]?.role || 'No roles yet'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/10">
            <CardHeader>
              <CardTitle>Your Company Internship Postings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.internships.length > 0 ? (
                data.internships.map((internship: any) => (
                  <div
                    key={internship.id}
                    className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold">{internship.role}</p>
                      <p className="text-sm text-foreground/60">{internship.location} • {internship.duration}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{internship.domain}</Badge>
                      <Badge className="bg-cyan-500/20 text-cyan-300">
                        {internship.applicationCount} application{internship.applicationCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-foreground/60">No internships found for this company yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10">
            <CardHeader>
              <CardTitle>Student Requests By Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {groupedApplications.length > 0 ? (
                groupedApplications.map(([role, applications]) => (
                  <div key={role} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{role}</h2>
                      <Badge variant="outline">{applications.length} students</Badge>
                    </div>
                    <div className="grid gap-4">
                      {applications.map((application: any) => (
                        <div key={application.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-emerald-400" />
                                <span className="font-semibold">{application.studentName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-foreground/60">
                                <Mail className="h-4 w-4" />
                                <span>{application.studentEmail}</span>
                              </div>
                              <p className="text-sm text-foreground/70">
                                {application.department || 'Department not added'} • CGPA {application.cgpa ?? 'N/A'}
                              </p>
                              {application.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {application.skills.map((skill: string) => (
                                    <Badge key={skill} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {application.bio && (
                                <p className="text-sm leading-6 text-foreground/70">{application.bio}</p>
                              )}
                            </div>

                            <div className="flex flex-col items-start gap-2 md:items-end">
                              <Badge className="capitalize bg-emerald-500/20 text-emerald-300">
                                {application.status}
                              </Badge>
                              <span className="text-sm text-foreground/60">
                                Applied on {new Date(application.appliedAt).toLocaleDateString()}
                              </span>
                              {application.resume && <Badge variant="outline">Resume: {application.resume}</Badge>}
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                  disabled={application.status === 'accepted'}
                                  className="bg-emerald-500 hover:bg-emerald-600"
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                  disabled={application.status === 'rejected'}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-foreground/60">
                  No students have applied yet. When students apply to {data.employerProfile.companyName}, they will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
