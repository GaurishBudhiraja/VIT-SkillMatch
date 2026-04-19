import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Briefcase, CheckCircle, TrendingUp } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Mock analytics data
  const stats = {
    totalStudents: 2450,
    totalCompanies: 18,
    totalPositions: 87,
    totalApplications: 1230,
    acceptanceRate: 24.5,
    averageTimeToHire: '15 days',
  }

  const departmentDistribution = [
    { name: 'CSE', count: 850, percentage: 34.7 },
    { name: 'ECE', count: 620, percentage: 25.3 },
    { name: 'MECH', count: 480, percentage: 19.6 },
    { name: 'CIVIL', count: 320, percentage: 13.1 },
    { name: 'Others', count: 180, percentage: 7.3 },
  ]

  const topCompanies = [
    { name: 'TechCorp India', positions: 15, hires: 12, rating: 4.8 },
    { name: 'InnovateLabs', positions: 8, hires: 6, rating: 4.6 },
    { name: 'CloudScale Systems', positions: 10, hires: 7, rating: 4.5 },
    { name: 'DataMind Analytics', positions: 6, hires: 4, rating: 4.7 },
    { name: 'DesignStudio Pro', positions: 5, hires: 3, rating: 4.4 },
  ]

  const topSkills = [
    { skill: 'Python', count: 245 },
    { skill: 'Java', count: 198 },
    { skill: 'JavaScript', count: 187 },
    { skill: 'SQL', count: 165 },
    { skill: 'React', count: 152 },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
            <p className="text-muted-foreground">
              Overview of VIT SkillMatch platform metrics and insights
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Students</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Companies</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Positions</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalPositions}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Applications</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalApplications.toLocaleString()}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Acceptance Rate</span>
              </div>
              <div className="text-2xl font-bold">{stats.acceptanceRate}%</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-2">Avg Hire Time</div>
              <div className="text-2xl font-bold">{stats.averageTimeToHire}</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Department Distribution */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Student Distribution by Department</h2>
              <div className="space-y-4">
                {departmentDistribution.map((dept) => (
                  <div key={dept.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{dept.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {dept.count} ({dept.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Skills */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Most Requested Skills</h2>
              <div className="space-y-4">
                {topSkills.map((skill, index) => (
                  <div
                    key={skill.skill}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <span className="font-semibold">{skill.skill}</span>
                    </div>
                    <span className="text-muted-foreground">{skill.count} students</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Companies */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Top Recruiting Companies</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Company</th>
                    <th className="text-right py-3 px-4 font-semibold">Positions</th>
                    <th className="text-right py-3 px-4 font-semibold">Hires</th>
                    <th className="text-right py-3 px-4 font-semibold">Success Rate</th>
                    <th className="text-right py-3 px-4 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topCompanies.map((company) => (
                    <tr key={company.name} className="hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{company.name}</td>
                      <td className="text-right py-3 px-4">{company.positions}</td>
                      <td className="text-right py-3 px-4">{company.hires}</td>
                      <td className="text-right py-3 px-4">
                        {((company.hires / company.positions) * 100).toFixed(0)}%
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-3 py-1 rounded-full text-sm font-semibold">
                          ⭐ {company.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
