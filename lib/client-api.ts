'use client'

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  const payload = await response.json()

  if (!response.ok || !payload.success) {
    throw new Error(payload?.error?.message || 'Request failed')
  }

  return payload.data as T
}

export function getCurrentUser() {
  return apiRequest<{ user: any }>('/api/auth/me')
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<{ user: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function signup(payload: {
  fullName: string
  email: string
  password: string
  role: 'student' | 'employer'
  companyName?: string
  employerId?: string
}) {
  return apiRequest<{ user: any }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout() {
  return apiRequest<{ loggedOut: boolean }>('/api/auth/logout', {
    method: 'POST',
  })
}

export function fetchDashboard(params?: { search?: string; domain?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set('search', params.search)
  if (params?.domain) searchParams.set('domain', params.domain)
  const query = searchParams.toString()
  return apiRequest<{
    user: any
    profile: any
    internships: any[]
    appliedIds: string[]
    savedIds: string[]
  }>(`/api/dashboard${query ? `?${query}` : ''}`)
}

export function fetchProfile() {
  return apiRequest<{ user: any; profile: any }>('/api/profile')
}

export function saveProfile(payload: any) {
  return apiRequest<{ user: any; profile: any }>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function fetchApplications() {
  return apiRequest<{ applications: any[] }>('/api/applications')
}

export function withdrawApplication(applicationId: string) {
  return apiRequest<{ removed: boolean }>('/api/applications', {
    method: 'DELETE',
    body: JSON.stringify({ applicationId }),
  })
}

export function fetchSavedInternships() {
  return apiRequest<{ internships: any[] }>('/api/saved')
}

export function fetchInternship(internshipId: string) {
  return apiRequest<{ internship: any; applied: boolean; saved: boolean }>(
    `/api/internships/${internshipId}`,
  )
}

export function applyToInternship(internshipId: string) {
  return apiRequest<{ internship: any }>(`/api/internships/${internshipId}/apply`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function setSavedInternship(internshipId: string, saved: boolean) {
  return apiRequest<{ internship: any; saved: boolean }>(
    `/api/internships/${internshipId}/save`,
    {
      method: 'POST',
      body: JSON.stringify({ saved }),
    },
  )
}

export function fetchEmployerDashboard() {
  return apiRequest<{
    user: any
    employerProfile: any
    internships: any[]
    applications: any[]
  }>('/api/employer/dashboard')
}

export function updateEmployerApplicationStatus(
  applicationId: string,
  status: 'accepted' | 'rejected',
) {
  return apiRequest<{ application: any }>(`/api/employer/applications/${applicationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function fetchNotifications() {
  return apiRequest<{ notifications: any[] }>('/api/notifications')
}

export function markNotificationsRead() {
  return apiRequest<{ updated: boolean }>('/api/notifications', {
    method: 'PATCH',
    body: JSON.stringify({}),
  })
}
