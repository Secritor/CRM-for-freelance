'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useState, useEffect } from 'react'
import styles from './HandleModal.module.css'
export type FieldType = 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea'

export interface UniversalField {
  name: string
  label: string
  type: FieldType
  required?: boolean

  // для select
  options?: { value: string | number; label: string }[]
}

interface HandleModalProps {
  open: boolean
  title: string
  description?: string
  fields: UniversalField[]
  initialValues: Record<string, any>
  onSubmit: (data: Record<string, any>) => void
  onClose: () => void
}

export default function HandleModal({
  open,
  title,
  description,
  fields,
  initialValues,
  onSubmit,
  onClose,
}: HandleModalProps) {
  const [form, setForm] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setForm(initialValues)
  }, [initialValues, open])

  const handleChange = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const normalized = {
      ...form,
      amount: Number(form.amount),
      clientId: Number(form.clientId),
      clientName: form?.name ?? '',
      clientCompany: form?.company ?? '',
    }

    onSubmit(normalized)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={styles.modal_container}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.form_container}>
          {fields.map(field => {
            const value = form[field.name] ?? ''

            switch (field.type) {
              case 'textarea':
                return (
                  <Textarea
                    key={field.name}
                    placeholder={field.label}
                    required={field.required}
                    value={value}
                    className={styles.form_input}
                    onChange={e => handleChange(field.name, e.target.value)}
                  />
                )

              case 'select':
                return (
                  <select
                    key={field.name}
                    className={styles.form_input}
                    value={value}
                    required={field.required}
                    onChange={e => handleChange(field.name, e.target.value)}
                  >
                    <option value="">Select…</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )

              default:
                return (
                  <Input
                    key={field.name}
                    placeholder={field.label}
                    required={field.required}
                    type={field.type}
                    value={value}
                    className={styles.form_input}
                    onChange={e => handleChange(field.name, e.target.value)}
                  />
                )
            }
          })}

          <Button type="submit" className={styles.form_button} disabled={loading}>
            {loading ? (
              <>
                <Spinner className={styles.spinner_icon} />
                <span className={styles.spinner_text}>Please wait...</span>
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
