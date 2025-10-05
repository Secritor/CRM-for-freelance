'use client'

import React, { useState } from 'react'
import styles from './clients.module.css'
import { Plus, Trash, Search, Phone, Mail, MapPin, Pencil } from 'lucide-react'
import ClientsModal from '../components/ClientsModal'
export interface Client {
  id: number
  name: string
  email: string
  phone: string
  company: string
  address: string
  notes: string
  createdAt: Date
}

const initialClients: Client[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    address: '123 Business St, New York, NY',
    notes: 'Prefers email communication',
    createdAt: new Date(2024, 0, 15),
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@startupxyz.com',
    phone: '+1 (555) 987-6543',
    company: 'StartupXYZ',
    address: '456 Innovation Ave, San Francisco, CA',
    notes: 'Interested in mobile app development',
    createdAt: new Date(2024, 0, 20),
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike@creativeagency.com',
    phone: '+1 (555) 456-7890',
    company: 'Creative Agency',
    address: '789 Design Blvd, Los Angeles, CA',
    notes: 'Regular client, pays on time',
    createdAt: new Date(2024, 1, 5),
  },
]

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [search, setSearch] = useState<string>('')
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const [modalOpen, setModalOpen] = useState(false)

  // update client
  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev =>
      prev.map(client => (client.id === updatedClient.id ? updatedClient : client))
    )
    setEditingClient(null)
  }

  // add new client
  const handleAddClient = (data: Omit<Client, 'id' | 'createAt'>) => {
    const id = clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1
    const newClient: Client = { ...data, id, createdAt: new Date() }
    setClients(prev => [...prev, newClient])
  }

  // input filter
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  )

  // delete client
  const handleDelete = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id))
  }
  // edit client
  const handleEdit = (id: number) => {
    const clientToEdit = clients.find(c => c.id === id)
    if (!clientToEdit) return
    setEditingClient(clientToEdit)
    setModalOpen(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_title}>
          <h1>Clients</h1>
          <p>Manage your client relationships</p>
        </div>

        {/* open modal */}
        <button className={styles.header_button} onClick={() => setModalOpen(true)}>
          <Plus className={styles.header_icon} />
          Add Client
        </button>
      </div>
      {/* modal */}

      <ClientsModal
        open={modalOpen}
        onOpenChange={open => {
          setModalOpen(open)
          if (!open) setEditingClient(null)
        }}
        onAddClient={handleAddClient}
        onEditClient={handleUpdateClient} // 👈 теперь передаём корректную функцию
        initialData={editingClient}
      />
      <div className={styles.search_wrapper}>
        <Search className={styles.search_icon} />
        <input
          type="text"
          placeholder="Search client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.search_input}
        />
      </div>

      <div className={styles.clients_list}>
        {filteredClients.map(client => (
          <div key={client.id} className={styles.client_card}>
            <div className={styles.cliend_title}>
              <div className={styles.cleint_header_info}>
                <h3 className={styles.client_name}>{client.name}</h3>
                <p>{client.company}</p>
              </div>
              <div className={styles.client_edit_icon}>
                <button className={styles.delete_button} onClick={() => handleEdit(client.id)}>
                  <Pencil className={styles.delete_icon} />
                </button>
                <button className={styles.delete_button} onClick={() => handleDelete(client.id)}>
                  <Trash className={styles.delete_icon} />
                </button>
              </div>
            </div>
            <div className={styles.client_info}>
              <p className={styles.client_info_item}>
                <Mail className={styles.client_icon} />
                {client.email}
              </p>
              <p className={styles.client_info_item}>
                <Phone className={styles.client_icon} />
                {client.phone}
              </p>
              <p className={styles.client_info_item}>
                <MapPin className={styles.client_icon} />
                {client.address}
              </p>
            </div>
            <div className={styles.client_addition_info}>
              <p>{client.notes}</p>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && <p className={styles.no_clients}>No clients found.</p>}
      </div>
    </div>
  )
}
