import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiSearchLine, RiAddCircleLine, RiNotification3Line, RiMenuLine, RiCloseLine } from 'react-icons/ri'
import useAuthStore from '../../store/authStore'
import Avatar from '../common/Avatar'
import { useDebounce } from '../../hooks'

const Navbar = ({ onMenuToggle }) => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setShowDropdown(false)
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-dark-600/50">
      <div className="flex items-center gap-3 px-4 h-16">
        {/* Mobile menu button */}
        <button onClick={onMenuToggle} className="lg:hidden btn-ghost p-2 -ml-1">
          <RiMenuLine className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-display text-xl tracking-wider text-zinc-100 hidden sm:block">
            STREAM<span className="text-brand-400">VAULT</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos, channels..."
              className="w-full bg-dark-700 border border-dark-500 rounded-full pl-9 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="btn-primary hidden sm:flex items-center gap-2 text-sm py-2">
                <RiAddCircleLine className="w-4 h-4" />
                <span>Upload</span>
              </Link>
              <button className="btn-ghost p-2 relative">
                <RiNotification3Line className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full hover:ring-2 ring-brand-500 transition-all"
                >
                  <Avatar src={user?.avatar} alt={user?.username} size="sm" />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 top-12 w-56 card border border-dark-500 py-1 z-20 animate-slide-up shadow-2xl">
                      <div className="px-4 py-3 border-b border-dark-600">
                        <p className="font-semibold text-zinc-100 text-sm">{user?.fullName}</p>
                        <p className="text-xs text-zinc-400">@{user?.username}</p>
                      </div>
                      <Link to={`/channel/${user?.username}`} className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-dark-700 hover:text-zinc-100 transition-colors" onClick={() => setShowDropdown(false)}>
                        My Channel
                      </Link>
                      <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-dark-700 hover:text-zinc-100 transition-colors" onClick={() => setShowDropdown(false)}>
                        Dashboard
                      </Link>
                      <Link to="/settings" className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-dark-700 hover:text-zinc-100 transition-colors" onClick={() => setShowDropdown(false)}>
                        Settings
                      </Link>
                      <div className="border-t border-dark-600 mt-1 pt-1">
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 transition-colors">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
