import { ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Star, SunReading } from '@/components/brand/Doodles';
import { Wordmark } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { PasswordField } from '@/components/ui/PasswordField';
import { FullPageLoader } from '@/components/RouteGuards';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getErrorMessage } from '@/services/api';
import { fieldErrors, loginSchema } from '@/utils/validation';

export default function AdminLoginPage() {
  const { admin, loading, login } = useAdminAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <FullPageLoader />;
  if (admin) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    const r = fieldErrors(loginSchema, values);
    if (!r.ok) return setErrors(r.errors);
    setSubmitting(true);
    try {
      await login(r.data.email, r.data.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setFormError(getErrorMessage(err, 'Invalid email or password.'));
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-4xl bg-cream shadow-lift md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-teal-500 p-9 text-white md:flex" aria-hidden>
          <div className="w-fit rounded-2xl bg-white px-3 py-2">
            <Wordmark className="text-2xl" />
          </div>
          <SunReading className="mx-auto w-52" />
          <p className="font-display text-xl font-medium">Manage printables, categories and messages in one place.</p>
          <Star className="absolute right-8 top-8 h-7 w-7" />
        </div>
        <div className="p-7 sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
            <ShieldCheck className="h-4 w-4" aria-hidden /> Admin area
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold">Sign in to the studio</h1>
          <p className="mt-1 text-ink-500">Only Tegron team accounts can access this area.</p>
          <form onSubmit={submit} noValidate className="mt-7 grid gap-4">
            {formError && <p role="alert" className="rounded-2xl bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-700">{formError}</p>}
            <TextField
              label="Email" type="email" autoComplete="username" autoFocus maxLength={254}
              value={values.email} error={errors.email}
              onChange={(e) => { setValues((v) => ({ ...v, email: e.target.value })); setErrors({}); }}
            />
            <PasswordField
              label="Password" autoComplete="current-password"
              value={values.password} error={errors.password}
              onChange={(e) => { setValues((v) => ({ ...v, password: e.target.value })); setErrors({}); }}
            />
            <Button type="submit" variant="teal" size="lg" loading={submitting} loadingText="Signing in..." className="mt-2 w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
