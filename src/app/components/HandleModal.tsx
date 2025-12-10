'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
    setForm(initialValues)
  }, [initialValues, open])

  const handleChange = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
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
                    onChange={e => handleChange(field.name, e.target.value)}
                  />
                )

              case 'select':
                return (
                  <select
                    key={field.name}
                    className="border rounded p-2"
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
                    onChange={e => handleChange(field.name, e.target.value)}
                  />
                )
            }
          })}

          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
