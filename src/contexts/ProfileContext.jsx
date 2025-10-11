import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('pasteleriaUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('pasteleriaUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('pasteleriaUser')
  }

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('pasteleriaUser', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateProfile,
    isLoggedIn: !!user
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}