'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { applyToInternship, fetchInternship, setSavedInternship } from '@/lib/client-api'
import { showToast } from '@/lib/toast-utils'
import { ArrowLeft, Bookmark, BookmarkCheck, IndianRupee, MapPin } from 'lucide-react'

export default function InternshipDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [internship, setInternship] = useState<any>(null)
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!params?.id) return

    fetchInternship(params.id)
      .then((data) => {
        setInternship(data.internship)
        setApplied(data.applied)
        setSaved(data.saved)
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [params?.id, router])

  const handleApply = async () => {
    if (!internship || applied) {
      return
    }

    try {
      await applyToInternship(internship.id)
      setApplied(true)
      showToast.success(`Applied to ${internship.company}!`)
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Unable to apply')
    }
  }

  const handleSaveToggle = async () => {
    if (!internship) {
      return
    }

    const nextSaved = !saved
    try {
      await setSavedInternship(internship.id, nextSaved)
      setSaved(nextSaved)
      showToast.success(nextSaved ? 'Internship bookmarked' : 'Bookmark removed')
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Unable to update bookmark')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
      </div>
    )
  }

  if (!internship) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8">
        <div className="container max-w-4xl">
          <Button onClick={() => router.back()} variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card className="border-white/10 backdrop-blur">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-cyan-400">
                    {internship.company}
                  </p>
                  <CardTitle className="mt-2 text-3xl">{internship.role}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveToggle} className="border-white/20">
                    {saved ? <BookmarkCheck className="mr-2 h-4 w-4 text-cyan-400" /> : <Bookmark className="mr-2 h-4 w-4" />}
                    {saved ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={applied}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                  >
                    {applied ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-emerald-400/40 text-emerald-400">
                  {internship.domain}
                </Badge>
                <Badge variant="outline">{internship.duration}</Badge>
                <Badge variant="outline">Min CGPA {internship.minCGPA}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-foreground/60">Location</p>
                    <p className="font-medium">{internship.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
                  <IndianRupee className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-foreground/60">Stipend</p>
                    <p className="font-medium">{internship.stipend}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">About This Internship</h2>
                <p className="leading-7 text-foreground/80">{internship.description}</p>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">Skills Needed</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">Perks</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.perks.map((perk: string) => (
                    <Badge key={perk} variant="outline">
                      {perk}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/saved">Saved Internships</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
