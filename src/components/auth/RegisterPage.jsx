import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { useTheme } from '../../contexts/ThemeContext.jsx'

const RegisterPage = ({ onClose, switchToLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp } = useAuth()
  
  // Use theme context with fallback
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, { 
      full_name: fullName 
    })
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-gray-900/80 to-green-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        {/* Success background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`relative rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border backdrop-blur-xl transform animate-scaleIn transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/90 border-gray-600/50 shadow-gray-900/50' 
            : 'bg-white/95 border-gray-200/50 shadow-gray-400/20'
        }`}>
          {/* Success glassmorphism overlay */}
          <div className={`absolute inset-0 rounded-3xl ${
            isDarkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'bg-gradient-to-br from-white/60 to-gray-100/60'
          }`}></div>
          
          <div className="relative z-10">
            <div className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} animate-bounce`}>
              <svg className="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode 
                ? 'from-white via-green-200 to-emerald-300' 
                : 'from-gray-900 via-green-700 to-emerald-900'
            }`}>Account Created!</h2>
            <p className={`mb-6 leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Please check your email to verify your account.
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-gray-900/80 to-purple-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-indigo-400/20 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className={`relative rounded-3xl shadow-2xl max-w-md w-full p-8 border backdrop-blur-xl transform animate-scaleIn transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-600/50 shadow-gray-900/50' 
          : 'bg-white/95 border-gray-200/50 shadow-gray-400/20'
      }`}>
        {/* Glassmorphism overlay */}
        <div className={`absolute inset-0 rounded-3xl ${
          isDarkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'bg-gradient-to-br from-white/60 to-gray-100/60'
        }`}></div>
        
        {/* Animated border glow */}
        <div className={`absolute inset-0 rounded-3xl opacity-50 ${
          isDarkMode ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20' : 'bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20'
        } blur-xl animate-pulse`}></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode 
                ? 'from-white via-purple-200 to-indigo-300' 
                : 'from-gray-900 via-purple-800 to-indigo-900'
            }`}>Create Account</h2>
            <button
              onClick={onClose}
              className={`transition-all duration-200 p-2 rounded-xl ${
                isDarkMode 
                  ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
              } transform hover:scale-110 active:scale-95`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className={`border rounded-xl p-4 mb-6 transform animate-slideInUp ${
              isDarkMode 
                ? 'bg-red-900/30 border-red-700/50 shadow-red-900/20' 
                : 'bg-red-50 border-red-200/50 shadow-red-200/20'
            }`}>
              <p className={`text-sm ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-400' 
                    : 'border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-500'
                } focus:scale-[1.02] hover:shadow-lg`}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-400' 
                    : 'border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-500'
                } focus:scale-[1.02] hover:shadow-lg`}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-400' 
                    : 'border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-500'
                } focus:scale-[1.02] hover:shadow-lg`}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 backdrop-blur-sm ${
                  isDarkMode 
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-400' 
                    : 'border-gray-300/50 bg-gray-50/50 text-gray-900 placeholder-gray-500'
                } focus:scale-[1.02] hover:shadow-lg`}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Already have an account?{' '}
              <button
                onClick={switchToLogin}
                className={`font-semibold transition-all duration-200 underline-offset-4 hover:underline ${
                  isDarkMode 
                    ? 'text-purple-400 hover:text-purple-300' 
                    : 'text-purple-600 hover:text-purple-700'
                } transform hover:scale-105`}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
