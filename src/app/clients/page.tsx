'use client'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import styles from './clients.module.css'
import { Plus, Trash, Search, Phone, Mail, MapPin, Pencil, Users } from 'lucide-react'
import UniversalModal from '../components/UniversalModal'
import Title from '../components/Title'
import EmptyState from '../components/EmptyState'
import {
  addClient,
  updateClient,
  deleteClient,
  setSearch,
  setEditingClient,
  setModalOpen,
} from '@/features/clients/clientsSlice'

export default function Clients() {
  const dispatch: AppDispatch = useDispatch()
  const { clients, search, editingClient, modalOpen } = useSelector(
    (state: RootState) => state.clients
  )

  // Фильтрация клиентов
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDeleteClient = (id: number | string) => dispatch(deleteClient(id))
  const handleEditClient = (id: number | string) => {
    const clientToEdit = clients.find(c => c.id === id)
    if (!clientToEdit) return
    dispatch(setEditingClient(clientToEdit))
    dispatch(setModalOpen(true))
  }

  return (
    <div className={styles.container}>
      <Title
        titleText={'Clients'}
        subtitleText={'Manage your client relationships'}
        buttonText={'Add Client'}
        buttonIcon={<Plus />}
        onButtonClick={() => dispatch(setModalOpen(true))}
      />

      <UniversalModal
        open={modalOpen}
        onClose={() => dispatch(setModalOpen(false))}
        title={editingClient ? 'Edit client' : 'Add client'}
        description="Fill in the client data"
        submitText={editingClient ? 'Save' : 'Add'}
        initialValues={
          editingClient
            ? {
                name: editingClient.name,
                email: editingClient.email,
                phone: editingClient.phone,
                company: editingClient.company,
                address: editingClient.address,
                notes: editingClient.notes,
              }
            : {
                name: '',
                email: '',
                phone: '',
                company: '',
                address: '',
                notes: '',
              }
        }
        fields={[
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'address', label: 'Address', type: 'text' },
          { name: 'notes', label: 'Notes', type: 'textarea' },
        ]}
        onSubmit={data => {
          const clientData = {
            name: String(data.name ?? ''),
            email: String(data.email ?? ''),
            phone: String(data.phone ?? ''),
            company: String(data.company ?? ''),
            address: String(data.address ?? ''),
            notes: String(data.notes ?? ''),
          }

          if (editingClient) {
            dispatch(updateClient({ ...editingClient, ...clientData }))
          } else {
            dispatch(addClient(clientData))
          }
          dispatch(setModalOpen(false))
        }}
      />

      <div className={styles.search_wrapper}>
        <Search className={styles.search_icon} />
        <input
          type="text"
          placeholder="Search client..."
          value={search}
          onChange={e => dispatch(setSearch(e.target.value))}
          className={styles.search_input}
        />
      </div>

      <div className={styles.clients_list}>
        {filteredClients.length === 0 ? (
          <EmptyState
            icon={<Users />}
            title="No clients found"
            description="Add your first client or adjust your search"
            className={styles.empty_state_wrapper}
          />
        ) : (
          filteredClients.map(client => (
            <div key={client.id} className={styles.client_card}>
              <div className={styles.cliend_title}>
                <div className={styles.cleint_header_info}>
                  <h3 className={styles.client_name}>{client.name}</h3>
                  <p>{client.company}</p>
                </div>
                <div className={styles.client_edit_icon}>
                  <button
                    className={styles.delete_button}
                    onClick={() => handleEditClient(client.id)}
                  >
                    <Pencil className={styles.delete_icon} />
                  </button>
                  <button
                    className={styles.delete_button}
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash className={styles.delete_icon} />
                  </button>
                </div>
              </div>
              <div className={styles.client_info}>
                <p className={styles.client_info_item}>
                  <Mail className={styles.client_icon} /> {client.email}
                </p>
                <p className={styles.client_info_item}>
                  <Phone className={styles.client_icon} /> {client.phone}
                </p>
                <p className={styles.client_info_item}>
                  <MapPin className={styles.client_icon} /> {client.address}
                </p>
              </div>
              <div className={styles.client_addition_info}>
                <p>{client.notes}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
