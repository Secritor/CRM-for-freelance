import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import EmptyState from '@/app/components/EmptyState'
import { Users } from 'lucide-react'

describe('EmptyState', () => {
  it('renders icon, title and description', () => {
    render(
      <EmptyState
        icon={<Users data-testid="empty-icon" />}
        title="No clients found"
        description="Add your first client"
      />
    )
    expect(screen.getByTestId('empty-icon')).toBeInTheDocument()
    expect(screen.getByText('No clients found')).toBeInTheDocument()
    expect(screen.getByText('Add your first client')).toBeInTheDocument()
  })

  it('applies optional className to wrapper', () => {
    const { container } = render(
      <EmptyState
        icon={<span />}
        title="Empty"
        description="Desc"
        className="custom_class"
      />
    )
    const wrapper = container.querySelector('.custom_class')
    expect(wrapper).toBeInTheDocument()
  })
})
