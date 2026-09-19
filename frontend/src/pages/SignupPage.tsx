import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { PasswordField } from '@/components/ui/PasswordField';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthLayout } from '@/layouts/AuthLayout';
import { getErrorMessage, getFieldErrors } from '@/services/api';
import { safeRedirect } from '@/utils/navigation';
import { fieldErrors, signupSchema } from '@/utils/validation';

export default function SignupPage() {
  const { user, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user && !submitting) return <Navigate to={redirect} replace />;

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setFormError('');
    const r = fieldErrors(signupSchema, values);
    if (!r.ok) return setErrors(r.errors);
    setSubmitting(true);
    try {
      await signup(r.data.name, r.data.email, r.data.password);
      toast.success('Welcome to the Tegron family! 🌱');
      navigate(redirect, { replace: true });
    } catch (err) {
      const fe = getFieldErrors(err);
      setErrors(fe);
      if (!Object.keys(fe).length) setFormError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  const loginHref = `/${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`;

  return (
    <AuthLayout
      title="Join the Tegron family! 🌱"
      subtitle="Create an account to share your questions and ideas."
      note="Print, play, learn, repeat"
    >
      <form onSubmit={submit} noValidate className="grid gap-4">
        {formError && (
          <p role="alert" className="rounded-2xl bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-700">{formError}</p>
        )}
        <TextField label="Name" autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} maxLength={60} autoFocus />
        <TextField label="Email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} maxLength={254} />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          value={values.password}
          onChange={set('password')}
          error={errors.password}
          hint="At least 8 characters, with a letter and a number."
        />
        <PasswordField label="Confirm password" autoComplete="new-password" value={values.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        <Button type="submit" size="lg" loading={submitting} loadingText="Creating account..." className="mt-2 w-full">Create Account</Button>
      </form>
      <p className="mt-6 text-center text-ink-500">
        Already have an account?{' '}
        <Link to={loginHref} className="font-bold text-teal-700 underline-offset-4 hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}