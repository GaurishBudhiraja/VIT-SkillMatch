import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, XCircle, Globe, MapPin } from 'lucide-react'

export default async function AdminApprovalsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Mock pending company registrations
  const mockPendingCompanies = [
    {
      id: '1',
      name: 'Innovate Tech Solutions',
      email: 'hr@innovatetech.com',
      industry: 'Information Technology',
      location: 'Bangalore, India',
      website: 'www.innovatetech.com',
      registeredDate: '2024-04-01',
      position_count: 5,
    },
    {
      id: '2',
      name: 'CloudScale Systems',
      email: 'careers@cloudscale.io',
      industry: 'Cloud Services',
      location: 'Hyderabad, India',
      website: 'www.cloudscale.io',
      registeredDate: '2024-03-30',
      position_count: 3,
    },
    {
      id: '3',
      name: 'DataMind Analytics',
      email: 'recruitment@datamind.ai',
      industry: 'Data Science',
      location: 'Pune, India',
      website: 'www.datamind.ai',
      registeredDate: '2024-03-28',
      position_count: 2,
    },
  ]

  const mockApprovedCompanies = [
    {
      id: '4',
      name: 'TechCorp India',
      industry: 'IT Services',
      location: 'Bangalore',
      positions: 15,
      approvedDate: '2024-03-15',
    },
    {
      id: '5',
      name: 'InnovateLabs',
      industry: 'Startup',
      location: 'Pune',
      positions: 8,
      approvedDate: '2024-03-10',
    },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Company Approvals</h1>
            <p className="text-muted-foreground">Review and approve company registrations</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Pending Reviews</div>
              <div className="text-2xl font-bold text-yellow-600">{mockPendingCompanies.length}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Approved Companies</div>
              <div className="text-2xl font-bold text-green-600">{mockApprovedCompanies.length}</div>
            </div>
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="text-sm text-muted-foreground mb-1">Total Positions</div>
              <div className="text-2xl font-bold">
                {mockApprovedCompanies.reduce((sum, c) => sum + c.positions, 0)}
              </div>
            </div>
          </div>

          {/* Pending Approvals Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Pending Registrations</h2>

            {mockPendingCompanies.length > 0 ? (
              <div className="space-y-4">
                {mockPendingCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="p-6 border border-border rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.email}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Industry:</span>
                            <p className="font-semibold">{company.industry}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <p className="font-semibold">{company.location}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Registered:</span>
                            <p className="font-semibold">{formatDate(company.registeredDate)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Positions:</span>
                            <p className="font-semibold">{company.position_count}</p>
                          </div>
                        </div>

                        {company.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`https://${company.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {company.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">No pending company registrations</p>
              </div>
            )}
          </div>

          {/* Approved Companies Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Approved Companies</h2>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Industry</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Positions</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Approved</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockApprovedCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{company.name}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{company.industry}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{company.location}</td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary">{company.positions}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(company.approvedDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              Revoke
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
