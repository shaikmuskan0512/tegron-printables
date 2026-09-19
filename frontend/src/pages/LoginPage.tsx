import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { FullPageLoader } from '@/components/RouteGuards';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { PasswordField } from '@/components/ui/PasswordField';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthLayout } from '@/layouts/AuthLayout';
import { getErrorMessage } from '@/services/api';
import { safeRedirect } from '@/utils/navigation';
import { fieldErrors, loginSchema } from '@/utils/validation';

/**
 * The only login page ("/"), shared by customers and admins.
 * The backend decides which one the credentials belong to:
 *   customer -> ?redirect target if there is a safe one, otherwise /dashboard
 *   admin    -> /admin
 */
export default function LoginPage() {
  const { role, loading, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <FullPageLoader />;
  // Already signed in: skip the form.
  if (role && !submitting) return <Navigate to={role === 'admin' ? '/admin' : redirect} replace />;

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    const r = fieldErrors(loginSchema, values);
    if (!r.ok) return setErrors(r.errors);
    setSubmitting(true);
    try {
      const result = await login(r.data.email, r.data.password);
      if (result.role === 'admin') {
        toast.success(`Welcome back, ${result.admin.name.split(' ')[0]}!`);
        navigate('/admin', { replace: true });
      } else {
        toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`);
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      const wrongCredentials = axios.isAxiosError(err) && err.response?.status === 401;
      setFormError(wrongCredentials ? 'Invalid email or password.' : getErrorMessage(err));
      setSubmitting(false);
    }
  };

  const signupHref = `/signup${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`;

  return (
    <AuthLayout title="Welcome back! ✨" subtitle="Let's get back to creating." note="Small printables, big possibilities">
      <form onSubmit={submit} noValidate className="grid gap-4">
        {formError && (
          <p role="alert" className="rounded-2xl bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-700">{formError}</p>
        )}
        <TextField label="Email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} maxLength={254} autoFocus />
        <PasswordField label="Password" autoComplete="current-password" value={values.password} onChange={set('password')} error={errors.password} />
        <Button type="submit" size="lg" loading={submitting} loadingText="Logging in..." className="mt-2 w-full">Login</Button>
      </form>
      <p className="mt-6 text-center text-ink-500">
        New here?{' '}
        <Link to={signupHref} className="font-bold text-coral-700 underline-offset-4 hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  );
}