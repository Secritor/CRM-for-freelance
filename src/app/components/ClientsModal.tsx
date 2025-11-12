'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
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
import { Spinner } from '@/components/ui/spinner'
import type { Client } from '@/interfaces/main'
import {
  addClient,
  updateClient,
  setEditingClient,
  setModalOpen,
} from '@/features/clients/clientsSlice'

export default function ClientsModal() {
  const dispatch: AppDispatch = useDispatch()
  const { modalOpen, editingClient } = useSelector((state: RootState) => state.clients)

  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)

  // При открытии модалки устанавливаем форму
  useEffect(() => {
    if (editingClient) {
      const { id, createdAt, ...rest } = editingClient
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
  }, [editingClient, modalOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // имитация запроса к API
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingClient) {
      dispatch(updateClient({ ...editingClient, ...formData }))
    } else {
      dispatch(addClient(formData))
    }

    setLoading(false)
    dispatch(setModalOpen(false))
    dispatch(setEditingClient(null))
  }

  return (
    <Dialog open={modalOpen} onOpenChange={open => dispatch(setModalOpen(open))}>
      <DialogContent className={styles.modal_container}>
        <DialogHeader>
          <DialogTitle>{editingClient ? 'Edit client' : 'Add new client'}</DialogTitle>
          <DialogDescription>
            {editingClient
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
              <>{editingClient ? 'Save changes' : 'Add client'}</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
