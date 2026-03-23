/**
 * Sidebar component with navigation and tools
 * 
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { getUserComponents, deleteComponent } from '../../services/componentStorage.js'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import LoginPage from '../auth/LoginPage.jsx'
import RegisterPage from '../auth/RegisterPage.jsx'
import LogoutConfirmModal from './LogoutConfirmModal.jsx'

const Sidebar = ({ isOpen, onClose, onLoadComponent, refreshTrigger }) => {
  const { user, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [savedComponents, setSavedComponents] = useState([])
  const [loadingComponents, setLoadingComponents] = useState(false)
  
  // Use theme context with fallback
  let isDarkMode = false;
  try {
    const theme = useTheme();
    isDarkMode = theme.isDarkMode;
  } catch (error) {
    console.warn('Theme context not available, using light mode as fallback');
  }

  useEffect(() => {
    if (user) {
      loadSavedComponents()
    }
  }, [user])

  // Auto-refresh saved components when refreshTrigger changes
  useEffect(() => {
    if (user && refreshTrigger > 0) {
      loadSavedComponents()
    }
  }, [refreshTrigger, user])

  const loadSavedComponents = async () => {
    setLoadingComponents(true)
    try {
      const { data, error } = await getUserComponents()
      if (!error && data) {
        setSavedComponents(data)
      }
    } catch (error) {
      console.error('Error loading components:', error)
    } finally {
      setLoadingComponents(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setSavedComponents([])
    setShowLogoutConfirm(false)
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleDeleteComponent = async (id) => {
    const { error } = await deleteComponent(id)
    if (!error) {
      setSavedComponents(prev => prev.filter(comp => comp.id !== id))
    }
  }
  return (
    <>
      {/* Enhanced overlay with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}
      
      {/* Enhanced Sidebar with glassmorphism */}
      <div className={`
        fixed top-0 left-0 h-screen w-80 shadow-2xl transform transition-all duration-500 ease-out z-50 border-r flex flex-col backdrop-blur-lg
        ${isOpen ? 'translate-x-0 scale-100' : '-translate-x-full scale-95'}
        lg:w-72
        ${isDarkMode 
          ? 'bg-gray-800/95 border-gray-700/50 shadow-gray-900/50' 
          : 'bg-white/95 border-gray-200/50 shadow-gray-400/20'
        }
      `}>
        {/* Animated background pattern */}
        <div className={`absolute inset-0 opacity-5 ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
        }`} style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        
        {/* Enhanced Sidebar Header */}
        <div className={`relative z-10 flex items-center justify-between px-6 py-5 border-b flex-shrink-0 ${
          isDarkMode 
            ? 'border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-850/80' 
            : 'border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-gray-100/80'
        }`}>
          <h2 className={`text-xl font-bold tracking-wide flex items-center gap-3 animate-slideInLeft ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="relative">
              <span className="text-2xl animate-spin" style={{ animationDuration: '3s' }}>⚙️</span>
              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping ${
                isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
              }`}></div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tools & Settings
            </span>
          </h2>
          
          <button
            onClick={onClose}
            className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 active:scale-95 ${
              isDarkMode 
                ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-200/50 text-gray-600 hover:text-gray-900'
            }`}
          >
            {/* Animated glow effect */}
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg ${
              isDarkMode ? 'bg-red-500/20' : 'bg-red-400/20'
            }`}></div>
            
            <svg className={`relative z-10 w-5 h-5 transition-all duration-300 group-hover:rotate-90 ${
              isDarkMode 
                ? 'text-gray-300 group-hover:text-red-400' 
                : 'text-gray-600 group-hover:text-red-500'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">
            {/* Saved Components */}
            {user && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📦</span>
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Saved Components
                  </h3>
                  {loadingComponents && (
                    <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin opacity-70"></div>
                  )}
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {loadingComponents ? (
                    <div className="flex items-center gap-3 px-4 py-4 text-sm text-slate-400 bg-gray-700/30 rounded-xl border border-gray-600/40 backdrop-blur-sm">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading components...
                    </div>
                  ) : savedComponents.length > 0 ? (
                    <div key={`components-${refreshTrigger}`} className="animate-fadeIn space-y-3">
                      {savedComponents.map((component) => (
                        <div
                          key={component.id}
                          className="px-4 py-3 bg-gray-700/40 hover:bg-gray-700/60 rounded-xl border border-gray-600/50 hover:border-gray-500/60 backdrop-blur-sm group transition-all duration-200 hover:shadow-lg"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-200 truncate mb-1">
                                {component.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate font-medium">
                                {component.type}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  if (onLoadComponent) {
                                    onLoadComponent(component);
                                    onClose(); // Close sidebar after loading component
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                                title="Load component"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteComponent(component.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                title="Delete component"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center px-6 py-8 text-center text-sm text-gray-400 bg-gray-700/20 rounded-xl border border-gray-600/30 border-dashed backdrop-blur-sm">
                      <span className="text-2xl mb-2 opacity-50">📝</span>
                      <p className="text-sm">No saved components yet</p>
                      <p className="text-xs text-gray-500 mt-1">Generate and save components to see them here</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account Section - Moved to bottom */}
          <div className="px-6 py-5 border-t border-gray-600/40 bg-gray-800/60 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400">👤</span>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Account</h3>
            </div>
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-4 bg-gray-700/50 hover:bg-gray-700/70 rounded-xl border border-gray-600/50 backdrop-blur-sm shadow-soft transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-300 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white bg-gray-700/40 hover:bg-red-600/20 hover:border-red-500/30 rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm group"
                >
                  <span className="text-red-400 group-hover:text-red-300">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white bg-gray-700/40 hover:bg-blue-600/20 hover:border-blue-500/30 rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm group"
                >
                  <span className="text-blue-400 group-hover:text-blue-300">🔑</span>
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white bg-gray-700/40 hover:bg-green-600/20 hover:border-green-500/30 rounded-xl transition-all duration-200 border border-gray-600/50 backdrop-blur-sm group"
                >
                  <span className="text-green-400 group-hover:text-green-300">👤</span>
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
          switchToRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
        />
      )}

      {showRegister && (
        <RegisterPage
          onClose={() => setShowRegister(false)}
          switchToLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        />
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleSignOut}
        userInfo={user}
      />
    </>
  )
}

export default Sidebar;