import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Bulb, Envelope, Heart, Sparkle, Star } from '@/components/brand/Doodles';
import { Button, buttonClass } from '@/components/ui/Button';
import { TextAreaField, TextField } from '@/components/ui/Field';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage, getFieldErrors } from '@/services/api';
import { memberService } from '@/services/member.service';
import { drafts, HOME_PATH } from '@/utils/navigation';
import { fieldErrors, ideaSchema, querySchema } from '@/utils/validation';
import { AuthPromptModal } from './AuthPromptModal';

type Values = Record<string, string>;

/** Shared state for both member forms: prefill, draft restore, auth gate, validation. */
function useSubmissionForm(key: 'ask' | 'idea', initial: Values) {
  const { user } = useAuth();
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Values>({});
  const [submitting, setSubmitting] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [done, setDone] = useState(false);

  // Restore a draft saved before the visitor went to log in
  useEffect(() => {
    const d = drafts.take(key);
    if (d) setValues((v) => ({ ...v, ...d }));
  }, [key]);

  // Prefill from the account without overwriting anything typed
  useEffect(() => {
    if (!user) return;
    setValues((v) => ({ ...v, name: v.name || user.name, email: v.email || user.email }));
  }, [user]);

  const bind = (name: string) => ({
    name,
    value: values[name] ?? '',
    error: errors[name],
    onChange: (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [name]: e.target.value }));
      if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
    },
  });

  return { user, values, setValues, errors, setErrors, submitting, setSubmitting, needsAuth, setNeedsAuth, done, setDone, bind };
}

function FormCard({ tone, art, title, lead, children, id, labelledBy }: {
  tone: 'teal' | 'coral'; art: ReactNode; title: string; lead: string; children: ReactNode; id: string; labelledBy: string;
}) {
  const bg = tone === 'teal' ? 'bg-teal-50' : 'bg-coral-50';
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative rounded-4xl ${bg} p-5 sm:p-8`}>
      <div className="flex items-start gap-4">
        <div className="relative hidden shrink-0 sm:block">{art}</div>
        <div>
          <h2 id={labelledBy} className="font-display text-[1.75rem] font-semibold leading-tight sm:text-3xl">{title}</h2>
          <p className="mt-1.5 text-ink-500">{lead}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Success({ text, to, cta, onAgain }: { text: string; to: string; cta: string; onAgain: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-paper">
      <CheckCircle2 className="h-12 w-12 text-leaf-500" aria-hidden />
      <p className="mt-3 font-display text-xl font-semibold">{text}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to={to} className={buttonClass('teal')}>{cta} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        <Button variant="secondary" onClick={onAgain}>Send another</Button>
      </div>
    </div>
  );
}

function GuestNote({ text, back }: { text: string; back: string }) {
  return (
    <p className="mt-3 text-center text-sm text-ink-500 sm:text-left">
      {text}{' '}
      <Link to={`/?redirect=${encodeURIComponent(back)}`} className="font-bold text-teal-700 underline-offset-4 hover:underline">Log in</Link> or{' '}
      <Link to={`/signup?redirect=${encodeURIComponent(back)}`} className="font-bold text-coral-700 underline-offset-4 hover:underline">sign up</Link>.
    </p>
  );
}

export function AskSection() {
  const toast = useToast();
  const f = useSubmissionForm('ask', { name: '', email: '', query: '' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.submitting) return;
    if (!f.user) {
      drafts.save('ask', f.values);
      f.setNeedsAuth(true);
      return;
    }
    const r = fieldErrors(querySchema, f.values);
    if (!r.ok) return f.setErrors(r.errors);
    f.setSubmitting(true);
    try {
      await memberService.submitQuery(r.data);
      toast.success('Query submitted successfully 💌');
      f.setValues((v) => ({ ...v, query: '' }));
      f.setDone(true);
    } catch (err) {
      f.setErrors(getFieldErrors(err));
      toast.error(getErrorMessage(err));
    } finally {
      f.setSubmitting(false);
    }
  };

  return (
    <FormCard
      id="ask"
      labelledBy="ask-title"
      tone="teal"
      title="Have a Question?"
      lead="Need help or have something you'd like to ask? We'd love to hear from you."
      art={<><Envelope className="h-20 w-24" /><Heart className="absolute -right-1 -top-2 h-5 w-5" /></>}
    >
      {f.done ? (
        <Success text="Thanks! Your question is on its way." to="/dashboard?tab=queries" cta="View my questions" onAgain={() => f.setDone(false)} />
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" maxLength={60} {...f.bind('name')} />
            <TextField label="Email" type="email" autoComplete="email" maxLength={254} {...f.bind('email')} />
          </div>
          <TextAreaField
            label="Your question"
            placeholder="Do you have more alphabet activities?"
            maxLength={2000}
            hint={`${(f.values.query ?? '').length}/2000`}
            {...f.bind('query')}
          />
          <Button type="submit" variant="teal" size="lg" loading={f.submitting} loadingText="Submitting..." className="sm:justify-self-start">
            Send question
          </Button>
          {!f.user && <GuestNote back={`${HOME_PATH}#ask`} text="You'll need an account to send a question." />}
        </form>
      )}
      <AuthPromptModal
        open={f.needsAuth}
        onClose={() => f.setNeedsAuth(false)}
        title="Almost there! ✨"
        text="Please log in or create an account to send us your question."
        returnTo={`${HOME_PATH}#ask`}
      />
    </FormCard>
  );
}

export function IdeaSection() {
  const toast = useToast();
  const f = useSubmissionForm('idea', { name: '', email: '', productIdea: '', description: '' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.submitting) return;
    if (!f.user) {
      drafts.save('idea', f.values);
      f.setNeedsAuth(true);
      return;
    }
    const r = fieldErrors(ideaSchema, f.values);
    if (!r.ok) return f.setErrors(r.errors);
    f.setSubmitting(true);
    try {
      await memberService.submitIdea(r.data);
      toast.success('Idea submitted successfully 💡');
      f.setValues((v) => ({ ...v, productIdea: '', description: '' }));
      f.setDone(true);
    } catch (err) {
      f.setErrors(getFieldErrors(err));
      toast.error(getErrorMessage(err));
    } finally {
      f.setSubmitting(false);
    }
  };

  return (
    <FormCard
      id="idea"
      labelledBy="idea-title"
      tone="coral"
      title="Have an Idea for a Printable?"
      lead="Your ideas inspire what we create next. Tell us what you'd love to see!"
      art={<><Bulb className="h-20 w-16" /><Sparkle className="absolute -right-2 top-0 h-5 w-5 text-coral-400" /></>}
    >
      {f.done ? (
        <Success text="Love it! Your idea has been shared." to="/dashboard?tab=ideas" cta="View my ideas" onAgain={() => f.setDone(false)} />
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Name" autoComplete="name" maxLength={60} {...f.bind('name')} />
            <TextField label="Email" type="email" autoComplete="email" maxLength={254} {...f.bind('email')} />
          </div>
          <TextField label="Product idea" placeholder="Ocean animals counting cards" maxLength={120} {...f.bind('productIdea')} />
          <TextAreaField
            label="Description"
            placeholder="Who is it for, and what would they do with it?"
            maxLength={2000}
            hint={`${(f.values.description ?? '').length}/2000`}
            {...f.bind('description')}
          />
          <Button type="submit" size="lg" loading={f.submitting} loadingText="Submitting..." className="sm:justify-self-start">
            Share my idea
          </Button>
          {!f.user && <GuestNote back={`${HOME_PATH}#idea`} text="You'll need an account to share an idea." />}
        </form>
      )}
      <AuthPromptModal
        open={f.needsAuth}
        onClose={() => f.setNeedsAuth(false)}
        title="We'd love to hear your idea! 💡"
        text="Create an account or log in to share it with us."
        returnTo={`${HOME_PATH}#idea`}
      />
    </FormCard>
  );
}

export function ConnectSection() {
  return (
    <div className="relative py-14 sm:py-20">
      <Star className="pointer-events-none absolute left-[3%] top-10 hidden h-7 w-7 rotate-12 lg:block" />
      <p className="pointer-events-none absolute right-[3%] top-2 hidden rotate-6 font-hand text-2xl leading-tight text-ink-700 xl:block">
        Play, create,<br />imagine, grow
      </p>
      <div className="page-container grid items-start gap-6 lg:grid-cols-2">
        <AskSection />
        <IdeaSection />
      </div>
    </div>
  );
}