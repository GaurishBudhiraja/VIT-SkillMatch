import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CreateInternshipPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Link href="/employer/internships" className="text-primary hover:underline mb-4 inline-block">
                ← Back to Postings
              </Link>
              <h1 className="text-3xl font-bold mb-2">Create New Internship Posting</h1>
              <p className="text-muted-foreground">
                Post a new internship opportunity for your company
              </p>
            </div>

            <div className="border border-border rounded-lg p-8 bg-card">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Position Title *</label>
                  <Input placeholder="e.g., Full Stack Developer Intern" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Location *</label>
                    <Input placeholder="e.g., Bangalore" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Duration (weeks) *</label>
                    <Input type="number" placeholder="e.g., 12" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Stipend (₹)</label>
                    <Input type="number" placeholder="e.g., 25000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Number of Openings *</label>
                    <Input type="number" placeholder="e.g., 5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Minimum CGPA *</label>
                  <Input type="number" step="0.1" placeholder="e.g., 7.5" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <textarea
                    className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={6}
                    placeholder="Describe the internship position, responsibilities, and what you're looking for..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Required Skills</label>
                  <Input placeholder="e.g., React, Node.js, MongoDB (comma-separated)" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Allowed Departments</label>
                  <Input placeholder="e.g., CSE, ECE (leave blank for all)" />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Post Internship
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/employer/internships">Cancel</Link>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
