'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ProfileCompletionCardFixed } from '@/components/profile-completion-card-fixed'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bookmark, BookmarkCheck, MapPin, Search, Briefcase } from 'lucide-react'
import { showToast } from '@/lib/toast-utils'
import { applyToInternship, fetchDashboard, setSavedInternship } from '@/lib/client-api'

interface User {
  id: string
  email: string
  fullName: string
  profileCompleted: boolean
  profile?: any
}

interface Internship {
  id: string
  company: string
  role: string
  description: string
  minCGPA: number
  domain: string
  duration: string
  stipend: string
  location: string
  skills: string[]
  perks: string[]
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [internships, setInternships] = useState<Internship[]>([])
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([])
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDomain, setFilterDomain] = useState('')
  const [loading, setLoading] = useState(true)
  const [itemsToShow, setItemsToShow] = useState(6)

  useEffect(() => {
    fetchDashboard()
      .then((data) => {
        if (data.user.role === 'employer') {
          router.replace('/employer/dashboard')
          return
        }
        setUser({
          ...data.user,
          profileCompleted: Boolean(data.profile),
          profile: data.profile || {},
        })
        setInternships(data.internships)
        setFilteredInternships(data.internships)
        setAppliedIds(new Set(data.appliedIds))
        setSavedIds(new Set(data.savedIds))
      })
      .catch((error) => {
        if (error instanceof Error && error.message === 'Student dashboard only') {
          router.replace('/employer/dashboard')
          return
        }
        router.push('/auth/login')
      })
      .finally(() => setLoading(false))
    return
    /*
    console.log('DASHBOARD LOADING')
    const userStr = localStorage.getItem('currentUser')
    if (!userStr) {
      console.log('NO USER → USING DEMO USER');

      const demoUser = {
        id: "demo123",
        email: "demo@user.com",
        fullName: "Demo User",
        profileCompleted: false,
        profile: {}
      };

      localStorage.setItem("currentUser", JSON.stringify(demoUser));
      setUser(demoUser);
    } else {
      const currentUser = JSON.parse(userStr);

      // 🔥 FIX MISSING FIELDS
      const fixedUser = {
        id: currentUser.id || "demo123",
        email: currentUser.email,
        fullName: currentUser.fullName || "User",
        profileCompleted: currentUser.profileCompleted || false,
        profile: currentUser.profile || {}
      };

      setUser(fixedUser);
    }

    try {
      const currentUser = userStr ? JSON.parse(userStr) : null;
      if (!currentUser) {
        console.log("NO VALID USER → STOPPING EXECUTION");
        setLoading(false);
        return;
      }
      console.log('USER FOUND:', currentUser.email)
      setUser(currentUser)

      // Load all internships (show even if profile not completed)
      const allInternships = getAll100Internships()
      setInternships(allInternships)
      setFilteredInternships(allInternships)

      // Load applied internships
      const applicationsStr = localStorage.getItem(`applications_${currentUser.id}`)
      if (applicationsStr) {
        const applications = JSON.parse(applicationsStr)
        setAppliedIds(new Set(applications.map((app: any) => app.internshipId)))
      }

      // Load saved internships
      const savedStr = localStorage.getItem(`saved_${currentUser.id}`)
      if (savedStr) {
        const saved = JSON.parse(savedStr)
        setSavedIds(new Set(saved))
      }

      setLoading(false)
    } catch (error) {
      console.log('ERROR → USING DEMO USER');

      const demoUser = {
        id: "demo123",
        email: "demo@user.com",
        fullName: "Demo User",
        profileCompleted: false,
        profile: {}
      };

      setUser(demoUser);
    }
    */
  }, [])

  useEffect(() => {
    let filtered = internships

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (internship) =>
          internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Domain filter
    if (filterDomain) {
      filtered = filtered.filter((internship) => internship.domain === filterDomain)
    }

    // CGPA filter (if profile completed)
    if (user?.profile?.cgpa) {
      filtered = filtered.filter((internship) => internship.minCGPA <= user.profile.cgpa)
    }

    setFilteredInternships(filtered)
  }, [searchQuery, filterDomain, user, internships])

  const handleApply = (internship: Internship) => {
    ;(async () => {
      if (!user) return

      if (appliedIds.has(internship.id)) {
        showToast.error('Already applied', 'You have already applied to this position')
        return
      }

      try {
        await applyToInternship(internship.id)
        setAppliedIds(new Set([...appliedIds, internship.id]))
        showToast.success(`Applied to ${internship.company}!`, 'Good luck with your interview!')
      } catch (error) {
        showToast.error(error instanceof Error ? error.message : 'Unable to apply')
      }
    })()
    return
    /*
    if (!user) return

    if (appliedIds.has(internship.id)) {
      showToast.error('Already applied', 'You have already applied to this position')
      return
    }

    const application = {
      id: `app_${Date.now()}`,
      studentId: user.id,
      internshipId: internship.id,
      company: internship.company,
      role: internship.role,
      appliedAt: new Date().toISOString(),
    }

    const applicationsStr = localStorage.getItem(`applications_${user.id}`)
    const applications = applicationsStr ? JSON.parse(applicationsStr) : []
    applications.push(application)
    localStorage.setItem(`applications_${user.id}`, JSON.stringify(applications))

    setAppliedIds(new Set([...appliedIds, internship.id]))
    showToast.success(`Applied to ${internship.company}!`, `Good luck with your interview! 🎉`)
    */
  }

  const toggleSaved = (internshipId: string) => {
    ;(async () => {
      if (!user) return

      const newSaved = new Set(savedIds)
      const shouldSave = !newSaved.has(internshipId)

      if (shouldSave) {
        newSaved.add(internshipId)
      } else {
        newSaved.delete(internshipId)
      }

      try {
        await setSavedInternship(internshipId, shouldSave)
        setSavedIds(newSaved)
        if (shouldSave) {
          showToast.funny('Added to your bookmarks!')
        }
      } catch (error) {
        showToast.error(error instanceof Error ? error.message : 'Unable to update bookmarks')
      }
    })()
    return
    /*
    if (!user) return

    const newSaved = new Set(savedIds)
    if (newSaved.has(internshipId)) {
      newSaved.delete(internshipId)
    } else {
      newSaved.add(internshipId)
      showToast.funny('Added to your bookmarks!')
    }

    setSavedIds(newSaved)
    localStorage.setItem(`saved_${user.id}`, JSON.stringify(Array.from(newSaved)))
    */
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="h-12 w-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full" />
          </div>
          <p className="text-foreground/60">Loading internships...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="container py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.fullName}</span>!
            </h1>
            <p className="text-foreground/60">
              Found {filteredInternships.length} internships matching your profile
            </p>
          </div>

          {/* Profile Completion Card */}
          {user && !user.profileCompleted && (
            <ProfileCompletionCardFixed
              user={user}
              onProfileCompleted={(profile) => {
                setUser(prev => prev ? { ...prev, profileCompleted: true, profile } : null)
              }}
            />
          )}

          {/* Search & Filter Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <Input
                placeholder="Search companies, roles, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-foreground profile-select"
            >
              <option value="">All Domains</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
              <option value="DevOps">DevOps</option>
              <option value="AI/Machine Learning">AI/Machine Learning</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
            <Card className="border-white/10 glass-effect card-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-400 mb-1">{appliedIds.size}</div>
                <p className="text-sm text-foreground/60">Applications Sent</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 glass-effect card-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{savedIds.size}</div>
                <p className="text-sm text-foreground/60">Bookmarked</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 glass-effect card-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-1">{user?.profile?.cgpa || 'N/A'}</div>
                <p className="text-sm text-foreground/60">Your CGPA</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 glass-effect card-glow">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{filteredInternships.length}</div>
                <p className="text-sm text-foreground/60">Matching Roles</p>
              </CardContent>
            </Card>
          </div>

          {/* Internships Grid */}
          {filteredInternships.length > 0 ? (
            <div className="grid gap-4">
              {filteredInternships.slice(0, itemsToShow).map((internship, idx) => (
                <Card
                  key={internship.id}
                  className="border-white/10 glass-effect card-glow hover:border-cyan-400/50 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="mt-1 p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
                            <Briefcase className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{internship.company}</h3>
                            <p className="text-foreground/80">{internship.role}</p>
                          </div>
                        </div>

                        <p className="text-sm text-foreground/60 mb-3">{internship.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="border-emerald-400/50 text-emerald-400">
                            {internship.domain}
                          </Badge>
                          <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                            {internship.duration}
                          </Badge>
                          <Badge variant="outline">{internship.stipend}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {internship.skills.slice(0, 3).map((skill) => (
                            <div key={skill} className="text-xs px-2 py-1 rounded-full bg-white/5 text-foreground/70">
                              {skill}
                            </div>
                          ))}
                          {internship.skills.length > 3 && (
                            <div className="text-xs px-2 py-1 rounded-full bg-white/5 text-foreground/70">
                              +{internship.skills.length - 3} more
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <MapPin className="w-4 h-4" />
                          {internship.location}
                        </div>
                      </div>

                      <div className="flex gap-2 md:flex-col">
                        <Button
                          onClick={() => toggleSaved(internship.id)}
                          variant="outline"
                          size="icon"
                          className="border-white/20 hover:border-cyan-400/50"
                          >
                          {savedIds.has(internship.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </Button>
                        <Button asChild variant="outline" className="border-white/20 hover:border-cyan-400/50">
                          <Link href={`/internships/${internship.id}`}>View Details</Link>
                        </Button>
                        <Button
                          onClick={() => handleApply(internship)}
                          disabled={appliedIds.has(internship.id)}
                          className={`flex-1 md:w-full ${appliedIds.has(internship.id)
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                            }`}
                        >
                          {appliedIds.has(internship.id) ? 'Applied' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
              <p className="text-lg text-foreground/60">No internships matching your criteria</p>
              <p className="text-sm text-foreground/40 mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Load More Button */}
          {itemsToShow < filteredInternships.length && filteredInternships.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setItemsToShow(prev => prev + 6)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 btn-glow px-8"
              >
                Load More ({filteredInternships.length - itemsToShow} remaining)
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
