import { SubmissionsAdmin } from '@/components/admin/SubmissionsAdmin';
import { adminService } from '@/services/admin.service';
import type { CustomerQuery, QueryStatus } from '@/types';

const fetcher = adminService.queries.list;
const setStatus = (id: string, s: string) => adminService.queries.setStatus(id, s as QueryStatus);

export default function AdminQueries() {
  return (
    <SubmissionsAdmin<CustomerQuery>
      title="Queries"
      noun="Query"
      statuses={['pending', 'resolved']}
      doneLabel="Mark resolved"
      fetcher={fetcher}
      setStatus={setStatus}
      remove={adminService.queries.remove}
      columns={[{ key: 'q', header: 'Query', primary: true, render: (q) => <span className="line-clamp-2 md:max-w-sm">{q.query}</span> }]}
      renderBody={(q) => <p className="whitespace-pre-line break-words rounded-2xl bg-white p-4 leading-relaxed shadow-paper">{q.query}</p>}
    />
  );
}
