'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ProfileForm } from '@/components/profile-form'

interface ProfileCompletionCardFixedProps {
  user: any
  onProfileCompleted: (profile: any) => void
}

export function ProfileCompletionCardFixed({
  user,
  onProfileCompleted,
}: ProfileCompletionCardFixedProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-6 border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded((prev) => !prev)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            <CardDescription>
              Help us find the best internship matches for your skills and experience
            </CardDescription>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <ProfileForm
            initialProfile={user?.profile}
            title="Student Profile"
            description="Complete this once and your dashboard will immediately unlock personalized matching."
            submitLabel="Save Profile"
            successTitle="Profile completed!"
            successDescription="Your dashboard is now personalized."
            onSaved={(updatedUser) => {
              onProfileCompleted(updatedUser.profile)
              setIsExpanded(false)
            }}
            onCancel={() => setIsExpanded(false)}
          />
        </CardContent>
      )}
    </Card>
  )
}
