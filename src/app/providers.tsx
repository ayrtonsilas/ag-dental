'use client'

import React from 'react'
import { AuthProvider } from '@/lib/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
} 