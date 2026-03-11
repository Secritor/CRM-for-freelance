import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/ui/dialog'
import type { FieldConfig } from '@/interfaces/main'
import styles from '@/app/components-styles/UniversalModal.module.css'

interface UniversalModalProps {
  open: boolean
  title: string
  description?: string
  fields: FieldConfig[]
  initialValues: Record<string, string | number | null>
  submitText?: string
  cancelText?: string
  loading?: boolean
  onSubmit: (data: Record<string, string | number | null>) => void
  onClose: () => void
}

export default function UniversalModal({
  open,
  title,
  description,
  fields,
  initialValues,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  onSubmit,
  onClose,
}: UniversalModalProps) {
  const [form, setForm] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(initialValues)
    }
  }, [initialValues, open])

  const handleChange = (name: string, value: string | number) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      onSubmit(form)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = loading || isSubmitting

  return (
    <Dialog open={open} onOpenChange={val => !val && onClose()}>
      <DialogContent className={styles.modal_content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <DialogHeader className={styles.modal_header}>
            <DialogTitle className={styles.modal_title}>{title}</DialogTitle>
            {description && (
              <DialogDescription className={styles.modal_description}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {fields.map(field => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={form[field.name] ?? ''}
              onChange={handleChange}
            />
          ))}

          <DialogFooter className={styles.footer}>
            <button type="button" className={styles.button_cancel} onClick={onClose}>
              {cancelText}
            </button>
            <button type="submit" className={styles.button_submit} disabled={isLoading}>
              {isLoading ? (
                <span className={styles.spinner}>
                  <svg className={styles.spinner_icon} viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="31.4 31.4"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                submitText
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface FieldRendererProps {
  field: FieldConfig
  value: string | number | null
  onChange: (name: string, value: string | number) => void
}

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const hourOptions = useMemo(
    () => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
    []
  )
  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')),
    []
  )

  const displayValue = value ?? ''

  if (field.type === 'textarea') {
    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`field-${field.name}`}>
          {field.label}
        </label>
        <textarea
          id={`field-${field.name}`}
          className={styles.textarea}
          placeholder={field.placeholder ?? field.label}
          required={field.required}
          value={displayValue}
          onChange={e => onChange(field.name, e.target.value)}
          rows={field.rows ?? 3}
        />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`field-${field.name}`}>
          {field.label}
        </label>
        <select
          id={`field-${field.name}`}
          className={styles.select}
          value={displayValue}
          required={field.required}
          onChange={e => onChange(field.name, e.target.value)}
        >
          <option value="">Select…</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'time-picker') {
    const timeStr = String(displayValue || '00:00')
    const [hours, minutes] = timeStr.split(':')

    const setTime = (h: string, m: string) => {
      onChange(field.name, `${h.padStart(2, '0')}:${m.padStart(2, '0')}`)
    }

    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`field-${field.name}`}>
          {field.label}
        </label>
        <div className={styles.time_row}>
          <select
            id={`field-${field.name}`}
            className={styles.select}
            value={hours ?? '00'}
            onChange={e => setTime(e.target.value, minutes ?? '00')}
            required={field.required}
            aria-label="Hours"
          >
            {hourOptions.map(h => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <span className={styles.time_sep}>:</span>
          <select
            className={styles.select}
            value={minutes ?? '00'}
            onChange={e => setTime(hours ?? '00', e.target.value)}
            required={field.required}
            aria-label="Minutes"
          >
            {minuteOptions.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`field-${field.name}`}>
        {field.label}
      </label>
      <input
        id={`field-${field.name}`}
        className={styles.input}
        placeholder={field.placeholder ?? field.label}
        required={field.required}
        type={field.type}
        value={displayValue}
        onChange={e => onChange(field.name, e.target.value)}
      />
    </div>
  )
}
