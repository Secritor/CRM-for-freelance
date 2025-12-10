import {
  addDeal,
  updateDeal,
  deleteDeal,
  setDeals,
  setClients,
  setSearchTerm,
  setStatusFilter,
} from '../../features/deals/dealsSlice'

export default function dealsModal ({opepingStatus, formData, clients, handleEditDeal, handleAddDeal}) {
    return (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{opepingStatus.editingDeal ? 'Edit Deal' : 'Add New Deal'}</h2>
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
              <button onClick={opepingStatus.editingDeal ? handleEditDeal : handleAddDeal}>
                {opepingStatus.editingDeal ? 'Update Deal' : 'Add Deal'}
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
      )});
}