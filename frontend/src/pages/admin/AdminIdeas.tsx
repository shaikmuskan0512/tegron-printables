import { SubmissionsAdmin } from '@/components/admin/SubmissionsAdmin';
import { adminService } from '@/services/admin.service';
import type { Idea, IdeaStatus } from '@/types';

const fetcher = adminService.ideas.list;
const setStatus = (id: string, s: string) => adminService.ideas.setStatus(id, s as IdeaStatus);

export default function AdminIdeas() {
  return (
    <SubmissionsAdmin<Idea>
      title="Ideas"
      noun="Idea"
      statuses={['submitted', 'reviewed']}
      doneLabel="Mark reviewed"
      fetcher={fetcher}
      setStatus={setStatus}
      remove={adminService.ideas.remove}
      columns={[
        { key: 'idea', header: 'Product idea', primary: true, render: (i) => <span className="font-semibold">{i.productIdea}</span> },
        { key: 'desc', header: 'Description', hideOnMobile: true, render: (i) => <span className="line-clamp-2 text-ink-500 md:max-w-xs">{i.description}</span> },
      ]}
      renderBody={(i) => (
        <div className="rounded-2xl bg-white p-4 shadow-paper">
          <h3 className="font-display text-xl font-semibold">{i.productIdea}</h3>
          <p className="mt-2 whitespace-pre-line break-words leading-relaxed">{i.description}</p>
        </div>
      )}
    />
  );
}
