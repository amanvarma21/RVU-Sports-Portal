import { useCallback, useEffect, useState } from 'react'
import { api } from './services/api.js'
import AboutSection from './components/AboutSection.jsx'
import AuthStatusBar from './components/AuthStatusBar.jsx'
import FeaturesSection from './components/FeaturesSection.jsx'
import Footer from './components/Footer.jsx'
import HeroSection from './components/HeroSection.jsx'
import LoginModal from './components/LoginModal.jsx'
import Navbar from './components/Navbar.jsx'
import SportsSection from './components/SportsSection.jsx'
import ToastBanner from './components/ToastBanner.jsx'
import TournamentsSection from './components/TournamentsSection.jsx'
import StaffDashboard from './components/staff/StaffDashboard.jsx'
import './App.css'

const STAFF_ROLES = new Set(['staff', 'faculty', 'admin'])

/**
 * Validates that an email strictly ends with rvu.edu.in
 */
const isRvuEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const clean = email.trim().toLowerCase()
  return /^[^\s@]+@(?:[a-z0-9-]+\.)*rvu\.edu\.in$/.test(clean)
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sportsList, setSportsList] = useState([])
  const [tournamentsList, setTournamentsList] = useState([])
  const [selectedSport, setSelectedSport] = useState(null)
  const [sportsLoading, setSportsLoading] = useState(true)
  const [tournamentsLoading, setTournamentsLoading] = useState(true)
  const [sportsError, setSportsError] = useState('')
  const [tournamentsError, setTournamentsError] = useState('')
  const [sessionChecking, setSessionChecking] = useState(() => {
    try {
      return Boolean(localStorage.getItem('rvu_sports_token'))
    } catch {
      return false
    }
  })

  // Only accept the user role verified by the backend, not a localStorage value.
  const [currentUser, setCurrentUser] = useState(null)

  // Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginRole, setLoginRole] = useState('student') // 'student' | 'staff'
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const loadSports = useCallback(async () => {
    setSportsLoading(true)
    setSportsError('')
    try {
      const data = await api.getSports()
      const sports = data || []
      setSportsList(sports)
      setSelectedSport((selected) => sports.find((sport) => sport.id === selected?.id) || null)
      return sports
    } catch (error) {
      setSportsError(error.message || 'Failed to load sports.')
      throw error
    } finally {
      setSportsLoading(false)
    }
  }, [])

  const loadTournaments = useCallback(async () => {
    setTournamentsLoading(true)
    setTournamentsError('')
    try {
      const data = await api.getTournaments()
      const tournaments = data || []
      setTournamentsList(tournaments)
      return tournaments
    } catch (error) {
      setTournamentsError(error.message || 'Failed to load tournaments.')
      throw error
    } finally {
      setTournamentsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    const verifySession = async () => {
      let token
      try {
        token = localStorage.getItem('rvu_sports_token')
      } catch {
        token = null
      }

      if (!token) {
        return
      }

      try {
        const response = await api.getMe()
        if (active && response.user) setCurrentUser(response.user)
      } catch {
        try {
          localStorage.removeItem('rvu_sports_token')
          localStorage.removeItem('rvu_sports_user')
        } catch {
          // Storage may be unavailable; the invalid session is still not trusted.
        }
        if (active) setCurrentUser(null)
      } finally {
        if (active) setSessionChecking(false)
      }
    }

    verifySession()
    api.getSports()
      .then((data) => {
        if (!active) return
        const sports = data || []
        setSportsList(sports)
        setSelectedSport((selected) => sports.find((sport) => sport.id === selected?.id) || null)
      })
      .catch((error) => {
        if (active) setSportsError(error.message || 'Failed to load sports.')
      })
      .finally(() => {
        if (active) setSportsLoading(false)
      })

    api.getTournaments()
      .then((data) => {
        if (active) setTournamentsList(data || [])
      })
      .catch((error) => {
        if (active) setTournamentsError(error.message || 'Failed to load tournaments.')
      })
      .finally(() => {
        if (active) setTournamentsLoading(false)
      })

    return () => {
      active = false
    }
  }, [loadSports, loadTournaments])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(''), 5000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const openLoginModal = (initialError = '') => {
    setLoginError(initialError)
    setIsLoginModalOpen(true)
    setMobileMenuOpen(false)
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')

    const cleanEmail = loginEmail.trim().toLowerCase()

    if (!cleanEmail) {
      setLoginError('Please enter your university email address.')
      return
    }

    if (!isRvuEmail(cleanEmail)) {
      setLoginError(
        'Access Restricted: Only official RV University email addresses (@rvu.edu.in) are accepted. Other domains (e.g., Gmail, Yahoo) are not permitted.'
      )
      return
    }

    if (!loginPassword || loginPassword.length < 4) {
      setLoginError('Please enter your password (minimum 4 characters).')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.login({
        email: cleanEmail,
        password: loginPassword,
        role: loginRole,
      })

      if (response.token) {
        localStorage.setItem('rvu_sports_token', response.token)
        localStorage.setItem('rvu_sports_user', JSON.stringify(response.user))
        setCurrentUser(response.user)
      }

      setIsLoginModalOpen(false)
      setLoginEmail('')
      setLoginPassword('')
      setLoginError('')
      setToastMessage(`Welcome, ${response.user.name}! Signed in as ${response.user.role === 'student' ? 'Student Athlete' : 'Coach / Staff'}.`)
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check credentials and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('rvu_sports_token')
      localStorage.removeItem('rvu_sports_user')
    } catch {
      // Ignore
    }
    setCurrentUser(null)
    setToastMessage('You have been safely signed out.')
  }

  const handleTournamentAction = async (tournament) => {
    if (!currentUser) {
      openLoginModal('Please log in with your @rvu.edu.in email to register for tournaments or view varsity fixtures.')
      return
    }

    try {
      const res = await api.registerForTournament(tournament._id || tournament.id)
      setToastMessage(res.message || `Successfully registered for ${tournament.title}!`)
      await loadTournaments()
    } catch (err) {
      setToastMessage(`Registration: ${err.message}`)
    }
  }

  const handleStaffCreateSport = (data) => api.createSport(data)
  const handleStaffUpdateSport = (id, data) => api.updateSport(id, data)
  const handleStaffDeleteSport = (id) => api.deleteSport(id)
  const handleStaffCreateTournament = (data) => api.createTournament(data)
  const handleStaffUpdateTournament = (id, data) => api.updateTournament(id, data)
  const handleStaffDeleteTournament = (id) => api.deleteTournament(id)

  const hasTypedEmail = loginEmail.trim().length > 0
  const isCurrentlyValidEmail = isRvuEmail(loginEmail)

  if (sessionChecking) {
    return (
      <div className="portal-loading" role="status">
        Verifying your session...
      </div>
    )
  }

  if (currentUser && STAFF_ROLES.has(currentUser.role)) {
    return (
      <StaffDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        sportsList={sportsList}
        tournamentsList={tournamentsList}
        sportsLoading={sportsLoading}
        tournamentsLoading={tournamentsLoading}
        sportsError={sportsError}
        tournamentsError={tournamentsError}
        onRefreshSports={loadSports}
        onRefreshTournaments={loadTournaments}
        onCreateSport={handleStaffCreateSport}
        onUpdateSport={handleStaffUpdateSport}
        onDeleteSport={handleStaffDeleteSport}
        onCreateTournament={handleStaffCreateTournament}
        onUpdateTournament={handleStaffUpdateTournament}
        onDeleteTournament={handleStaffDeleteTournament}
      />
    )
  }

  return (
    <>
      <Navbar
        currentUser={currentUser}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
        onOpenLogin={openLoginModal}
        scrollToSection={scrollToSection}
      />
      {currentUser && (
        <AuthStatusBar currentUser={currentUser} scrollToSection={scrollToSection} />
      )}
      {toastMessage && (
        <ToastBanner message={toastMessage} onDismiss={() => setToastMessage('')} />
      )}
      <main>
        <HeroSection sportsCount={sportsList.length} loading={sportsLoading} scrollToSection={scrollToSection} />
        <SportsSection
          sportsList={sportsList}
          selectedSport={selectedSport}
          onSelectSport={setSelectedSport}
          currentUser={currentUser}
          onRequestLogin={() => openLoginModal('Please sign in to view sport details and team rosters.')}
          loading={sportsLoading}
          error={sportsError}
        />
        <TournamentsSection
          tournamentsList={tournamentsList}
          currentUser={currentUser}
          onTournamentAction={handleTournamentAction}
          loading={tournamentsLoading}
          error={tournamentsError}
        />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer
        sportsList={sportsList}
        currentUser={currentUser}
        onSelectSport={setSelectedSport}
        onLogout={handleLogout}
        onOpenLogin={openLoginModal}
        scrollToSection={scrollToSection}
      />
      {isLoginModalOpen && (
        <LoginModal
          loginRole={loginRole}
          setLoginRole={setLoginRole}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginError={loginError}
          setLoginError={setLoginError}
          isSubmitting={isSubmitting}
          hasTypedEmail={hasTypedEmail}
          isCurrentlyValidEmail={isCurrentlyValidEmail}
          onClose={() => setIsLoginModalOpen(false)}
          onSubmit={handleLoginSubmit}
        />
      )}
    </>
  )
}

export default App
