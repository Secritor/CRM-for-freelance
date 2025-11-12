'use client'
import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash, DollarSign, User, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import './deals.css'
import Title from '../components/Title'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    amount: '',
    status: 'pending',
    startDate: '',
    endDate: '',
    description: '',
  })

  useEffect(() => {
    setClients([
      { id: 1, name: 'John Smith', company: 'TechCorp Inc.' },
      { id: 2, name: 'Sarah Johnson', company: 'StartupXYZ' },
      { id: 3, name: 'Mike Wilson', company: 'Creative Agency' },
    ])

    setDeals([
      {
        id: 1,
        title: 'Website Redesign',
        clientId: 1,
        clientName: 'John Smith',
        clientCompany: 'TechCorp Inc.',
        amount: 2500,
        status: 'active',
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2024, 3, 15),
        description: 'Complete website redesign with modern UI/UX',
        createdAt: new Date(2024, 0, 15),
      },
      {
        id: 2,
        title: 'Mobile App Development',
        clientId: 2,
        clientName: 'Sarah Johnson',
        clientCompany: 'StartupXYZ',
        amount: 5000,
        status: 'pending',
        startDate: new Date(2024, 1, 20),
        endDate: new Date(2024, 4, 20),
        description: 'iOS and Android mobile application development',
        createdAt: new Date(2024, 0, 20),
      },
      {
        id: 3,
        title: 'Logo Design',
        clientId: 3,
        clientName: 'Mike Wilson',
        clientCompany: 'Creative Agency',
        amount: 800,
        status: 'completed',
        startDate: new Date(2024, 0, 10),
        endDate: new Date(2024, 0, 25),
        description: 'Brand logo and identity design',
        createdAt: new Date(2024, 0, 5),
      },
      {
        id: 4,
        title: 'E-commerce Platform',
        clientId: 1,
        clientName: 'John Smith',
        clientCompany: 'TechCorp Inc.',
        amount: 3500,
        status: 'active',
        startDate: new Date(2024, 2, 1),
        endDate: new Date(2024, 5, 1),
        description: 'Full e-commerce platform with payment integration',
        createdAt: new Date(2024, 1, 15),
      },
    ])
  }, [])

  const handleAddDeal = () => {
    if (!formData.title || !formData.clientId || !formData.amount) {
      toast.error('Please fill in required fields')
      return
    }
    const selectedClient = clients.find(c => c.id === parseInt(formData.clientId))
    const newDeal = {
      id: Date.now(),
      title: formData.title,
      clientId: parseInt(formData.clientId),
      clientName: selectedClient.name,
      clientCompany: selectedClient.company,
      amount: parseFloat(formData.amount),
      status: formData.status,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      description: formData.description,
      createdAt: new Date(),
    }
    setDeals([...deals, newDeal])
    setFormData({
      title: '',
      clientId: '',
      amount: '',
      status: 'pending',
      startDate: '',
      endDate: '',
      description: '',
    })
    setShowAddModal(false)
    toast.success('Deal added successfully!')
  }

  const handleEditDeal = () => {
    if (!formData.title || !formData.clientId || !formData.amount) {
      toast.error('Please fill in required fields')
      return
    }
    const selectedClient = clients.find(c => c.id === parseInt(formData.clientId))
    setDeals(
      deals.map(deal =>
        deal.id === editingDeal.id
          ? {
              ...deal,
              title: formData.title,
              clientId: parseInt(formData.clientId),
              clientName: selectedClient.name,
              clientCompany: selectedClient.company,
              amount: parseFloat(formData.amount),
              status: formData.status,
              startDate: new Date(formData.startDate),
              endDate: new Date(formData.endDate),
              description: formData.description,
            }
          : deal
      )
    )
    setEditingDeal(null)
    setFormData({
      title: '',
      clientId: '',
      amount: '',
      status: 'pending',
      startDate: '',
      endDate: '',
      description: '',
    })
    toast.success('Deal updated successfully!')
  }

  const handleDeleteDeal = dealId => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(deal => deal.id !== dealId))
      toast.success('Deal deleted successfully!')
    }
  }

  const openEditModal = deal => {
    setEditingDeal(deal)
    setFormData({
      title: deal.title,
      clientId: deal.clientId.toString(),
      amount: deal.amount.toString(),
      status: deal.status,
      startDate: format(deal.startDate, 'yyyy-MM-dd'),
      endDate: format(deal.endDate, 'yyyy-MM-dd'),
      description: deal.description,
    })
    setShowAddModal(true)
  }

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'pending':
        return 'status-pending'
      case 'completed':
        return 'status-completed'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return 'status-pending'
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
  const activeValue = deals
    .filter(deal => deal.status === 'active')
    .reduce((sum, deal) => sum + deal.amount, 0)
  const completedValue = deals
    .filter(deal => deal.status === 'completed')
    .reduce((sum, deal) => sum + deal.amount, 0)

  return (
    <div className="deals-container">
      <Title
        titleText={'Deals'}
        subtitleText={'Manage your deals and track progress'}
        buttonText={'Add Deal'}
        buttonIcon={<Plus />}
        onButtonClick={() => setShowAddModal(true)}
      />

      <div className="deals-stats">
        <div className="card">
          <DollarSign className="icon-large icon-primary" />
          <div>
            <p className="card-title">Total Value</p>
            <p className="stat-value">${totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="card">
          <DollarSign className="icon-large icon-success" />
          <div>
            <p className="card-title">Active Deals</p>
            <p className="stat-value">${activeValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="card">
          <DollarSign className="icon-large icon-primary" />
          <div>
            <p className="card-title">Completed</p>
            <p className="stat-value">${completedValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="deals-filters">
        <div className="filter-search">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card table-card">
        <table>
          <thead>
            <tr>
              <th>Deal</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Timeline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map(deal => (
              <tr key={deal.id}>
                <td>
                  <h3>{deal.title}</h3>
                  <p>{deal.description}</p>
                </td>
                <td>
                  <div className="client-info">
                    <div className="client-avatar">
                      <User className="icon-small icon-primary" />
                    </div>
                    <div>
                      <p>{deal.clientName}</p>
                      <p>{deal.clientCompany}</p>
                    </div>
                  </div>
                </td>
                <td>${deal.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </td>
                <td>
                  <p>Start: {format(deal.startDate, 'MMM dd, yyyy')}</p>
                  <p>End: {format(deal.endDate, 'MMM dd, yyyy')}</p>
                </td>
                <td>
                  <button onClick={() => openEditModal(deal)} className="card-button">
                    <Pencil className="icon-small" />
                  </button>
                  <button onClick={() => handleDeleteDeal(deal.id)} className="card-button">
                    <Trash className="icon-small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || editingDeal) && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</h2>
            <div className="modal-form">
              <label>Deal Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />

              <label>Client *</label>
              <select
                value={formData.clientId}
                onChange={e => setFormData({ ...formData, clientId: e.target.value })}
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </option>
                ))}
              </select>

              <label>Amount *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />

              <label>Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <label>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              />

              <label>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              />

              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="modal-buttons">
              <button onClick={editingDeal ? handleEditDeal : handleAddDeal}>
                {editingDeal ? 'Update Deal' : 'Add Deal'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingDeal(null)
                  setFormData({
                    title: '',
                    clientId: '',
                    amount: '',
                    status: 'pending',
                    startDate: '',
                    endDate: '',
                    description: '',
                  })
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deals
