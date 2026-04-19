'use client'

import { toast } from 'sonner'

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    })
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 3000,
    })
  },

  loading: (message: string) => {
    return toast.loading(message)
  },

  promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }) => {
    toast.promise(promise, messages)
  },

  info: (message: string, description?: string) => {
    toast(message, {
      description,
      duration: 3000,
    })
  },

  warning: (message: string, description?: string) => {
    toast(message, {
      description,
      icon: '⚠️',
      duration: 3000,
    })
  },

  funny: (message: string) => {
    const funnyIcons = ['🎉', '🚀', '✨', '🎊', '💡', '⚡', '🌟', '🎯']
    const randomIcon = funnyIcons[Math.floor(Math.random() * funnyIcons.length)]
    toast(message, {
      icon: randomIcon,
      duration: 2500,
    })
  },
}
