import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import type { AuthView } from './types'

type LoginNavigationTarget = Extract<AuthView, 'register' | 'recover'>

export type LoginFormProps = {
  onNavigate?: (target: LoginNavigationTarget) => void
  onSuccess?: () => void
}

type FieldErrors = {
  email?: string
  password?: string
  form?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm({ onNavigate, onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const clearErrors = () => setErrors({})

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const nextErrors: FieldErrors = {}
    if (!values.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email'
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Password is required'
    }

    return nextErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearErrors()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await login({
        email: values.email.trim(),
        password: values.password
      })
      setValues(prev => ({ ...prev, password: '' }))
      clearErrors()
      onSuccess?.()
    } catch (error) {
      const message =
        (error as { message?: string })?.message?.trim() ||
        'Invalid email or password'
      setErrors(prev => ({ ...prev, form: message }))
      setValues(prev => ({ ...prev, password: '' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const passwordInputType = showPassword ? 'text' : 'password'
  const togglePasswordVisibility = () => setShowPassword(current => !current)

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {errors.form ? (
        <Alert variant="destructive" data-testid="login-error">
          <AlertDescription>{errors.form}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
        />
        {errors.email ? (
          <p className="text-sm text-destructive" id="login-email-error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Button
            type="button"
            variant="link"
            className="p-0 text-sm font-medium"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide password' : 'Show password'}
          </Button>
        </div>
        <Input
          id="login-password"
          name="password"
          type={passwordInputType}
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
        />
        {errors.password ? (
          <p className="text-sm text-destructive" id="login-password-error">
            {errors.password}
          </p>
        ) : null}
      </div>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <Button
          type="button"
          variant="link"
          className="p-0 text-sm"
          onClick={() => onNavigate?.('recover')}
        >
          Forgot password?
        </Button>
        <div>
          Need an account?{' '}
          <Button
            type="button"
            variant="link"
            className="p-0 text-sm font-medium"
            onClick={() => onNavigate?.('register')}
          >
            Create one
          </Button>
        </div>
      </div>
    </form>
  )
}
