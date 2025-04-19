'use client'

import React, { useState, useEffect } from 'react'
import { createContext, useContext, ReactNode } from 'react'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationProps {
  message: string
  type: NotificationType
  duration?: number
  onClose?: () => void
  isVisible: boolean
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  isVisible
}) => {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isVisible && duration) {
      timer = setTimeout(() => {
        setIsClosing(true)
        setTimeout(() => {
          if (onClose) onClose()
        }, 300) // Allow animation to complete before fully closing
      }, duration)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'info':
        return 'bg-blue-500'
      default:
        return 'bg-gray-700'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`flex items-center p-4 text-white rounded-lg shadow-md transform transition-all duration-300 ease-in-out ${getTypeStyles()} ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
        role="alert"
      >
        <div className="flex-shrink-0 mr-2">
          {getIcon()}
        </div>
        <div className="text-sm font-medium">{message}</div>
        <button 
          type="button" 
          onClick={() => {
            setIsClosing(true)
            setTimeout(() => {
              if (onClose) onClose()
            }, 300)
          }} 
          className="ml-4 bg-transparent text-white hover:text-gray-200 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string
    type: NotificationType
    isVisible: boolean
    duration?: number
  } | null>(null)

  const showNotification = (message: string, type: NotificationType, duration = 3000) => {
    setNotification({ message, type, isVisible: true, duration })
    setTimeout(() => setNotification(null), duration)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          duration={notification.duration}
          onClose={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export default Notification 