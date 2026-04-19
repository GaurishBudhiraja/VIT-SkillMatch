'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Users, Zap, BarChart3 } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              About VIT SkillMatch
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Connecting talented VIT students with the world's leading companies to launch their careers.
            </p>
          </div>

          {/* Mission Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <Card className="border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/80">
                  VIT SkillMatch is designed to simplify the internship discovery process for students at VIT Vellore. 
                  We believe that finding the right internship opportunity shouldn't be complicated or time-consuming.
                </p>
                <p className="text-foreground/80">
                  Our platform leverages smart matching algorithms to connect students with internship positions that 
                  align with their skills, experience, and career aspirations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-cyan-400">1</span>
                  </div>
                  <CardTitle className="text-lg">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">
                    Create your account and join the VIT SkillMatch community in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-400">2</span>
                  </div>
                  <CardTitle className="text-lg">Complete Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">
                    Add your skills, experience, and preferences to get better matches.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-cyan-400">3</span>
                  </div>
                  <CardTitle className="text-lg">Discover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">
                    Browse curated internship opportunities tailored to your profile.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-400">4</span>
                  </div>
                  <CardTitle className="text-lg">Apply</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">
                    Submit applications and track your progress in one place.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Zap, title: 'Smart Matching', desc: 'AI-powered algorithm matches you with relevant opportunities' },
                { icon: BarChart3, title: 'Track Progress', desc: 'Monitor your applications and interviews in real-time' },
                { icon: Users, title: 'Network', desc: 'Connect with peers and mentors in the VIT community' },
                { icon: CheckCircle2, title: 'Verified Companies', desc: 'All internship positions are verified and curated' }
              ].map((feature, i) => {
                const Icon = feature.icon
                return (
                  <Card key={i} className="border-white/10">
                    <CardHeader>
                      <Icon className="h-8 w-8 text-cyan-400 mb-2" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70">{feature.desc}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Raj Patel', role: 'Founder & CEO', bio: 'CS passout from VIT, 5+ years in EdTech' },
                { name: 'Priya Sharma', role: 'Product Lead', bio: 'Design thinking expert, passionate about student success' },
                { name: 'Arjun Kumar', role: 'Tech Lead', bio: 'Full-stack developer, open-source enthusiast' }
              ].map((member, i) => (
                <Card key={i} className="border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 text-center">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 mx-auto mb-4" />
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { label: '5000+', desc: 'Active Students' },
              { label: '500+', desc: 'Internship Positions' },
              { label: '200+', desc: 'Partner Companies' }
            ].map((stat, i) => (
              <Card key={i} className="border-white/10 text-center">
                <CardHeader>
                  <p className="text-4xl font-bold text-cyan-400">{stat.label}</p>
                  <p className="text-foreground/70 mt-2">{stat.desc}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
