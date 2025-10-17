import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import type { AuthView } from './types'

type RegisterNavigationTarget = Extract<AuthView, 'login'>

export type RegisterFormProps = {
  onNavigate?: (target: RegisterNavigationTarget) => void
  onSuccess?: () => void
}

type FieldErrors = {
  email?: string
  displayName?: string
  password?: string
  passwordConfirm?: string
  form?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterForm({ onNavigate, onSuccess }: RegisterFormProps) {
  const { register } = useAuth()
  const [values, setValues] = useState({
    email: '',
    displayName: '',
    password: '',
    passwordConfirm: ''
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const nextErrors: FieldErrors = {}

    const trimmedEmail = values.email.trim()
    if (!trimmedEmail) {
      nextErrors.email = 'Email is required'
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email'
    }

    const trimmedDisplayName = values.displayName.trim()
    if (!trimmedDisplayName) {
      nextErrors.displayName = 'Display name is required'
    } else if (trimmedDisplayName.length > 50) {
      nextErrors.displayName = 'Display name must be 50 characters or fewer'
    }

    if (values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'
    }

    if (!values.passwordConfirm) {
      nextErrors.passwordConfirm = 'Confirm password is required'
    } else if (values.password !== values.passwordConfirm) {
      nextErrors.passwordConfirm = 'Passwords must match'
    }

    return nextErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        email: values.email.trim(),
        displayName: values.displayName.trim(),
        password: values.password,
        passwordConfirm: values.passwordConfirm
      })
      setValues(prev => ({ ...prev, password: '', passwordConfirm: '' }))
      setErrors({})
      onSuccess?.()
    } catch (error) {
      const message =
        (error as { message?: string })?.message?.trim() ||
        'Unable to create account. Please try again.'
      setErrors(prev => ({ ...prev, form: message }))
      setValues(prev => ({ ...prev, password: '', passwordConfirm: '' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {errors.form ? (
        <Alert variant="destructive" data-testid="register-error">
          <AlertDescription>{errors.form}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
        />
        {errors.email ? (
          <p className="text-sm text-red-600" id="register-email-error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-display-name">Display name</Label>
        <Input
          id="register-display-name"
          name="displayName"
          type="text"
          maxLength={50}
          autoComplete="name"
          value={values.displayName}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={errors.displayName ? 'register-display-name-error' : undefined}
        />
        {errors.displayName ? (
          <p className="text-sm text-red-600" id="register-display-name-error">
            {errors.displayName}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'register-password-error' : undefined}
        />
        {errors.password ? (
          <p className="text-sm text-red-600" id="register-password-error">
            {errors.password}
          </p>
        ) : (
          <p className="text-xs text-gray-500">Use at least 8 characters.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password-confirm">Confirm password</Label>
        <Input
          id="register-password-confirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          value={values.passwordConfirm}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.passwordConfirm)}
          aria-describedby={errors.passwordConfirm ? 'register-password-confirm-error' : undefined}
        />
        {errors.passwordConfirm ? (
          <p className="text-sm text-red-600" id="register-password-confirm-error">
            {errors.passwordConfirm}
          </p>
        ) : null}
      </div>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          className="font-medium text-gray-900 underline-offset-4 hover:underline"
          onClick={() => onNavigate?.('login')}
        >
          Sign in
        </button>
      </div>
    </form>
  )
}
