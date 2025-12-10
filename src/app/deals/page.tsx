'use client'
import React, { useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import './deals.css'
import Title from '../components/Title'
import CardList from '../components/CardList'
import { useDispatch, useSelector } from 'react-redux'
import {
  addDeal,
  updateDeal,
  deleteDeal,
  setDeals,
  setClients,
  setSearchTerm,
  setStatusFilter,
  openEditModal,
  closeModal,
} from '../../features/deals/dealsSlice'
import { RootState } from '@/store/store'
import Tab from '../components/Tab'
import HandleModal from '../components/HandleModal'

const Deals = () => {
  const dispatch = useDispatch()

  const { deals, clients, searchTerm, statusFilter, editingDeal, isModalOpen } = useSelector(
    (state: RootState) => state.deals
  )

  useEffect(() => {
    dispatch(
      setClients([
        { id: 1, name: 'John Smith', company: 'TechCorp Inc.' },
        { id: 2, name: 'Sarah Johnson', company: 'StartupXYZ' },
        { id: 3, name: 'Mike Wilson', company: 'Creative Agency' },
      ])
    )

    dispatch(
      setDeals([
        {
          id: 1,
          title: 'Website Redesign',
          clientId: 1,
          clientName: 'John Smith',
          clientCompany: 'TechCorp Inc.',
          amount: 2500,
          status: 'active',
          startDate: '',
          endDate: '',
          description: 'Complete website redesign with modern UI/UX',
          createdAt: '',
        },
        {
          id: 2,
          title: 'Mobile App Development',
          clientId: 2,
          clientName: 'Sarah Johnson',
          clientCompany: 'StartupXYZ',
          amount: 5000,
          status: 'pending',
          startDate: '',
          endDate: '',
          description: 'iOS and Android mobile application development',
          createdAt: '',
        },
        {
          id: 3,
          title: 'Logo Design',
          clientId: 3,
          clientName: 'Mike Wilson',
          clientCompany: 'Creative Agency',
          amount: 800,
          status: 'completed',
          startDate: '',
          endDate: '',
          description: 'Brand logo and identity design',
          createdAt: '',
        },
        {
          id: 4,
          title: 'E-commerce Platform',
          clientId: 1,
          clientName: 'John Smith',
          clientCompany: 'TechCorp Inc.',
          amount: 3500,
          status: 'active',
          startDate: '',
          endDate: '',
          description: 'Full e-commerce platform with payment integration',
          createdAt: '',
        },
      ])
    )
  }, [dispatch])

  const handleDeleteDeal = (dealId: number) => {
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

  const dealStat = [
    {
      key: crypto.randomUUID(),
      title: 'Total value',
      value: totalValue,
      color: 'primary',
      icon: 'dollarSign',
    },
    {
      key: crypto.randomUUID(),
      title: 'Active Deals',
      value: activeValue,
      color: 'success',
      icon: 'dollarSign',
    },
    {
      key: crypto.randomUUID(),
      title: 'Completed',
      value: completedValue,
      color: 'primary',
      icon: 'dollarSign',
    },
  ]

  return (
    <div className="deals-container">
      <Title
        titleText="Deals"
        subtitleText="Manage your deals and track progress"
        buttonText="Add Deal"
        buttonIcon={<Plus />}
        onButtonClick={() => dispatch(openEditModal(null as any))}
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

      <HandleModal
        open={isModalOpen}
        onClose={() => dispatch(closeModal())}
        title={editingDeal ? 'Edit deal' : 'Add new deal'}
        initialValues={
          editingDeal || {
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
          if (editingDeal) dispatch(updateDeal({ ...editingDeal, ...data }))
          else dispatch(addDeal(data as any))

          dispatch(closeModal())
        }}
      />
    </div>
  )
}

export default Deals
