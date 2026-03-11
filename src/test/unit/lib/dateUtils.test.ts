import { describe, it, expect, vi } from 'vitest'
import {
  formatDateInput,
  parseDate,
  formatDisplayDate,
  parseTimeFromDate,
  getDaysAgo,
  getYearsAgo,
  isInCurrentWeek,
  getWeekKey,
} from '@/lib/dateUtils'

describe('dateUtils', () => {
  describe('formatDateInput', () => {
    it('formats Date to YYYY-MM-DD', () => {
      expect(formatDateInput(new Date(2026, 2, 12))).toBe('2026-03-12')
      expect(formatDateInput(new Date(2025, 0, 1))).toBe('2025-01-01')
    })
  })

  describe('parseDate', () => {
    it('returns Date as-is', () => {
      const d = new Date()
      expect(parseDate(d)).toBe(d)
    })
    it('parses ISO string to Date', () => {
      const d = parseDate('2026-03-12T10:00:00.000Z')
      expect(d.getFullYear()).toBe(2026)
      expect(d.getMonth()).toBe(2)
      expect(d.getDate()).toBe(12)
    })
  })

  describe('formatDisplayDate', () => {
    it('formats date for display (e.g. Mar 12, 2026)', () => {
      expect(formatDisplayDate(new Date(2026, 2, 12))).toBe('Mar 12, 2026')
    })
    it('returns em dash for invalid date', () => {
      expect(formatDisplayDate('invalid')).toBe('—')
    })
  })

  describe('parseTimeFromDate', () => {
    it('extracts HH:mm from Date', () => {
      const d = new Date(2026, 0, 1, 9, 5)
      expect(parseTimeFromDate(d)).toBe('09:05')
    })
    it('works with ISO string', () => {
      // parseTimeFromDate uses local time from the Date; assert format HH:mm
      const result = parseTimeFromDate('2026-01-01T14:30:00.000Z')
      expect(/^\d{2}:\d{2}$/.test(result)).toBe(true)
      const [h, m] = result.split(':').map(Number)
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThanOrEqual(23)
      expect(m).toBe(30)
    })
  })

  describe('getDaysAgo', () => {
    it('returns date N days in the past', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 2, 15))
      const d = getDaysAgo(3)
      expect(d.getDate()).toBe(12)
      expect(d.getMonth()).toBe(2)
      vi.useRealTimers()
    })
  })

  describe('getYearsAgo', () => {
    it('returns date N years in the past', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 5, 1))
      const d = getYearsAgo(1)
      expect(d.getFullYear()).toBe(2025)
      vi.useRealTimers()
    })
  })

  describe('getWeekKey', () => {
    it('returns YYYY-MM-DD for given date', () => {
      expect(getWeekKey(new Date(2026, 2, 12))).toBe('2026-03-12')
    })
  })

  describe('isInCurrentWeek', () => {
    it('returns true for date in current week', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 2, 12)) // Thursday
      const monday = new Date(2026, 2, 9)
      expect(isInCurrentWeek(monday)).toBe(true)
      vi.useRealTimers()
    })
    it('returns false for date outside current week', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 2, 12))
      const nextWeek = new Date(2026, 2, 16)
      expect(isInCurrentWeek(nextWeek)).toBe(false)
      vi.useRealTimers()
    })
  })
})
