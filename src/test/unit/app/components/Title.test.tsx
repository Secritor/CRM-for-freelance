import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import Title from '@/app/components/Title'

describe('Title', () => {
  it('renders title and subtitle', () => {
    render(<Title titleText="Dashboard" subtitleText="Welcome back" />)
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('does not render button when buttonText is not provided', () => {
    render(<Title titleText="Page" subtitleText="Sub" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders button when buttonText and onButtonClick are provided', () => {
    render(
      <Title
        titleText="Clients"
        subtitleText="Manage clients"
        buttonText="Add Client"
        onButtonClick={() => {}}
      />
    )
    const btn = screen.getByRole('button', { name: /add client/i })
    expect(btn).toBeInTheDocument()
  })

  it('calls onButtonClick when button is clicked', async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()
    render(
      <Title
        titleText="Deals"
        subtitleText="Manage deals"
        buttonText="Add Deal"
        onButtonClick={onButtonClick}
      />
    )
    await user.click(screen.getByRole('button', { name: /add deal/i }))
    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })
})
