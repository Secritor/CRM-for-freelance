import Link from 'next/link'
import { Home, Users, Briefcase, Calendar, BarChart3, LogOut, User } from 'lucide-react'
import styles from './Sidebar.module.css'

export const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Deals', href: '/deals', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

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
            <Link key={item.name} href={item.href} className={styles.navItem}>
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
            <span>Demo User</span>
            <span>User@gmail.com</span>
          </div>
        </div>
        <div className={styles.logout}>
          <LogOut className={styles.icon} />
          <a href="#">Logout</a>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
