'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, IndianRupee, Bookmark, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { showToast } from '@/lib/toast-utils'
import { applyToInternship, fetchApplications, fetchSavedInternships, setSavedInternship } from '@/lib/client-api'

interface SavedInternship {
  id: string
  company: string
  role: string
  description: string
  location: string
  stipend: string
  domain: string
  skills: string[]
}

export default function SavedPage() {
  const [savedInternships, setSavedInternships] = useState<SavedInternship[]>([])
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchSavedInternships(), fetchApplications()])
      .then(([savedData, applicationData]) => {
        setSavedInternships(savedData.internships)
        setAppliedIds(new Set(applicationData.applications.map((app: any) => app.internship_id)))
      })
      .finally(() => setLoading(false))
  }, [])

  const removeSaved = async (internshipId: string) => {
    await setSavedInternship(internshipId, false)
    setSavedInternships(prev => prev.filter(i => i.id !== internshipId))
    showToast.info('Removed from saved')
  }

  const handleApply = async (internship: SavedInternship) => {
    if (appliedIds.has(internship.id)) {
      showToast.info('You already applied to this internship')
      return
    }

    try {
      await applyToInternship(internship.id)
      setAppliedIds((prev) => new Set([...prev, internship.id]))
      showToast.success(`Applied to ${internship.company}!`)
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Unable to apply')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-foreground/60">Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Saved Internships
            </h1>
            <p className="text-foreground/60">You have {savedInternships.length} saved internship{savedInternships.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Saved Internships */}
          {savedInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedInternships.map(internship => (
                <Card
                  key={internship.id}
                  className="border-cyan-400/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-cyan-400 font-semibold uppercase">{internship.domain}</p>
                        <CardTitle className="text-lg mt-1">{internship.role}</CardTitle>
                      </div>
                      <Bookmark className="h-5 w-5 text-cyan-400 fill-cyan-400" />
                    </div>
                    <p className="text-sm font-semibold text-foreground/80">{internship.company}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-foreground/70 line-clamp-2">{internship.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span className="text-foreground/70">{internship.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="h-4 w-4 text-cyan-400" />
                        <span className="text-foreground/70">{internship.stipend}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-foreground/60 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {internship.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/internships/${internship.id}`}>View Details</Link>
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        onClick={() => handleApply(internship)}
                        disabled={appliedIds.has(internship.id)}
                      >
                        {appliedIds.has(internship.id) ? 'Applied' : 'Apply Now'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSaved(internship.id)}
                        className="h-10 w-10 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-5 w-5 text-red-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-white/10 text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Bookmark className="h-16 w-16 text-foreground/20" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">No Saved Internships</h2>
                  <p className="text-foreground/60 mb-6">Start exploring and save internships that interest you</p>
                  <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    <a href="/browse">Browse Internships</a>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
