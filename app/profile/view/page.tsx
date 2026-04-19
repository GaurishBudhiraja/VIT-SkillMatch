'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, Linkedin, Globe, Download, Edit, ArrowLeft } from 'lucide-react'
import { fetchProfile } from '@/lib/client-api'

interface User {
  id: string
  email: string
  fullName: string
  role: string
  profile?: any
}

export default function ViewProfile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setUser({
          ...data.user,
          profile: data.profile,
        })
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full" />
        </div>
      </div>
    )
  }

  if (!user) return null

  const profile = user.profile

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

          {/* Header Card */}
          <Card className="border-white/10 backdrop-blur mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                  <p className="text-foreground/60 mb-4">{user.email}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-emerald-400/50 text-emerald-400">
                      {user.role}
                    </Badge>
                    {profile && (
                      <Badge variant="outline" className="border-cyan-400/50 text-cyan-400">
                        {profile.department}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/profile/edit')}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {profile ? (
            <>
              {/* Academic Info */}
              <Card className="border-white/10 backdrop-blur mb-6">
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">CGPA</p>
                    <p className="text-2xl font-bold text-emerald-400">{profile.cgpa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Department</p>
                    <p className="text-lg font-semibold">{profile.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Graduation Year</p>
                    <p className="text-lg font-semibold">{profile.graduationYear}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Domain */}
              <Card className="border-white/10 backdrop-blur mb-6">
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Preferred Domain</p>
                    <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-400/30">
                      {profile.domain}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Technical Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="border-white/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bio */}
              {profile.bio && (
                <Card className="border-white/10 backdrop-blur mb-6">
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Links */}
              {(profile.links?.portfolio || profile.links?.github || profile.links?.linkedin) && (
                <Card className="border-white/10 backdrop-blur mb-6">
                  <CardHeader>
                    <CardTitle>Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {profile.links?.portfolio && (
                      <a
                        href={profile.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
                      >
                        <Globe className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                    {profile.links?.github && (
                      <a
                        href={profile.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profile.links?.linkedin && (
                      <a
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Resume */}
              {profile.resume && (
                <Card className="border-white/10 backdrop-blur mb-6">
                  <CardHeader>
                    <CardTitle>Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <Download className="w-5 h-5 text-emerald-400" />
                      <span className="flex-1">{profile.resume}</span>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-white/10 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <p className="text-foreground/60 mb-4">Profile not completed yet</p>
                <Button
                  onClick={() => router.push('/profile/complete')}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500"
                >
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
