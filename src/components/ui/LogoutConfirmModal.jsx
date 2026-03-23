import React from 'react'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, userInfo }) => {
  // Use theme context with fallback
  let isDarkMode = false
  try {
    const theme = useTheme()
    isDarkMode = theme.isDarkMode
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className={`relative rounded-3xl shadow-2xl max-w-md w-full p-8 border transform animate-scaleIn transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600/50' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200/50'
      }`}>
        {/* Animated background glow */}
        <div className={`absolute inset-0 rounded-3xl opacity-20 blur-2xl ${
          isDarkMode ? 'bg-red-500' : 'bg-red-400'
        }`}></div>
        
        {/* Floating particles */}
        <div className="absolute top-4 right-4">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isDarkMode ? 'bg-red-400' : 'bg-red-500'
          }`}></div>
        </div>
        <div className="absolute top-8 right-8">
          <div className={`w-1 h-1 rounded-full animate-ping ${
            isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
          }`} style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="absolute bottom-6 left-6">
          <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
            isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500'
          }`} style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10">
          {/* Animated icon */}
          <div className="flex justify-center mb-6">
            <div className={`relative p-4 rounded-full animate-bounce ${
              isDarkMode 
                ? 'bg-red-500/20 border-2 border-red-400/50' 
                : 'bg-red-100 border-2 border-red-300/50'
            }`}>
              <div className={`absolute inset-0 rounded-full animate-ping ${
                isDarkMode ? 'bg-red-400/30' : 'bg-red-500/30'
              }`}></div>
              <svg 
                className={`relative w-8 h-8 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>

          {/* Title with gradient text */}
          <h2 className={`text-2xl font-bold text-center mb-8 bg-gradient-to-r bg-clip-text text-transparent ${
            isDarkMode 
              ? 'from-white via-red-200 to-red-300' 
              : 'from-gray-900 via-red-700 to-red-900'
          }`}>
            Confirm Logout
          </h2>

          {/* User info display */}
          {userInfo && (
            <div className={`mb-8 p-4 rounded-2xl border ${
              isDarkMode 
                ? 'bg-gray-700/50 border-gray-600/50' 
                : 'bg-gray-100/50 border-gray-200/50'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                  {(userInfo.user_metadata?.full_name || userInfo.email)?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {userInfo.user_metadata?.full_name || 'User'}
                  </p>
                  <p className={`text-xs truncate ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{userInfo.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <p className={`text-center mb-8 leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Are you sure you want to sign out? You'll need to sign in again to access your saved components.
          </p>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 border-2 ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-900'
              } transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border-2 border-red-500 hover:border-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmModal
