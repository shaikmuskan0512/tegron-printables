import { Lightbulb, MessageCircleQuestion, RotateCw } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Bulb, Envelope, Heart, Sparkle, Sprout, Star, SunReading } from '@/components/brand/Doodles';
import { Button, buttonClass } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TextField } from '@/components/ui/Field';
import { RowsSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/services/api';
import type { CustomerQuery, Idea } from '@/types';
import { firstName, formatDate } from '@/utils/format';
import { HOME_PATH } from '@/utils/navigation';
import { fieldErrors, nameField } from '@/utils/validation';
import { z } from 'zod';
import { SubmissionList } from './SubmissionList';

export interface MemberData {
  queries: CustomerQuery[];
  ideas: Idea[];
  loading: boolean;
  error: string;
  reload: () => void;
}

const emptyQueries = (
  <EmptyState
    compact
    tone="teal"
    icon={<MessageCircleQuestion className="h-9 w-9" />}
    title="You haven't asked us anything yet."
    text="Questions about a printable? We're happy to help."
    action={<Link to={`${HOME_PATH}#ask`} className={buttonClass('teal')}>Ask a Question</Link>}
  />
);
const emptyIdeas = (
  <EmptyState
    compact
    tone="coral"
    icon={<Lightbulb className="h-9 w-9" />}
    title="Your creative ideas will appear here."
    text="Dreaming of a printable we don't have yet? Tell us."
    action={<Link to={`${HOME_PATH}#idea`} className={buttonClass('primary')}>Share an Idea</Link>}
  />
);

function ErrorBox({ error, reload }: { error: string; reload: () => void }) {
  return (
    <EmptyState
      compact
      tone="coral"
      icon={<RotateCw className="h-8 w-8" />}
      title="Something went wrong."
      text={error}
      action={<Button variant="teal" onClick={reload}>Try again</Button>}
    />
  );
}

function PanelTitle({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-1 text-ink-500">{lead}</p>
    </div>
  );
}

export function HomePanel({ data, onTab }: { data: MemberData; onTab: (t: string) => void }) {
  const { user } = useAuth();
  const stats = [
    { label: 'My Queries', value: data.queries.length, tab: 'queries', tone: 'bg-teal-50', art: <Envelope className="h-14 w-16" /> },
    { label: 'My Ideas', value: data.ideas.length, tab: 'ideas', tone: 'bg-coral-50', art: <Bulb className="h-14 w-12" /> },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-4xl bg-sun-50 p-6 sm:p-9">
        <Sprout className="absolute -bottom-2 right-[38%] hidden h-16 w-14 sm:block" aria-hidden />
        <Star className="absolute right-6 top-5 h-7 w-7 rotate-12 sm:hidden" />
        <div className="relative grid items-center gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Welcome back, {firstName(user?.name ?? '')}! ✨
            </h1>
            <p className="mt-2 text-lg text-ink-700">Thanks for being part of Tegron Printables.</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link to={`${HOME_PATH}#ask`} className={buttonClass('teal')}><MessageCircleQuestion className="h-4 w-4" aria-hidden /> Ask a Question</Link>
              <Link to={`${HOME_PATH}#idea`} className={buttonClass('primary')}><Lightbulb className="h-4 w-4" aria-hidden /> Share an Idea</Link>
            </div>
          </div>
          <SunReading className="hidden w-40 sm:block lg:w-48" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-5" aria-label="Your activity">
        {stats.map((s) => (
          <button key={s.label} onClick={() => onTab(s.tab)} className={`relative flex items-center justify-between gap-2 overflow-hidden rounded-4xl ${s.tone} p-5 text-left transition-transform hover:-translate-y-0.5 sm:p-7`}>
            <span>
              <span className="block font-display text-base font-medium text-ink-700 sm:text-lg">{s.label}</span>
              <span className="mt-1 block font-display text-4xl font-bold sm:text-5xl">
                {data.loading ? <span className="inline-block h-10 w-10 animate-pulse rounded-xl bg-white/70" /> : s.value}
              </span>
            </span>
            <span className="hidden sm:block">{s.art}</span>
          </button>
        ))}
      </section>

      {data.error ? (
        <ErrorBox error={data.error} reload={data.reload} />
      ) : (
        <div className="grid gap-8 xl:grid-cols-2">
          <section aria-labelledby="recent-q" className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="recent-q" className="font-display text-xl font-semibold">Recent questions</h2>
              {data.queries.length > 3 && <button onClick={() => onTab('queries')} className="text-sm font-bold text-teal-700 hover:underline">See all</button>}
            </div>
            {data.loading ? <RowsSkeleton rows={3} /> : <SubmissionList items={data.queries} limit={3} empty={emptyQueries} />}
          </section>
          <section aria-labelledby="recent-i" className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="recent-i" className="font-display text-xl font-semibold">Recent ideas</h2>
              {data.ideas.length > 3 && <button onClick={() => onTab('ideas')} className="text-sm font-bold text-coral-700 hover:underline">See all</button>}
            </div>
            {data.loading ? <RowsSkeleton rows={3} /> : <SubmissionList items={data.ideas} limit={3} empty={emptyIdeas} />}
          </section>
        </div>
      )}
    </div>
  );
}

export function QueriesPanel({ data }: { data: MemberData }) {
  return (
    <div>
      <PanelTitle title="My Queries" lead="Every question you've sent us, and where it's at." />
      {data.error ? <ErrorBox error={data.error} reload={data.reload} /> : data.loading ? <RowsSkeleton /> : <SubmissionList items={data.queries} empty={emptyQueries} />}
    </div>
  );
}

export function IdeasPanel({ data }: { data: MemberData }) {
  return (
    <div>
      <PanelTitle title="My Ideas" lead="The printables you've dreamed up for us." />
      {data.error ? <ErrorBox error={data.error} reload={data.reload} /> : data.loading ? <RowsSkeleton /> : <SubmissionList items={data.ideas} empty={emptyIdeas} />}
    </div>
  );
}

export function ProfilePanel() {
  const { user, updateName } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  if (!user) return null;

  const dirty = name.trim() !== user.name;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (saving || !dirty) return;
    const r = fieldErrors(z.object({ name: nameField }), { name });
    if (!r.ok) return setError(r.errors.name);
    setSaving(true);
    try {
      await updateName(r.data.name);
      toast.success('Your profile was updated.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PanelTitle title="Profile" lead="Your Tegron Printables account details." />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <form onSubmit={save} noValidate className="paper grid gap-5 p-6 sm:p-8">
          <TextField label="Name" value={name} maxLength={60} autoComplete="name" onChange={(e) => { setName(e.target.value); setError(''); }} error={error} />
          <div>
            <span className="field-label">Email</span>
            <p className="rounded-2xl border-2 border-dashed border-cream-200 px-4 py-3 text-ink-700">{user.email}</p>
          </div>
          <div>
            <span className="field-label">Joined</span>
            <p className="px-1 text-ink-700">{formatDate(user.joinedAt)}</p>
          </div>
          <Button type="submit" variant="teal" loading={saving} loadingText="Saving..." disabled={!dirty} className="justify-self-start">
            Save changes
          </Button>
        </form>
        <aside className="relative hidden overflow-hidden rounded-4xl bg-leaf-50 p-6 lg:block" aria-hidden>
          <Sparkle className="absolute right-5 top-5 h-6 w-6 text-sun-500" />
          <Heart className="absolute bottom-6 right-8 h-6 w-6" />
          <p className="font-hand text-2xl leading-snug text-ink-700">Thanks for helping us make learning more joyful!</p>
          <Sprout className="mt-6 h-24 w-20" />
        </aside>
      </div>
    </div>
  );
}