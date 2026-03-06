'use client'
import React from 'react'
import { Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import './deals.css'

import Title from '../components/Title'
import CardList from '../components/CardList'
import Tab from '../components/Tab'
import UniversalModal from '../components/UniversalModal'

import { useDispatch, useSelector } from 'react-redux'
import {
  addDeal,
  updateDeal,
  deleteDeal,
  setSearchTerm,
  setStatusFilter,
  openEditModal,
  closeModal,
} from '../../features/deals/dealsSlice'
import { RootState } from '@/store/store'
import type { CardItem, Deal } from '@/interfaces/main'

const Deals = () => {
  const dispatch = useDispatch()

  const { deals, searchTerm, statusFilter, editingDeal, isModalOpen } = useSelector(
    (state: RootState) => state.deals
  )
  const { clients: clientsList } = useSelector((state: RootState) => state.clients)

  const clients = clientsList.map(c => ({
    id: c.id,
    name: c.name,
    company: c.company,
  }))

  const handleDeleteDeal = (dealId: Deal['id']) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteDeal(dealId))
      toast.success('Deal deleted!')
    }
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0)
  const activeValue = deals.filter(d => d.status === 'active').reduce((sum, d) => sum + d.amount, 0)
  const completedValue = deals
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0)

  const dealStat: CardItem[] = [
    {
      key: 'total-value',
      title: 'Total value',
      value: totalValue,
      color: 'primary',
      icon: 'dollarSign',
      format: 'money',
    },
    {
      key: 'active-deals',
      title: 'Active Deals',
      value: activeValue,
      color: 'success',
      icon: 'dollarSign',
      format: 'money',
    },
    {
      key: 'completed',
      title: 'Completed',
      value: completedValue,
      color: 'primary',
      icon: 'dollarSign',
      format: 'money',
    },
  ]

  return (
    <div className="deals-container">
      <Title
        titleText="Deals"
        subtitleText="Manage your deals and track progress"
        buttonText="Add Deal"
        buttonIcon={<Plus />}
        onButtonClick={() => dispatch(openEditModal(null))}
      />

      <CardList cards={dealStat} />

      <div className="deals-filters">
        <div className="filter-search">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={e => dispatch(setSearchTerm(e.target.value))}
          />
        </div>

        <select value={statusFilter} onChange={e => dispatch(setStatusFilter(e.target.value))}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Tab
        array={filteredDeals}
        openEditModal={deal => dispatch(openEditModal(deal))}
        handleDeleteDeal={handleDeleteDeal}
      />

      <UniversalModal
        open={isModalOpen}
        onClose={() => dispatch(closeModal())}
        title={editingDeal ? 'Edit deal' : 'Add new deal'}
        submitText={editingDeal ? 'Save' : 'Add'}
        initialValues={
          editingDeal
            ? {
                title: editingDeal.title,
                clientId: editingDeal.clientId,
                amount: editingDeal.amount,
                status: editingDeal.status,
                startDate: editingDeal.startDate,
                endDate: editingDeal.endDate,
                description: editingDeal.description ?? '',
              }
            : {
                title: '',
                clientId: '',
                amount: '',
                status: 'pending',
                startDate: '',
                endDate: '',
                description: '',
              }
        }
        fields={[
          { name: 'title', label: 'Deal Title', type: 'text', required: true },
          {
            name: 'clientId',
            label: 'Client',
            type: 'select',
            required: true,
            options: clients.map(c => ({
              value: c.id,
              label: `${c.name} - ${c.company}`,
            })),
          },
          { name: 'amount', label: 'Amount', type: 'number', required: true },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ],
          },
          { name: 'startDate', label: 'Start date', type: 'date' },
          { name: 'endDate', label: 'End date', type: 'date' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
        onSubmit={data => {
          const client = clients.find(c => c.id === Number(data.clientId))

          const dealData = {
            title: String(data.title ?? ''),
            clientId: Number(data.clientId),
            clientName: client?.name ?? '',
            clientCompany: client?.company ?? '',
            amount: Number(data.amount),
            status: (data.status as 'pending' | 'active' | 'completed' | 'cancelled') ?? 'pending',
            startDate: String(data.startDate ?? ''),
            endDate: String(data.endDate ?? ''),
            description: String(data.description ?? ''),
          }

          if (editingDeal) {
            dispatch(updateDeal({ ...editingDeal, ...dealData }))
          } else {
            dispatch(addDeal(dealData))
          }

          dispatch(closeModal())
        }}
      />
    </div>
  )
}

export default Deals
