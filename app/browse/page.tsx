'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MapPin, IndianRupee, Bookmark, BookmarkCheck } from 'lucide-react'
import { useState, useMemo } from 'react'
import { getAll100Internships } from '@/lib/internships-100'
import { showToast } from '@/lib/toast-utils'

export default function BrowsePage() {
  const allInternships = useMemo(() => getAll100Internships(), [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDomain, setFilterDomain] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [itemsToShow, setItemsToShow] = useState(12)

  const domains = Array.from(new Set(allInternships.map(i => i.domain)))

  const filtered = useMemo(() => {
    return allInternships.filter(internship => {
      const matchesSearch = 
        internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.role.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDomain = !filterDomain || internship.domain === filterDomain
      
      return matchesSearch && matchesDomain
    })
  }, [searchQuery, filterDomain, allInternships])

  const displayedInternships = filtered.slice(0, itemsToShow)

  const toggleSave = (internshipId: string) => {
    setSavedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(internshipId)) {
        newSet.delete(internshipId)
        showToast.info('Removed from saved')
      } else {
        newSet.add(internshipId)
        showToast.success('Added to saved')
      }
      return newSet
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Browse Internships
            </h1>
            <p className="text-foreground/60">Explore all {allInternships.length} available internship positions</p>
          </div>

          {/* Filters */}
          <Card className="mb-8 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Search</label>
                  <Input
                    placeholder="Search by company or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Domain</label>
                  <select
                    value={filterDomain}
                    onChange={(e) => setFilterDomain(e.target.value)}
                    className="w-full bg-background/50 border border-white/20 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">All Domains</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-foreground/50 mt-4">
                Showing {displayedInternships.length} of {filtered.length} internships
              </p>
            </CardContent>
          </Card>

          {/* Internships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedInternships.map(internship => (
              <Card
                key={internship.id}
                className="border-white/10 hover:border-cyan-400/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-cyan-400 font-semibold uppercase">{internship.domain}</p>
                      <CardTitle className="text-lg mt-1">{internship.role}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSave(internship.id)}
                      className="h-8 w-8"
                    >
                      {savedIds.has(internship.id) ? (
                        <BookmarkCheck className="h-5 w-5 text-cyan-400" />
                      ) : (
                        <Bookmark className="h-5 w-5 text-foreground/40 hover:text-cyan-400" />
                      )}
                    </Button>
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
                      {internship.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{internship.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button asChild className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    <Link href={`/internships/${internship.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {displayedInternships.length < filtered.length && (
            <div className="flex justify-center">
              <Button
                onClick={() => setItemsToShow(prev => prev + 12)}
                variant="outline"
                className="border-cyan-400/30 hover:bg-cyan-400/10"
              >
                Load More ({filtered.length - displayedInternships.length} remaining)
              </Button>
            </div>
          )}

          {filtered.length === 0 && (
            <Card className="border-white/10 text-center py-12">
              <p className="text-foreground/60 text-lg">No internships found matching your criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setFilterDomain('')
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
