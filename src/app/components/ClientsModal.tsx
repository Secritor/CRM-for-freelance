'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import styles from './ClientsModal.module.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Client } from '../clients/page'
import { Spinner } from '@/components/ui/spinner'

interface ClientsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddClient: (data: Omit<Client, 'id' | 'createdAt'>) => void
  onEditClient?: (data: Client) => void
  initialData?: Client | null
}

export default function ClientsModal({
  open,
  onOpenChange,
  onAddClient,
  onEditClient,
  initialData,
}: ClientsModalProps) {
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, ...rest } = initialData
      setFormData(rest)
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: '',
      })
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (initialData) {
      onEditClient?.({ ...initialData, ...formData })
    } else {
      onAddClient(formData)
    }

    setLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.modal_container}>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit client' : 'Add new client'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the client information and save changes.'
              : 'Fill in the client information and save to add them to your list.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.form_container}>
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className={styles.form_input}
            required
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className={styles.form_input}
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className={styles.form_input}
          />
          <Input
            placeholder="Company"
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
            className={styles.form_input}
          />
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className={styles.form_input}
          />
          <Textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className={styles.form_input}
          />

          <Button type="submit" className={styles.form_button} disabled={loading}>
            {loading ? (
              <>
                <Spinner className={styles.spinner_icon} />
                <span className={styles.spinner_text}>Please wait...</span>
              </>
            ) : (
              <>{initialData ? 'Save changes' : 'Add client'}</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
