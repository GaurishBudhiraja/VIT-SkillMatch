'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { fetchNotifications, markNotificationsRead } from '@/lib/client-api'

export function StudentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetchNotifications()
      .then((data) => setNotifications(data.notifications))
      .catch(() => setNotifications([]))
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  )

  const handleOpenChange = async (open: boolean) => {
    if (!open || unreadCount === 0) {
      return
    }

    try {
      await markNotificationsRead()
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    } catch {
      // Keep the dropdown usable even if marking read fails.
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-white/10">
          <Bell className="h-5 w-5 text-cyan-400" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 bg-background/95 border-white/10 backdrop-blur">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="outline">{notifications.length}</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                href="/profile/applications"
                className="block border-b border-white/5 px-3 py-3 hover:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="text-xs text-foreground/60">{notification.companyName} • {notification.internshipRole}</p>
                    <p className="text-xs text-foreground/70">{notification.message}</p>
                  </div>
                  <Badge
                    className={
                      notification.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-red-500/20 text-red-300'
                    }
                  >
                    {notification.status}
                  </Badge>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-3 py-6 text-sm text-foreground/60">
              No notifications yet.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
