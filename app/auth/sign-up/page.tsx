'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { showToast } from '@/lib/toast-utils'
import { signup } from '@/lib/client-api'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'student' | 'employer'>('student')
  const [companyName, setCompanyName] = useState('')
  const [employerId, setEmployerId] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Signup triggered')
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      showToast.error('Passwords do not match')
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      showToast.warning('Password too short', 'At least 6 characters required')
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await signup({
        fullName,
        email,
        password,
        role,
        companyName: role === 'employer' ? companyName : undefined,
        employerId: role === 'employer' ? employerId : undefined,
      })
      showToast.success('Account created!', `Welcome ${fullName}!`)
      router.push(response.user.role === 'employer' ? '/employer/dashboard' : '/dashboard')
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-2xl font-bold text-background">
                  VS
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              SkillMatch
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              Create your account to get started
            </p>
          </div>

          {/* Sign Up Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSignUp} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground/80">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Account Type</Label>
                <div className="flex gap-3">
                  {(['student', 'employer'] as const).map((r) => (
                    <label key={r} className="flex-1">
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={(e) => setRole(e.target.value as typeof role)}
                        className="hidden"
                      />
                      <div
                        className={`px-4 py-2.5 rounded-lg border text-center cursor-pointer transition-all ${
                          role === r
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
                            : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                        }`}
                      >
                        <span className="text-sm font-medium capitalize">{r}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {role === 'employer' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm font-medium text-foreground/80">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Netflix"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employerId" className="text-sm font-medium text-foreground/80">
                      Employer ID
                    </Label>
                    <Input
                      id="employerId"
                      type="text"
                      placeholder="NETFLIX-HR-001"
                      value={employerId}
                      onChange={(e) => setEmployerId(e.target.value)}
                      className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50"
                      required
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••���•••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}
