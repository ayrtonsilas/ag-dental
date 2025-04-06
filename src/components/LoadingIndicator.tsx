import React from 'react'

interface LoadingIndicatorProps {
  fullScreen?: boolean
  message?: string
}

/**
 * A reusable loading indicator component
 * Shows a spinner and optional message
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  fullScreen = false,
  message = 'Carregando...'
}) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          {message && <p className="text-gray-600">{message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  )
} 