'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { ProfileDropdown } from './profile-dropdown'
import { StudentNotifications } from './student-notifications'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/client-api'

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setIsLoggedIn(true)
        setRole(data.user.role)
      })
      .catch(() => {
        setIsLoggedIn(false)
        setRole(null)
      })
  }, [])
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-background/40 border-b border-white/5 glass-effect">
      <div className="container mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-1 flex-shrink-0 group">
            <div className="relative">
              <img 
                src="/vit-skillmatch-logo.png" 
                alt="VIT SkillMatch" 
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain animate-float"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent group-hover:drop-shadow-lg transition-all leading-tight">
                SkillMatch
              </span>
              <span className="text-xs text-cyan-400/70 font-semibold tracking-widest">VIT</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 mx-auto">
            <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-cyan-400 transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/browse" className="text-sm font-medium text-foreground/70 hover:text-cyan-400 transition-colors relative group">
              Browse
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('footer-about')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-foreground/70 hover:text-cyan-400 transition-colors relative group cursor-pointer">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-foreground/70 hover:text-cyan-400 transition-colors relative group cursor-pointer">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {isLoggedIn && role === 'student' && <StudentNotifications />}
            {isLoggedIn && role === 'student' && (
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 hover:bg-white/10">
                <Link href="/saved">
                  <Bookmark className="h-5 w-5 text-cyan-400" />
                </Link>
              </Button>
            )}
            {isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <div className="hidden sm:flex gap-2">
                <Button variant="outline" asChild className="border-white/20 hover:bg-white/5 h-9">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-9">
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
