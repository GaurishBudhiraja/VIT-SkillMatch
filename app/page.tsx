'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Briefcase, Users, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/client-api'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    getCurrentUser()
      .then((data) => router.replace(data.user.role === 'employer' ? '/employer/dashboard' : '/dashboard'))
      .catch(() => undefined)
  }, [router])
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                Your Path to Success Starts Here
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect with industry-leading companies for internship opportunities that match your skills and aspirations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                <Link href="/auth/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose VIT SkillMatch?
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Skill Matching</h3>
                <p className="text-muted-foreground text-center">
                  AI-powered matching system connects you with internships that align with your skills and interests.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Top Companies</h3>
                <p className="text-muted-foreground text-center">
                  Internship positions from India&apos;s leading tech companies and startups across all sectors.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Career Growth</h3>
                <p className="text-muted-foreground text-center">
                  Build real experience, develop professional skills, and launch your career with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Find Your Next Internship?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of VIT students who have successfully secured internships through our platform.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
