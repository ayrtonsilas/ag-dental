'use client'

import React from 'react'
import { AuthProvider } from '@/lib/AuthContext'
import { NotificationProvider } from '@/components/Notification'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AuthProvider>
  )
} 