import { Link } from 'react-router-dom'
import { Home, Users, Briefcase, Calendar, BarChart3, LogOut, User } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
import { logout } from '@/features/auth/authSlice'
import styles from '@/app/components-styles/Sidebar.module.css'

export const Sidebar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Deals', href: '/deals', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h1 className={styles.title}>Mini CRM</h1>
        <p className={styles.subtitle}>Freelance Management</p>
      </div>

      <nav className={styles.nav}>
        {navigation.map(item => {
          const Icon = item.icon
          return (
            <Link key={item.name} to={item.href} className={styles.navItem}>
              <Icon className={styles.icon} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className={styles.user_block}>
        <div className={styles.user_info}>
          <User className={styles.icon} />
          <div className={styles.user_name}>
            <span>{user?.name || 'User'}</span>
            <span>{user?.email || ''}</span>
          </div>
        </div>
        <button className={styles.logout} onClick={handleLogout}>
          <LogOut className={styles.icon} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
