'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { ProfileForm } from '@/components/profile-form'
import { fetchProfile } from '@/lib/client-api'

export default function CompleteProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

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
        <div className="animate-spin text-emerald-400">
          <div className="h-12 w-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8">
        <div className="container max-w-2xl">
          <ProfileForm
            initialProfile={user?.profile}
            title="Complete Your Profile"
            description="Finish your profile once and the same data will appear in Edit Profile too."
            submitLabel="Complete Profile"
            successTitle="Profile Complete!"
            successDescription="Ready to explore internships"
            onSaved={(updatedUser) => {
              setUser(updatedUser)
              router.push('/dashboard')
            }}
          />
        </div>
      </main>
    </>
  )
}
