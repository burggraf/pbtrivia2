import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import type { AuthView } from './types'

type PasswordResetNavigationTarget = Extract<AuthView, 'login'>

export type PasswordResetFormProps = {
  onNavigate?: (target: PasswordResetNavigationTarget) => void
}

type FieldErrors = {
  email?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const successMessage =
  'If that email exists, you will receive reset instructions in your inbox shortly.'

export function PasswordResetForm({ onNavigate }: PasswordResetFormProps) {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const validate = () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      return { email: 'Email is required' } satisfies FieldErrors
    }
    if (!emailPattern.test(trimmedEmail)) {
      return { email: 'Enter a valid email' } satisfies FieldErrors
    }
    return {} satisfies FieldErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await requestPasswordReset(email.trim())
    } catch (error) {
      console.error('Password reset request failed', error)
    } finally {
      setSubmitted(true)
      setEmail('')
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-semibold">Reset your password</h2>
        <p className="text-sm text-muted-foreground">
          Enter the email associated with your account and we will send you a reset link.
        </p>
      </div>

      {submitted ? (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="password-reset-email">Email</Label>
        <Input
          id="password-reset-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'password-reset-email-error' : undefined}
        />
        {errors.email ? (
          <p className="text-sm text-destructive" id="password-reset-email-error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <Button type="button" variant="link" className="p-0 text-sm" onClick={() => onNavigate?.('login')}>
          Back to sign in
        </Button>
      </div>
    </form>
  )
}
