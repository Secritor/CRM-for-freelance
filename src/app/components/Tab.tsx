import { Plus, Search, Edit, Trash, DollarSign, User, Pencil, Car } from 'lucide-react'
import styles from './Tab.module.css'
export default function Tab({ array }) {
  return (
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
          {array.map(deal => (
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
                <span className={`status-badge ${getStatusColor(deal.status)}`}>{deal.status}</span>
              </td>
              <td>
                <p>Start: {deal.startDate}</p>
                <p>End: {deal.endDate}</p>
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
  )
}
