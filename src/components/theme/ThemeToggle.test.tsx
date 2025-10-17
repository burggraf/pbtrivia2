import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('renders all appearance options with the system mode selected by default', () => {
    render(<ThemeToggle />)

    const systemOption = screen.getByRole('radio', { name: /follow your device preference/i })
    expect(systemOption).toHaveAttribute('aria-checked', 'true')

    expect(screen.getByRole('radio', { name: /use the light appearance/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /use the dark appearance/i })).toBeInTheDocument()
  })

  it('lets the user switch themes via pointer and keyboard interaction', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const lightOption = screen.getByRole('radio', { name: /use the light appearance/i })
    const darkOption = screen.getByRole('radio', { name: /use the dark appearance/i })
    const systemOption = screen.getByRole('radio', { name: /follow your device preference/i })

    await user.click(darkOption)
    expect(darkOption).toHaveAttribute('aria-checked', 'true')

    await user.keyboard('{ArrowRight}')
    await screen.findByRole('radio', { name: /follow your device preference/i, checked: true })

    await user.keyboard('{ArrowRight}')
    await screen.findByRole('radio', { name: /use the light appearance/i, checked: true })

    expect(lightOption).toHaveAttribute('aria-checked', 'true')

    await user.keyboard('{ArrowRight}')
    await screen.findByRole('radio', { name: /use the dark appearance/i, checked: true })
  })
})
