'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, register } from '@/features/auth/authSlice'
import type { RootState } from '@/store/store'
import styles from './LoginPage.module.css'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.auth.users)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirm, setRegisterConfirm] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      dispatch(login({ email, password }))
      toast.success('Welcome back!')
    } else {
      setLoginError('Invalid email or password')
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(`Password reset link sent to ${forgotEmail}`)
    setForgotModalOpen(false)
    setForgotEmail('')
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMismatch(false)
    setRegisterError('')

    if (registerPassword !== registerConfirm) {
      setPasswordMismatch(true)
      return
    }

    if (registerPassword.length < 5) {
      setRegisterError('Password must be at least 5 characters')
      return
    }

    const exists = users.some(u => u.email === registerEmail)
    if (exists) {
      setRegisterError('User with this email already exists')
      return
    }

    dispatch(register({ email: registerEmail, password: registerPassword }))
    toast.success('Account created! You can now log in.')
    setRegisterModalOpen(false)
    setRegisterEmail('')
    setRegisterPassword('')
    setRegisterConfirm('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>miniCRM</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="text"
              className={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="login-password"
                type={showLoginPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                tabIndex={-1}
              >
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.forgotLink}
            onClick={() => setForgotModalOpen(true)}
          >
            Forgot password?
          </button>

          {loginError && <p className={styles.error}>{loginError}</p>}

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>

          <button
            type="button"
            className={styles.registerButton}
            onClick={() => setRegisterModalOpen(true)}
          >
            Create Account
          </button>
        </form>

        <div className={styles.testCredentials}>
          <p className={styles.testTitle}>Test credentials:</p>
          <p className={styles.testInfo}>
            Email: <code>admin@admin</code> | Password: <code>12345</code>
          </p>
        </div>
      </div>

      <Dialog open={forgotModalOpen} onOpenChange={setForgotModalOpen}>
        <DialogContent className={styles.modalContent}>
          <form onSubmit={handleForgotPassword}>
            <DialogHeader className={styles.modalHeader}>
              <DialogTitle className={styles.modalTitle}>Reset Password</DialogTitle>
              <DialogDescription className={styles.modalDescription}>
                Enter your email to receive a password reset link
              </DialogDescription>
            </DialogHeader>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="forgot-email">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <DialogFooter className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setForgotModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Send Reset Link
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
        <DialogContent className={styles.modalContent}>
          <form onSubmit={handleRegister}>
            <DialogHeader className={styles.modalHeader}>
              <DialogTitle className={styles.modalTitle}>Create Account</DialogTitle>
              <DialogDescription className={styles.modalDescription}>
                Fill in the details to create a new account
              </DialogDescription>
            </DialogHeader>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={registerEmail}
                onChange={e => setRegisterEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-password">
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="register-password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  className={`${styles.input} ${passwordMismatch ? styles.inputError : ''}`}
                  placeholder="Enter password"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  tabIndex={-1}
                >
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="register-confirm">
                Confirm Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="register-confirm"
                  type={showRegisterConfirm ? 'text' : 'password'}
                  className={`${styles.input} ${passwordMismatch ? styles.inputError : ''}`}
                  placeholder="Confirm password"
                  value={registerConfirm}
                  onChange={e => setRegisterConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                  tabIndex={-1}
                >
                  {showRegisterConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordMismatch && <p className={styles.fieldError}>Passwords do not match</p>}
            </div>

            {registerError && <p className={styles.error}>{registerError}</p>}

            <DialogFooter className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setRegisterModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                Register
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
