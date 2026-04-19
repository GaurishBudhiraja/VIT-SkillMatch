'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, FileText, LogOut, Briefcase, Settings } from 'lucide-react'
import { showToast } from '@/lib/toast-utils'
import { logout, getCurrentUser } from '@/lib/client-api'
import { useEffect } from 'react'

export function ProfileDropdown() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await logout()
    showToast.success('Logged out', 'See you next time!')
    router.push('/auth/login')
    router.refresh()
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  if (!user) return null

  const initials = user.fullName
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background/95 border-white/10 backdrop-blur">
        <DropdownMenuLabel className="py-2">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{user.fullName}</span>
            <span className="text-xs text-foreground/60">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={() => handleNavigation(user.role === 'employer' ? '/employer/dashboard' : '/profile/view')}
          className="cursor-pointer hover:bg-white/10"
        >
          <User className="w-4 h-4 mr-2 text-emerald-400" />
          <span>{user.role === 'employer' ? 'Company Dashboard' : 'My Profile'}</span>
        </DropdownMenuItem>

        {user.role === 'student' ? (
          <>
            <DropdownMenuItem
              onClick={() => handleNavigation('/profile/edit')}
              className="cursor-pointer hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2 text-cyan-400" />
              <span>Edit Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleNavigation('/profile/applications')}
              className="cursor-pointer hover:bg-white/10"
            >
              <Briefcase className="w-4 h-4 mr-2 text-emerald-400" />
              <span>My Applications</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => handleNavigation('/employer/dashboard')}
            className="cursor-pointer hover:bg-white/10"
          >
            <Briefcase className="w-4 h-4 mr-2 text-emerald-400" />
            <span>Applications</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
