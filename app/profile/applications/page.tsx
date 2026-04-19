'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Calendar, MapPin, ArrowLeft, Trash2 } from 'lucide-react'
import { showToast } from '@/lib/toast-utils'
import { fetchApplications, withdrawApplication } from '@/lib/client-api'

interface Application {
  id: string
  internshipId: string
  company_name: string
  role: string
  applied_at: string
  status: string
}

export default function MyApplications() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
      .then((data) => setApplications(data.applications))
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  const handleWithdraw = async (appId: string) => {
    await withdrawApplication(appId)
    setApplications((prev) => prev.filter((app) => app.id !== appId))
    showToast.success('Application withdrawn')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8">
        <div className="container max-w-2xl">
          {/* Back Button */}
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-foreground/60 mb-8">Track all your internship applications</p>

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="border-white/10 backdrop-blur hover:border-emerald-400/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
                            <Briefcase className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{application.company_name}</h3>
                            <p className="text-foreground/80">{application.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <Calendar className="w-4 h-4" />
                          Applied on {new Date(application.applied_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-400/30 capitalize">{application.status}</Badge>
                        <Button
                          onClick={() => handleWithdraw(application.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-white/10 backdrop-blur">
              <CardContent className="pt-6 text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
                <p className="text-lg text-foreground/60 mb-4">No applications yet</p>
                <p className="text-sm text-foreground/40 mb-6">Start exploring internships and apply to positions that match your skills</p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500"
                >
                  Browse Internships
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
